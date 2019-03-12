const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  create() {
    return this.user //placeholder
    
    // if(this._isPrivate()) {
    //   return this._isAdmin() || this._isPremium();
    // } else {
    //   return this.user;
    // }
  }

//   edit() {
//     if(this._isPublic()) {
//       return this.new();
//     }
//     if(this._isPrivate()) {
//       return (this._isAdmin() || this._isPremium() || this._isOwner());
//     }
//   }

//   update() {
//     return this.edit();
//   }

//   show() {
//     if(this._isPrivate()) {
//       return this._isAdmin() || this._isPremium() || this._isOwner();
//     } else {
//       return true;
//     }
//   }

//  // #5
//   destroy() {
//     return this._isOwner() || this._isAdmin();
//   }
  
}