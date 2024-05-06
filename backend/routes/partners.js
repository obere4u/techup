const express = require("express");
const router = express.Router();
const Partner = require("../models/partner");
const partnerSchema = require("../schemas/partnerSchema");

//Create new partner
router.post("/", async (req, res) => {
  //Joi schema and validation
  const { error } = partnerSchema.validate(req.body);
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
    partnershipType,
  } = req.body;

  // Checks if a partner with a non-empty reference exists
  // let prevPartner = await Partner.findOne({ reference: { $ne: "" } });

  // if (prevPartner) {
  //   return res.status(400).send("Error creating partner");
  // }

  let partner = new Partner({
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
    organizationWebsite,
  });

  try {
    partner = await partner.save();
    res.status(201).send(partner);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

// GET all partners
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.send(partners);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
