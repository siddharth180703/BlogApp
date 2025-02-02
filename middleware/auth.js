const { getUser } = require("../services/auth");
function checkforAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;
  if (!tokenCookie) return next();
  const user = getUser(tokenCookie);
  req.user = user;
  return next();
}
function restrictTo(req, res, next) {
  if (!req.user) return res.redirect("/user/login");
  next();
}
module.exports = { checkforAuthentication, restrictTo };
