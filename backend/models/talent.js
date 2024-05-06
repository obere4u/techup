//mongodb uses collections and documents
const mongoose = require("mongoose");

const talentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
          throw new Error("Email is not valid.");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          // Validate password format
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/])/.test(
            value
          );
        },
        message:
          "Password must contain at least one CAPITAL letter and one SPECIAL character",
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    // confirmPassword: {
    //   type: String,
    //   trim: true,
    //   validate: {
    //     validator(value) {
    //       if (value !== this.password) {
    //         throw new Error("The passwords do not match");
    //       }
    //       // message: "The passwords do not match",
    //     },
    //   },
    // },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    educationQualification: {
      type: String,
      required: true,
    },
    stateOfResidence: {
      type: String,
      required: true,
    },
    LGAOfResidence: {
      type: String,
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    portfolioLink: {
      type: String,
      trim: true,
    },
    programOfChoice: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    haveLaptop: {
      type: String,
      required: true,
    },
    haveInternet: {
      type: String,
      required: true,
    },
    isAdmitted: {
      type: Boolean,
      default: false,
    },
    testScore: {
      type: Number,
      default: null,
    },
    number: {
      type: Number,
    },
    isWeekCompleted: [
      {
        week: { type: Number },
        completed: { type: Boolean },
      },
    ],
    // image: {
    //   public_id: {
    //     type: String,
    //   },
    // }
  },
  {
    timestamps: true,
  }
);

const Talent = mongoose.model("Talent", talentSchema);

exports.Talent = Talent;
