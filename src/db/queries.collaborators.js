const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");


module.exports = {

  // call it collaboration everywhere; note that the id in the params object will be
  // called 'wikiId' since I've defined it so in the route. 
  // but call every file name consistently like the model, i.e., UserWikis. 

  addCollaboration(req, newCollab, callback){
    return User.findOne({ where: {email: newCollab.collabEmail }})
    .then((user) => {
      if(!user){
        return callback("User not found");
      } 
      const authorized = new Authorizer(req.user, wiki).addCollab();
      if(authorized) {
        
        // here then create new collaboration and finally return it back. 
        // schpick bim andere. 

        return user.updateAttributes({role: "premium"})
        .then((res) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    })
  },

}