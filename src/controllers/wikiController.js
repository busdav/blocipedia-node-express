const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {

  index(req, res, next){
    wikiQueries.getWikisForIndex(req, (err, wikis) => {
        if(err){
            res.redirect(500, "static/index");
        } else {
            res.render("wikis/index", {wikis});
        }
    });
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){

    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id,
      private: req.body.private
    };
    const authorized = new Authorizer(req.user, newWiki).create();
    if(authorized) {
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },


  show(req, res, next){
    wikiQueries.getWikiAndCollaborations(req, (err, result) => {
      if(err || result.wiki == undefined){
        res.redirect(404, "/");
      } else {
        wiki = result.wiki;
        const authorized = new Authorizer(req.user, wiki, result.thisCollaboration).show();
        if(authorized) {
          const wikiMarkdown = markdown.toHTML(wiki.body);
          res.render("wikis/show", {...result, wikiMarkdown}); 
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/wikis`)
        }
      }
    });
  },



  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, wiki) => {
        if(err){
            res.redirect(500, `/wikis/${req.params.id}`); 
        } else {
            res.redirect(303, "/wikis"); 
        }
    });
},

edit(req, res, next){
  wikiQueries.getWiki(req.params.id, (err, wiki) => {
    if(err || wiki == null){
      res.redirect(404, "/");
    } else {
      const authorized = new Authorizer(req.user, wiki).edit();
      if(authorized) {
        res.render("wikis/edit", {wiki});
      } else {
        req.flash("You are not authorized to do that.")
        res.redirect(`/wikis/${req.params.id}`)
      }
    }
  });
},

update(req, res, next){
  wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
          res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
          res.redirect(`/wikis/${req.params.id}`);
      }
  });
},
  
}