'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Wiki.belongsToMany(models.User, {
      through: UserWikis,
      as: "collabWikis",
      foreignKey: "collabId",
      otherKey: "wikiId"
    });
  };

  Wiki.addScope("lastFiveFor", (userId) => {
    // #2
        return {
          where: { userId: userId},
    // #3
          limit: 5,
          order: [["createdAt", "DESC"]]
        }
      });

  Wiki.addScope("index", (user) => {
    if(user) {
      if(user.role == "admin" || user.role == "premium") {
        return {
          order: [["createdAt", "DESC"]]
        }
      } else {
        return {
          where: { private: false },
          order: [["createdAt", "DESC"]]
        }
      }
    } else {
      return {
        where: { private: false },
        order: [["createdAt", "DESC"]]
      }
    }
  });

  return Wiki;
};