const jwt = require("jsonwebtoken");
const secret_key = "siddharth";
function setUser(user) {
  const token = jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    secret_key
  );
  return token;
}
function getUser(token) {
  if (!token) return null;
  return jwt.verify(token, secret_key);
}
module.exports = { setUser, getUser };
