const Auth = require("../models/Auth");

const isAuthUser = async (token) => {
   const userAuth = await Auth.findOne({ token: token });
   return userAuth ? userAuth : false; // Return true if user is authenticated, false otherwise
}

module.exports = { isAuthUser };
