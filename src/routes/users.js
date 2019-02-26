const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const validation = require("./validation");
const helper = require("../auth/helpers");



router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", helper.ensureAuthenticated, userController.signOut);
router.get("/users/:id/upgrade", helper.ensureAuthenticated, userController.upgradeForm);
router.get("/users/:id", helper.ensureAuthenticated, userController.show);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.post("/users/:id/upgrade", helper.ensureAuthenticated, userController.upgrade);
router.post("/users/:id/downgrade", helper.ensureAuthenticated, userController.downgrade);



module.exports = router;