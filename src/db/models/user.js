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
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.belongsToMany(models.Wiki, {
      through: UserWikis,
      as: "collabWikis",
      foreignKey: "collabId",
      otherKey: "wikiId"
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  
  return User;
};