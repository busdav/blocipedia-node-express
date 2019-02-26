const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  
  new() {
    return (this._isAdmin() || this._isStandard() || this._isPremium());
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new() && this.record;
  }

  update() {
    return this.edit();
  }

 // #5
  destroy() {
    return this.new() && this.record && (this._isOwner() || this._isAdmin());
  }
  
}