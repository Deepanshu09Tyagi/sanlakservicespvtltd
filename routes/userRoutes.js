const express = require('express');

const router = express.Router();
const middleware = require("../middleware/auth")

const UserController = require("../controllers/user.controller");

router.post("/register", UserController.userRegister);
router.post("/login", UserController.userLogin);
router.get("/profile", middleware.userAuth, UserController.userProfile);

module.exports = router;