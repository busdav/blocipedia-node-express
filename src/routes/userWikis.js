const express = require("express");
const router = express.Router();
const userWikiController = require("../controllers/userWikiController")
const validation = require("./validation");
const helper = require("../auth/helpers");

// router.post("/wikis/:wikiId/collaborators/add", helper.ensureAuthenticated, validation.validateCollaborators, userWikiController.create);

module.exports = router;