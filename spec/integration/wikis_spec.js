const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

//#1
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Snowball Fighting",
          body: "So much snow!",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

    // context of admin user
    describe("user performing CRUD actions for Wiki", () => {

      // #2: before each test in admin user context, send an authentication request
      // to a route we will create to mock an authentication request
  
      beforeEach((done) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });

  });


  describe("POST /wikis/create", () => {

    it("should create a new wiki and redirect", (done) => {
       const options = {
         url: `${base}create`,
         form: {
           title: "Watching snow melt",
           body: "Without a doubt my favoriting things to do besides watching paint dry!",
           userId: this.user.id
         }
       };
       request.post(options,
         (err, res, body) => {
 
           Wiki.findOne({where: {title: "Watching snow melt"}})
           .then((wiki) => {
             expect(wiki).not.toBeNull();
             expect(wiki.title).toBe("Watching snow melt");
             expect(wiki.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
             expect(wiki.userId).not.toBeNull();
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
       );
     });
 
  });

});

});