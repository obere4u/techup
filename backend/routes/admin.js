const Admin = require("../models/admin");
const express = require("express");
const cloudinary = require("../utils/cloudinary");
const verifyUser = require("../utils/verifyUser");
const { BcryptUtils, errorHandler } = require("../utils/index");

// Using Joi for schema validation
const adminSchema = require("../schemas/adminSchema");
const router = express.Router();

// GET all Admin from db
router.get("/", async (req, res, next) => {
  try {
    const admins = await Admin.find();
    res.send(admins);
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

// Get one admin
router.get("/:id", async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return next(errorHandler(404, "Admin not found... 😢"));
    res.send(admin);
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

// Check email before sign-in
router.get("/check-email/:email", async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.params.email });
    if (!admin) return next(errorHandler(404, "No Admin with this email"));
    res.status(200).send(admin);
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

// POST to db and create a new admin
router.post("/", async (req, res, next) => {
  // Joi schema and validation
  const { error } = adminSchema.validate(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));

  const { fullName, email, phoneNumber, gender, role, timestamp } = req.body;

  // Check if email has been registered before
  const registeredAdmin = await Admin.findOne({ email });
  if (registeredAdmin) {
    return next(errorHandler(400, "Email is already associated with an admin"));
  }

  try {
    let admin = new Admin({
      fullName,
      email,
      phoneNumber,
      gender,
      role,
      timestamp,
    });
    admin = await admin.save();
    res.status(201).send(admin);
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

// PUT to update admin
router.put("/update/:adminId", verifyUser, async (req, res, next) => {
  // Ensure that the user is updating their own profile
  if (req.admin.id !== req.params.adminId) {
    return next(
      errorHandler(403, "You are not allowed to update this admin account")
    );
  }

  try {
    // Hash the password if it exists and meets the criteria
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(403, "Password must be at least 6 characters")
        );
      }
      // Validate password format
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/])/.test(
          req.body.password
        )
      ) {
        return next(
          errorHandler(
            403,
            "Password must contain at least one lowercase and one uppercase letter and one special character"
          )
        );
      }
      req.body.password = await BcryptUtils.hashPassword(req.body.password);
    }

    // Validate email format
    if (
      req.body.email &&
      !req.body.email.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)
    ) {
      return next(errorHandler(403, "Email is not valid"));
    }

    // Validate full name format and length
    if (
      req.body.fullName &&
      (!/^[A-Za-z\s]+$/.test(req.body.fullName) || req.body.fullName.length < 3)
    ) {
      return next(
        errorHandler(
          403,
          "Full Name must contain only letters and have at least 3 characters"
        )
      );
    }

    // Validate gender
    if (req.body.gender && !/^[A-Za-z\s]+$/.test(req.body.gender)) {
      return next(errorHandler(403, "Gender must contain only letters"));
    }

    // Construct update object based on provided fields
    const updateAdminObject = { ...req.body };

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      { $set: updateAdminObject },
      { new: true }
    );

    if (updatedAdmin) {
      const { password, ...userWithoutPassword } = updatedAdmin.toObject();
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ error: "Admin not found" });
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
});

// PATCH or edit a single value in a doc
router.patch("/:adminId", async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) return next(errorHandler(404, "Admin not found... 😢"));
    // Update specific fields using req.body
    // Example: admin.name = req.body.name;
    // Save the updated admin document
    await admin.save();
    res.status(200).send(admin);
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

// DELETE from db
router.delete("/:adminId", async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) return next(errorHandler(404, "Admin does not exist."));
    await admin.remove();
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
});

module.exports = router;
