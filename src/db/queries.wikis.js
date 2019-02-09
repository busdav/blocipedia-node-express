const Wiki = require("./models").Wiki;

module.exports = {

//#1
  getAllWikis(callback){
    return Wiki.all()

//#2
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback){
    return Wiki.create({
      title: newWiki.title,
      description: newWiki.body
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  }
}