const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  
  new() {
    return (this._isAdmin() || this._isStandard());
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new() && this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}