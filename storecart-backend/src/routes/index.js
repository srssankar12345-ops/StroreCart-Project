const express = require("express");
const router = express.Router();
const userRoutes = require("../modules/user/user.routes");

// prefix /api/users
router.use("/users", userRoutes);

// example protected route
// const { authenticate } = require("../middleware/authMiddleware");
// router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

module.exports = router;
