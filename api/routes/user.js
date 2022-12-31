const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const user = require("../models/user");
const auth = require("../middelwares/auth");

router.post("/singUp", userController.SING_UP);
router.post("/login", userController.LOGIN);
router.get("/getNewJwtToken", userController.GET_NEW_JWT_TOKEN);
router.get("/getAllUsers", userController.GET_ALL_USERS);
router.get("/getUserById/:id", userController.GET_USER_BY_ID);
module.exports = router;
