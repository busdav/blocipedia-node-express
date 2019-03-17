module.exports = class ApplicationPolicy {

  // #1
   constructor(user, record, collaboration) {
     this.user = user;
     this.record = record;
     this.collaboration = collaboration;
   }
 
  // #2
   _isOwner() {
     return this.record && (this.record.userId == this.user.id);
   }
 
   _isAdmin() {
     return this.user && this.user.role == "admin";
   }

   _isStandard() {
    return this.user && this.user.role == "standard";
  }

  _isPremium() {
    return this.user && this.user.role == "premium";
  }

  _isCollaborator() {
    return this.collaboration && this.collaboration.collaboratorId == this.user.id;
  }
  _isPrivate() {
    return this.record && this.record.private == true;
  }

  _isPublic() {
    return this.record && this.record.private == false;
  }
 
  // #3
   new() {
     return this.user;
   }
 
   create() {
     return this.new();
   }
 
   show() {
     return true;
   }
 
  // #4
   edit() {
     return this._isOwner() || this._isAdmin();
   }
 
   update() {
     return this.edit();
   }
 
  // #5
   destroy() {
     return this.update();
   }
 }