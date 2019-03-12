const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  create(req, res, next){

    let newCollaborator = {
      collaboratorEmail: req.body.collaboratorEmail,
    };

    userQueries.createCollaboration(req, newCollaborator, (err, collaboration) => {
      if(err || collaboration == null) {
        res.redirect(500, `wikis/${req.params.id}/edit`); // would this be `wikiId` because I defined it so in route?
      } else {
        res.redirect(303, `wikis/${req.params.id}`);
      }
    });
  },

  // edit(req, res, next){
  //   wikiQueries.getWiki(req.params.id, (err, wiki) => {
  //     if(err || wiki == null){
  //       res.redirect(404, "/");
  //     } else {
  //       const authorized = new Authorizer(req.user, wiki).edit();
  //       if(authorized) {
  //         res.render("wikis/edit", {wiki});
  //       } else {
  //         req.flash("You are not authorized to do that.")
  //         res.redirect(`/wikis/${req.params.id}`)
  //       }
  //     }
  //   });
  // },

  // show(req, res, next){

  //    userQueries.getUser(req.params.id, (err, result) => {
 
  //      if(err || result.user === undefined){
  //        req.flash("notice", "No user found with that ID.");
  //        res.redirect("/");
  //      } else {
 
  //        res.render("users/show", {...result});
  //      }
  //    });
  //  },

}