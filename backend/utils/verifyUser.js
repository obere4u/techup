const jwt = require("jsonwebtoken");
const { errorHandler } = require("./index");
const { Talent } = require("../models/talent"); // Import your Talent model or User model here

const verifyUser = (req, res, next) => { 
  const authorizationHeader = req.headers.authorization;
   const access_token = authorizationHeader
    ? authorizationHeader.split(" ")[1] : req.cookies.access_token;


  jwt.verify(
    access_token,
    process.env.JWT_SECRET,
    async (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized User"));
      }

      // console.log("req: ", req);

        if (err) {
          return next(errorHandler(404, "User not found"));
        }

        // Populate req.user with the user data
        req.user = user;
        next();
      
    }
  );
};

module.exports = verifyUser;
