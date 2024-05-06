const express = require("express");
const router = express.Router();
const Donor = require("../models/donor");
const donorSchema = require("../schemas/donorSchema");

//Create new donor
router.post("/", async (req, res) => {
  //Joi schema and validation
  const { error } = donorSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //mongoose schema
  const {
    fullName,
    email,
    phone,
    amount,
    reference,
    currentAddress,
    timestamp,
    comment,
    organizationName,
    organizationAddress,
    organizationWebsite,
    partnershipType
  } = req.body;

  //Checks if email have registered before
  let prevDonor = await Donor.findOne({ reference });

  if (prevDonor) {
    return res.status(400).send("Error creating donor");
  }

  let donor = new Donor({
    fullName,
    amount: amount / 100,
    email,
    phone,
    partnershipType,
    reference,
    currentAddress,
    timestamp,
    comment,
    organizationName,
    organizationAddress,
    organizationWebsite
  });

  try {
    donor = await donor.save();
    res.status(201).send(donor);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

// GET all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.send(donors);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;