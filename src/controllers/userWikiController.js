const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  // create(req, res, next){
  //   //#1
  //        let newUser = {
  //          email: req.body.email,
  //          password: req.body.password,
  //          passwordConfirmation: req.body.passwordConfirmation
  //        };
  //   // #2
  //        userQueries.createUser(newUser, (err, user) => {
  //          if(err){
  //            req.flash("error", err);
  //            res.redirect("/users/sign_up");
  //          } else {
    
  //   // #3
  //           const msg = {
  //             to: newUser.email,
  //             from: 'test@example.com',
  //             subject: 'User Confirmation',
  //             text: 'Welcome to Blocipedia',
  //             html: '<strong>Please login to your account to confirm membership!</strong>',
  //           };
  //           sgMail.send(msg);
            
  //            passport.authenticate("local")(req, res, () => {
  //              req.flash("notice", "You've successfully signed in!");
  //              res.redirect("/");
  //            });
  //          }
  //        });
  //      },   

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