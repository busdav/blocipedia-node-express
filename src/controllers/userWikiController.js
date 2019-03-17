const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const userWikiQueries = require("../db/queries.userWikis.js");


module.exports = {

  create(req, res, next){

    let newCollaborator = {
      collaboratorEmail: req.body.collaboratorEmail,
    };

    userWikiQueries.createCollaboration(req, newCollaborator, (err, collaboration) => {
      if(err || collaboration == null) {
        // req.flash("error", "No user found with that ID."); // would need amendment to messages.ejs for that
        req.flash("notice", err);
        // res.redirect(500, `/wikis/${req.params.wikiId}/edit`); 
        // if I remove the error code, there won't be a page in between displaying the error code (e.g. "internal server error" for 500)
        res.redirect(`/wikis/${req.params.wikiId}`); // note the leading slash, which makes it relative to ROOT, rather than this path
      } else {
        req.flash("notice", "Collaborator successfully added");
        res.redirect(303, `/wikis/${req.params.wikiId}`);
      }
  })
},


destroy(req, res, next){
  userWikiQueries.deleteCollaboration(req, (err, collaboration) => {
      if(err){
          res.redirect(500, `/wikis/${req.params.wikiId}`); 
      } else {
          res.redirect(303, `/wikis/${req.params.wikiId}`); 
      }
  });
},

}