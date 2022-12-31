// const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (!err) {
//       next();
//     } else {
//       return res.status(401).json({ status: "auth failed" });
//     }
//   });
// };
