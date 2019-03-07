'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserWiki = sequelize.define('UserWiki', {
    collaboratorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  UserWiki.associate = function(models) {
    // associations can be defined here
  };
  return UserWiki;
};