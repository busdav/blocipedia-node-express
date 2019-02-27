const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  
  new() {
    return this.user;
  }

  create() {
    if(this._isPrivate()) {
      return this._isAdmin() || this._isPremium();
    } else {
      return this.new();
    }
  }

  edit() {
    if(this._isPrivate()) {
      return this._isAdmin() || this._isPremium() || this._isOwner();
    } else {
      return this.new();
    }
  }

  update() {
    return this.edit();
  }

 // #5
  destroy() {
    return this._isOwner() || this._isAdmin();
  }
  
}