const bcrypt = require("bcryptjs");

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, userPassword) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  encryptPassword,
  comparePassword,
};
