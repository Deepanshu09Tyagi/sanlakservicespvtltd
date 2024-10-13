const express = require('express');

const router = express.Router();
const middleware = require("../middleware/auth")

const AdminController = require("../controllers/admin.controller");

router.post("/users", middleware.adminAuth, AdminController.createUserByAdmin)
router.get("/users", middleware.adminAuth, AdminController.getAllUsers)
router.put("/users/:id/role", middleware.adminAuth, AdminController.updateUserRole)
router.delete("/users/:id/delete", middleware.adminAuth, AdminController.deleteUser)


module.exports = router;