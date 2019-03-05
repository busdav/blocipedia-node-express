'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserWikis = sequelize.define('UserWikis', {
    collaboratorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  UserWikis.associate = function(models) {
    // associations can be defined here
  };
  return UserWikis;
};