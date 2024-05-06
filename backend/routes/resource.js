const express = require("express");
const router = express.Router();
const Resource = require("../models/resource");
const resourceSchema = require("../schemas/resource");
const verifyUser = require("../utils/verifyUser");

const { errorHandler } = require("../utils/index");

//GET request
router.get("/", async (req, res, next) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    next(errorHandler(500, "Internal server error"));
  }
});

//GET one
router.get("/:week", async (req, res, next) => {
  try {
    const { week } = req.params;
    // console.log("Week:", week); // Log the week number received in the request

    const weekNumber = parseInt(week);
    if (isNaN(weekNumber) || weekNumber < 1) {
      return next(errorHandler(400, "Invalid week number"));
    }

    const resources = await Resource.find({ week: weekNumber });
    //console.log("Resources:", resources); // Log the resources fetched from the database
    res.json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err);
    next(errorHandler(500, "Internal server error"));
  }
});

//POST to new resource under Admin verifyUser,
router.post("/", async (req, res, next) => {
  //Joi schema and validation
  const { error } = resourceSchema.validate(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));
  try {
    const newResource = await Resource.create(req.body);
    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    next(errorHandler(500, "Internal server error"));
  }
});

module.exports = router;
