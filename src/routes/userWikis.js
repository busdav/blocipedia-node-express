const express = require("express");
const router = express.Router();
const userWikiController = require("../controllers/userWikiController")
const validation = require("./validation");
const helper = require("../auth/helpers");

router.post("/wikis/:wikiId/collaborations/create", helper.ensureAuthenticated, userWikiController.create);
router.post("/wikis/:wikiId/collaborations/:collaboratorId/destroy", helper.ensureAuthenticated, userWikiController.destroy);

module.exports = router;