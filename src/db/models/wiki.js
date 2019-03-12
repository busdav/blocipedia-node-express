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
      allowNull: false,
      onDelete: "CASCADE", // delete wiki if parent user is deleted
      references: {        // association information
        model: "Users",   // table name
        key: "id",         // attribute to use
        as: "userId"      // reference as userId
      },
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, { //enables wiki.getUser(); (and 'set') (get 'User' because of first parameter passed to 'define' of User model, and we didn't otherwise specify 'as: ...')
      foreignKey: "userId", // using belongsTo, the fk is placed on the SOURCE model, here Wiki
      onDelete: "CASCADE"
    });
    Wiki.belongsToMany(models.User, { // enables wiki.getCollaborations()
      through: models.UserWiki,
      as: "collaborations",
      foreignKey: "wikiId", // source model key in 'through' relation
      otherKey: "collaboratorId", // target model key in 'through' relation
      onDelete: "CASCADE"
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