const User = require("./models").User;
const Wiki = require("./models").Wiki;
// const Comment = require("./models").Comment;
const bcrypt = require("bcryptjs");
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);



module.exports = {
// #2
  createUser(newUser, callback){

// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      // // using SendGrid's v3 Node.js Library
      // // https://github.com/sendgrid/sendgrid-nodejs
      // const msg = {
      //   to: newUser.email,
      //   from: 'test@example.com',
      //   subject: 'User Confirmation',
      //   text: 'Welcome to Blocipedia',
      //   html: '<strong>Please login to your account to confirm membership!</strong>',
      // };
      // sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },


  getUser(id, callback){
    // #1
       let result = {};
       User.findByPk(id)
       .then((user) => {
    // #2
         if(!user) {
           callback(404);
         } else {
    // #3
           result["user"] = user;
    // #4
           Wiki.scope({method: ["lastFiveFor", id]}).all()
           .then((wikis) => {
    // #5
             result["wikis"] = wikis;
            callback(null, result);
             })
             .catch((err) => {
               callback(err);
             })
         }
       })
     },


     getUserOnly(id, callback){
      return User.findByPk(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
    },

} 