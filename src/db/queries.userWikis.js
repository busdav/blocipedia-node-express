const UserWiki = require("./models").UserWiki;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/userWiki");


module.exports = {

  createCollaboration(req, newCollaborator, callback){
    return User.findOne({ where: {email: newCollaborator.collaboratorEmail }})
    .then((user) => {
      if(!user){
        return callback("User not found");
      } 
      if (req.user.email == user.email){
        return callback("Cannot add yourself as a collaborator!");
      }

        UserWiki.findAll({
          where: {
            collaboratorId: user.id,
            wikiId: req.params.wikiId,
          }
        })
        .then((collaborations) => {
          if(collaborations.length != 0){
            return callback(`${newCollaborator.collaboratorEmail} is already a collaborator on this wiki.`);
          }
          let newCollaboration = {
            collaboratorId: user.id,
            wikiId: req.params.wikiId
          };
          return Wiki.findOne({ where: {id: req.params.wikiId }})
          .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).create();
            if(authorized) {
              return UserWiki.create(newCollaboration)
              .then((collaboration) => {
                callback(null, collaboration);
              })
              .catch((err) => {
                callback(err, null);
              })
            } else {
              req.flash("notice", "You are not authorized to do that.");
              callback(401);
            }
        })
        .catch((err)=>{
          callback(err, null);
        })
    })
    .catch((err)=>{
      callback(err, null);
    })
  })
  .catch((err)=>{
    callback(err, null);
  })
},

deleteCollaboration(req, callback){
  return UserWiki.findOne({ where: { collaboratorId: req.params.collaboratorId, wikiId: req.params.wikiId } } )
  .then((collaboration) => {

    return Wiki.findOne({ where: {id: req.params.wikiId }})
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {
        collaboration.destroy()
        .then((res) => {
          callback(null, collaboration);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    })
  })
  .catch((err) => {
    callback(err);
  })
},
  
}