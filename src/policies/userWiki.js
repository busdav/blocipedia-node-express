const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  create() {    
    if(this._isPrivate()) {
      return this._isAdmin() || this._isPremium();
    } 
  }

  destroy() {
    // return this._isOwner() || this._isAdmin();
  }
  
}