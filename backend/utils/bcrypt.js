const { hash, compare } = require("bcryptjs");

class BcryptUtils {
  //hash password
  async hashPassword(password) {
    return hash(password, 12);
  }

  //compare passwords
  async comparePassword(password, hashPassword) {
    const match = await compare(password, hashPassword);
    if (!match) return false;
    else return true;
  }

  //hash otp reset token
  async hashOtpToken(resetOtpToken) {
    return hash(resetOtpToken, 12);
  }

  //compare otp tokens
  async compareOtpToken(token, passwordResetToken) {
    const match = await compare(token, passwordResetToken);
    if (!match) return false;
    else return true;
  }
}

module.exports = new BcryptUtils();
