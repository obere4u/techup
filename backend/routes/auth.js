const express = require("express");
const { BcryptUtils, errorHandler } = require("../utils/index");
const { Talent } = require("../models/talent");
const Admin = require("../models/admin");
const router = express.Router();
const otpToken = require("../models/otpToken");
const sendMail = require("../utils/email/sendMail");
const crypto = require("crypto");

router.use(express.json());
const jwt = require("jsonwebtoken");

//for development
// const clientURL = process.env.CLIENT_URL_DEV;

//for production
const clientURL = process.env.CLIENT_URL_PROD;

//Talent Route begins
// Check if password exists route
router.post("/check-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Talent.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Email not found"));
    }
    if (!user.password) {
      return res.status(200).json({ passwordExists: false });
    }
    res.status(200).json({ passwordExists: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User Sign-in route
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await Talent.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the password field in the database is empty
    if (!user.password) {
      // If the password field is empty, check if confirmPassword is provided
      if (!confirmPassword) {
        return next(errorHandler(400, "Password is required"));
      }

      // Set new password with confirmPassword
      const hashedPassword = await BcryptUtils.hashPassword(confirmPassword);
      user.password = hashedPassword;
      await user.save();
    } else {
      // If the password field is not empty, compare passwords
      const validPassword = await BcryptUtils.comparePassword(
        password,
        user.password
      );

      if (!validPassword) {
        return next(errorHandler(401, "Password not correct"));
      }
    }

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user._doc;

    // If valid password or password set successfully, generate token for the user
    const access_token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 31536000 } // token expires in 1yr (expressed in seconds)
    );

    res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
      })
      .json({
        userWithoutPassword,
        access_token,
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//User logout
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Successfully signed out");
  } catch (error) {
    next(error);
  }
});

//POST to db for forgot password
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Talent.findOne({ email });
    if (!user) throw new Error("Email does not exist");

    let token = await otpToken.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetOtpToken = crypto.randomBytes(32).toString("hex");
    const hash = await BcryptUtils.hashOtpToken(resetOtpToken);

    await new otpToken({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    console.log(process.env.CLIENT_URL_PROD);
    console.log(process.env.CLIENT_URL_DEV);

    const link = `${clientURL}/reset-password?token=${resetOtpToken}&id=${user._id}`;

    sendMail(
      user.email,
      "Password Reset Request",
      {
        fullName: user.fullName,
        link: link,
      },
      "./templates/requestResetPassword.handlebars"
    );
    res.status(200).json({ link, message: "Please check you email" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal server error"));
  }
});

//POST to Reset password
router.post("/reset-password", async (req, res, next) => {
  try {
    const { id: userId, token, password, confirmPassword } = req.body;

    const user = await Talent.findById({ _id: userId });

    const userWhoWantsToResetPassword = await otpToken.findOne({ userId });
    const passwordResetToken = userWhoWantsToResetPassword.token;

    // If the password field is not empty, compare passwords in the database
    const validPassword = await BcryptUtils.comparePassword(
      password,
      user.password
    );

    //check for saved password
    if (validPassword) {
      return next(
        errorHandler(
          401,
          "You have used this password before, try another password"
        )
      );
    }

    //token not available
    if (!passwordResetToken) {
      return next(errorHandler(401, "Invalid or expired password reset token"));
    }

    const isOtpTokenValid = await BcryptUtils.comparePassword(
      token,
      passwordResetToken
    );

    //invalid token
    if (!isOtpTokenValid) {
      return next(errorHandler(401, "Invalid or expired password reset token"));
    }

    // Set new password with confirmPassword
    const hashedPassword = await BcryptUtils.hashPassword(confirmPassword);

    await Talent.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    sendMail(
      user.email,
      "Password Reset Successfully",
      {
        fullName: user.fullName,
      },
      "./templates/resetPasswordSuccess.handlebars"
    );

    await userWhoWantsToResetPassword.deleteOne();

    res.status(200).json("Password reset was successful, please login");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//Talent Route ends

// Admin Route begins
// Check if password exists route
router.post("/admin/check-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Email not found"));
    }
    if (!user.password) {
      return res.status(200).json({ passwordExists: false });
    }
    res.status(200).json({ passwordExists: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Sign -in route
router.post("/admin/signin", async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the password field in the database is empty
    if (!user.password) {
      // If the password field is empty, check if confirmPassword is provided
      if (!confirmPassword) {
        return next(errorHandler(400, "Password is required"));
      }

      // Set new password with confirmPassword
      const hashedPassword = await BcryptUtils.hashPassword(confirmPassword);
      user.password = hashedPassword;
      await user.save();
    } else {
      // If the password field is not empty, compare passwords
      const validPassword = await BcryptUtils.comparePassword(
        password,
        user.password
      );

      if (!validPassword) {
        return next(errorHandler(401, "Invalid password"));
      }
    }

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user._doc;

    // If valid password or password set successfully, generate token for the user
    const access_token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 31536000 } // token expires in 1yr (expressed in seconds)
    );

    res
      .status(200)
      .cookie("access_token", access_token, {
        httpOnly: true,
      })
      .json({
        userWithoutPassword,
        access_token,
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
