const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
      trim: true,
    },
    program: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      links: [
        {
          linkUrl: { type: String, required: true, trim: true },
          linkTitle: { type: String, required: true, trim: true },
        },
      ],
    },
    assignments: [
      {
        assignmentUrl: { type: String, trim: true },
        assignmentTitle: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
