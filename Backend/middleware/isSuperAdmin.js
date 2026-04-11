// const Admin = require("../models/Admin");

// // module.exports =  async (req, res, next) => {
// //     const admin = await Admin.findById(req.user.id);

// //     if(admin.role !== "superadmin") {
// //         return res.status(403).json({ message: "Access denied" });
// //     }
// //     next();
// // };

// // const isSuperAdmin = (role) => {
// // async (req, res, next) => {
// //   console.log("Admin",req.user);
// //    const admin = await Admin.findById(req.admin.id);
// //   if ( !admin || admin.role !== role) {
// //     return res.status(403).json({ message: "Access denied" });
// //   }
// //   next();
// // };
// // };

// const isSuperAdmin = (req, res, next) => {
//   console.log("Admin",req.user);
//    const admin = Admin.findById(req.user.id);
//   if ( !admin || admin.role !== "superadmin") {
//     return res.status(403).json({ message: "Access denied" });
//   } 
//     next();
// };




// module.exports = isSuperAdmin;