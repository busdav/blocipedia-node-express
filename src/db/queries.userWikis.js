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
      // const authorized = new Authorizer(req.user, wiki).create();
      // if(authorized) {
        
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
          return UserWiki.create(newCollaboration)
          .then((collaboration) => {
            callback(null, collaboration);
          })
          .catch((err) => {
            callback(err, null);
          })
        })
        .catch((err)=>{
          callback(err, null);
        })
      // } else {
      //   req.flash("notice", "You are not authorized to do that.");
      //   callback("Forbidden");
      // }
    })
    .catch((err)=>{
      callback(err, null);
    })
  },
  
}