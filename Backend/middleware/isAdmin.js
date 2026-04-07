// ADMIN CHECK
const isAdmin = (req, res, next) => {
  console.log("USER",req.user);
  if ( !req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = isAdmin;