const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  
  new() {
    return (this._isAdmin() || this._isStandard());
  }

  create() {
    return this.new();
  }
}