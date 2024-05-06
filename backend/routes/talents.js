/*
 * status(500) is server error
 * status(400) is client error
 */

const { Talent } = require("../models/talent");
const express = require("express");
const cloudinary = require("../utils/cloudinary");
const verifyUser = require("../utils/verifyUser");
const { BcryptUtils, errorHandler } = require("../utils/index");

const { getPagination} = require("../utils/pagination/talentPagination")



//using joi for schema validation
const talentSchema = require("../schemas/talentSchema");
const router = express.Router();

//GET all talents from db
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

  // Calculate skip (offset) based on page number and page size
  const skip = (page - 1) * pageSize;

  try {
    // Fetch paginated talent data from MongoDB
    const talents = await Talent.find().skip(skip).limit(pageSize);

    // Count total number of talents for pagination
    const totalTalents = await Talent.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalTalents / pageSize);

    res.json({ talents, totalPages });
  } catch (error) {
    console.error("Error fetching talent data:", error);
    res.status(500).send("Error fetching talent data");
  }
});

//get one talent
router.get("/:id", async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(404).send("Record not found... U+1F622");
    res.send(talent);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//check email before signin
router.get("/check-email/:email", async (req, res) => {
  try {
    const talent = await Talent.findOne({ email: req.params.email });
    if (!talent) return res.status(404).send("Email not registered");
    res.status(200).send(talent);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//POST to db and create a new user
router.post("/", async (req, res) => {
  //Joi schema and validation
  const { error } = talentSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //mongoose schema
  const {
    fullName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    educationQualification,
    stateOfResidence,
    LGAOfResidence,
    currentAddress,
    programOfChoice,
    experienceLevel,
    haveInternet,
    haveLaptop,
    timestamp,
    portfolioLink,
    number,
  } = req.body;

  //Checks if email have registered before
  let user = await Talent.findOne({ email });

  if (user) {
    return res.status(400).send("This email have already registered");
  }

  // Upload image to Cloudinary
  // let result;
  // try {
  //   result = await cloudinary.uploader.upload(image, {
  //     folder: "talents",
  //     width: 150,
  //     crop: "scale",
  //   });
  // } catch (uploadError) {
  //   return res.status(500).send("Failed to upload image to Cloudinary");
  // }

  let talent = new Talent({
    fullName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    educationQualification,
    stateOfResidence,
    LGAOfResidence,
    currentAddress,
    programOfChoice,
    experienceLevel,
    haveInternet,
    haveLaptop,
    timestamp,
    portfolioLink,
    number,
  });
  // image: {
  //   public_id: result.public_id,
  //   url: result.secure_url,
  // },

  try {
    talent = await talent.save();
    res.status(201).send(talent);
  } catch (error) {
    // console.error("Failed to upload image to Cloudinary:", error);
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

// PUT to update talent
router.put("/update/:userId", verifyUser, async (req, res, next) => {
  // Ensure that the user is updating their own profile
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
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
    if (req.body.email) {
      if (!req.body.email.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
        return next(errorHandler(403, "Email is not valid"));
      }
    }

    // Validate full name format and length
    if (req.body.fullName) {
      if (
        req.body.fullName.match(/^[A-Za-z\s]+$/.test(req.body.fullName)) ||
        req.body.fullName.length < 3
      ) {
        return next(
          errorHandler(
            403,
            "Full Name must contain only letters and have at least 3 characters"
          )
        );
      }
    }

    //validate gender
    if (req.body.gender && !/^[A-Za-z\s]+$/.test(req.body.gender)) {
      return next(errorHandler(403, "Gender must contain only letters"));
    }

    // Validate date of birth format and range
    if (req.body.dateOfBirth) {
      const dateOfBirth = req.body.dateOfBirth;
      const dateOfBirthPattern =
        /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!dateOfBirthPattern.test(dateOfBirth)) {
        return next(
          errorHandler(403, "Date of Birth must follow the format YYYY-MM-DD")
        );
      }

      const minDate = new Date("1945-12-31");
      const maxDate = new Date("2018-12-31");
      const userDateOfBirth = new Date(dateOfBirth);

      if (userDateOfBirth < minDate || userDateOfBirth > maxDate) {
        return next(errorHandler(403, "Your age bracket is not allowed."));
      }
    }

    //validate education qualification
    if (
      req.body.educationQualification &&
      !/^[A-Za-z\\]+$/.test(req.body.educationQualification)
    ) {
      return next(
        errorHandler(403, "Education qualification must contain only letters")
      );
    }

    //validate state Of Residence
    if (
      req.body.stateOfResidence &&
      !/^[A-Za-z\s]+$/.test(req.body.stateOfResidence)
    ) {
      return next(
        errorHandler(403, "State Of Residence must contain only letters")
      );
    }

    //validate LGA Of Residence
    if (
      req.body.LGAOfResidence &&
      !/^[A-Za-z\s]+$/.test(req.body.LGAOfResidence)
    ) {
      return next(
        errorHandler(403, "LGA Of Residence must contain only letters")
      );
    }

    //validate program Of Choice
    if (
      req.body.programOfChoice &&
      !/^[A-Za-z\s/]+$/.test(req.body.programOfChoice)
    ) {
      return next(
        errorHandler(403, "Program Of Choice must contain only letters")
      );
    }

    // Validate portfolio link pattern
    if (req.body.portfolioLink) {
      if (
        !/^(https?:\/\/)?[^\s.]+[.][^\s]{2,}$/i.test(req.body.portfolioLink)
      ) {
        return next(errorHandler(403, "Invalid portfolio link"));
      }
    }

    // Construct update object based on provided fields
    const updateUserObject = { ...req.body };

    let updatedUser; // Declare updatedUser variable

    // Check if isWeekCompleted is provided in the request body
    if (req.body.isWeekCompleted) {
      const updateWeeks = req.body.isWeekCompleted;

      updatedUser = await Talent.findByIdAndUpdate(
        req.params.userId,
        { $set: { isWeekCompleted: updateWeeks } },
        { new: true }
      );
    } else {
      // Update user info without week completion status
      updatedUser = await Talent.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { new: true } // Return the updated document
      );
    }

    // Check if updatedUser is defined before accessing its properties
    if (updatedUser) {
      // Remove password from user object before sending response
      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
});

//PATCH or edit a single value in a doc
router.patch("/:id", async (req, res) => {
  //check if talent exist
  const talent = await Talent.findById(req.params.id);

  if (!talent) return res.status(404).send("Record not found... U+1F622");

  //if it exists
});

//DELETE from db
router.delete("/:id", async (req, res) => {
  //deleteOne()
  //deleteMany()
  //findByIdAndDelete()

  //check if talent exist
  const talent = await Talent.findById(req.params.id);

  if (!talent) return res.status(404).send("Record not found... U+1F622");

  //if it exists
  try {
    const deletedTalent = await Talent.findByIdAndDelete(req.params.id);

    res.send(deletedTalent);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
