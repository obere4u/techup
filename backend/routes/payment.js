// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const Donor = require("../models/donor");
// const donorSchema = require("../schemas/donorSchema");
// const paystack_secret_key = process.env.PAYSTACK_SECRET_KEY_DEV;

// // POST payment initialization request to Paystack
// router.post("/initializePayment", async (req, res) => {
//   const { error } = donorSchema.validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   try {
//     const {
//       fullName,
//       amount,
//       email,
//       phone,
//       currentAddress,
//       reference,
//       timestamps,
//     } = req.body;

//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         fullName,
//         email,
//         phone,
//         amount,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${paystack_secret_key}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//     if (response.status === 1) {
//       const { amount } = response.data.data;

//       const existingDonor = await Donor.findOne({ reference });

//       if (!existingDonor) {
//         const donor = new Donor({
//           fullName,
//           phone,
//           email,
//           amount: amount / 100,
//           reference,
//           currentAddress,
//           timestamps,
//         });

//         await donor.save();
//       }

//       return res.status(200).json({
//         data: response.data,
//         message: "Transaction has been verified",
//         status: 1,
//       });
//     } else {
//       return res.status(200).json({
//         data: response.data.error,
//         message: "Transaction verification failed",
//         status: 0,
//       });
//     }
//   } catch (error) {
//     console.error("Error initializing payment:", error);
//     return res.status(500).json({ error: "Failed to initialize payment" });
//   }
// });

// // Verify Payment
// router.get("/verify/:reference", async (req, res) => {
//   try {
//     const { reference } = req.params;

//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${paystack_secret_key}`,
//         },
//       }
//     );

//     if (response.data.data.status === "success") {
//       const { amount } = response.data.data;

//       const existingDonor = await Donor.findOne({ reference });

//       if (!existingDonor) {
//         const donor = new Donor({
//           fullName,
//           phone,
//           email,
//           amount: amount / 100,
//           reference,
//           currentAddress,
//           timestamps,
//         });

//         await donor.save();
//       }

//       return res.status(200).json({
//         data: response.data,
//         message: "Transaction has been verified",
//         status: 1,
//       });
//     } else {
//       return res.status(200).json({
//         data: response.data,
//         message: "Transaction verification failed",
//         status: 0,
//       });
//     }
//   } catch (error) {
//     console.error(
//       "Error verifying transaction:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: "Failed to verify transaction" });
//   }
// });

// module.exports = router;
