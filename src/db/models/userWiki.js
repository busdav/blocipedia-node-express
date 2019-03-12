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

  UserWiki.addScope("collaborationsForWiki", (wikiId) => {
    return {
      include: [{
        model: models.User
      }],
      where: { wikiId: wikiId },
      order: [["createdAt", "ASC"]]
    }
  });

  UserWiki.addScope("collaborationsForUser", (userId) => {
    return {
      include: [{
        model: models.Wiki
      }],
      where: { collaboratorId: userId },
      order: [["createdAt", "ASC"]]
    }
  });

  return UserWiki;
};