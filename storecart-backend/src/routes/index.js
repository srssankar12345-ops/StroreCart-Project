const express = require("express");
const router = express.Router();
const userRoutes = require("../modules/user/user.routes.js");
const {getAllData} = require('../../data.js')

// prefix /api/users
router.use("/users", userRoutes);
router.use("/getData" , getAllData)
// example protected route
// const { authenticate } = require("../middleware/authMiddleware");
// router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

module.exports = router;
