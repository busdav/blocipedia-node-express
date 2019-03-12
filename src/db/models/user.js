'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {  // enables user.getWikis(); (and 'set') (get 'Wikis' because we specified 'as: "wikis"' - otherwise, by default, it would be 'getWiki()')
      foreignKey: "userId", // using hasMany, the fk is placed on the TARGET model, here Wiki
      as: "wikis"
    });
    User.belongsToMany(models.Wiki, { // enables user.getCollaborations()
      through: models.UserWiki,
      as: "collaborations",
      foreignKey: "collaboratorId", // source model key in 'through' relation
      otherKey: "wikiId", // target model key in 'through' relation
      onDelete: "CASCADE"
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  
  return User;
};