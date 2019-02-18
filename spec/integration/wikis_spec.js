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
        password: "Trekkie4lyfe",
        role: "standard"
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








    // context of guest user
    describe("guest attempting to perform CRUD actions on Wiki", () => {

      // #2
           beforeEach((done) => {    // before each suite in this context
             request.get({           // mock authentication
               url: "http://localhost:3000/auth/fake",
               form: {
                 userId: 0 // flag to indicate mock auth to destroy any session
               }
             },
               (err, res, body) => {
                 done();
               }
             );
           });
    
           describe("GET /wikis", () => {
            it("should return a status code 200 and all wikis", (done) => {
              request.get(base, (err, res, body) => {
                expect(err).toBeNull();
                expect(res.statusCode).toBe(200); 
                expect(body).toContain("Wikis");
                expect(body).toContain("Snowball Fighting");
                done();
              });
            });
          });    
        
          describe("GET /wikis/new", () => {
        
            it("should not render a new wiki form", (done) => {
              request.get(`${base}new`, (err, res, body) => {
                expect(body).not.toContain("New Wiki");
                done();
              });
            });
        
          });
        
        
          describe("POST /wikis/create", () => {
        
            it("should not create a new wiki and redirect", (done) => {
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
                     expect(wiki).toBeNull();
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
        
        
        describe("GET /wikis/:id", () => {
          it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("So much snow!");
              done();
            });
          });
        });
        
        
        describe("POST /wikis/:id/destroy", () => {
          it("should not delete the wiki with the associated ID", (done) => {
            Wiki.findAll()
            .then((wikis) => {
              const wikiCountBeforeDelete = wikis.length;
              expect(wikiCountBeforeDelete).toBe(1);
              request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                Wiki.findAll()
                .then((wikis) => {
                  expect(wikis.length).toBe(wikiCountBeforeDelete);
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                })
              });
            })
          });
        });
        
        
        describe("GET /wikis/:id/edit", () => {
          it("should not render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
              expect(body).not.toContain("Edit Wiki");
              done();
            });
          });
        });
        
        describe("POST /wikis/:id/update", () => {
          it("should not update the wiki with the given values", (done) => {
            request.post({
              url: `${base}${this.wiki.id}/update`,
              form: {
                title: "JavaScript Frameworks",
                body: "There are a lot of them",
                userId: this.user.id
              }
            }, (err, res, body) => {
              Wiki.findOne({
                where: {id: 1}
              })
              .then((wiki) => {
                expect(wiki.title).not.toBe("JavaScript Frameworks");
                expect(wiki.body).not.toBe("There are a lot of them");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            });
          });
        });
      });





    // context of admin user
    describe("admin user performing CRUD actions on public Wiki", () => {

      // #2: before each test in admin user context, send an authentication request
      // to a route we will create to mock an authentication request
  
      beforeEach((done) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: this.user.id,
            role: "admin",
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });

  describe("GET /wikis", () => {
    it("should return a status code 200 and all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200); 
        expect(body).toContain("Wikis");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
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



describe("GET /wikis/:id", () => {
  it("should render a view with the selected wiki", (done) => {
    request.get(`${base}${this.wiki.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("So much snow!");
      done();
    });
  });
});


describe("POST /wikis/:id/destroy", () => {
  it("should delete the wiki with the associated ID", (done) => {
    Wiki.findAll()
    .then((wikis) => {
      const wikiCountBeforeDelete = wikis.length;
      expect(wikiCountBeforeDelete).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findAll()
        .then((wikis) => {
          expect(err).toBeNull();
          expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      });
    })
  });
});


describe("GET /wikis/:id/edit", () => {
  it("should render a view with an edit wiki form", (done) => {
    request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Wiki");
      expect(body).toContain("So much snow!");
      done();
    });
  });
});

describe("POST /wikis/:id/update", () => {
  it("should update the wiki with the given values", (done) => {
    request.post({
      url: `${base}${this.wiki.id}/update`,
      form: {
        title: "JavaScript Frameworks",
        body: "There are a lot of them",
        userId: this.user.id
      }
    }, (err, res, body) => {
      expect(err).toBeNull();
      Wiki.findOne({
        where: {id: 1}
      })
      .then((wiki) => {
        expect(wiki.title).toBe("JavaScript Frameworks");
        expect(wiki.body).toBe("There are a lot of them");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
});





    // context of standard user performing CRUD actions on own Wiki
    describe("standard user performing CRUD actions on own Wiki", () => {
  
      beforeEach((done) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: this.user.id,
            role: "standard",
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });

  describe("GET /wikis", () => {
    it("should return a status code 200 and all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200); 
        expect(body).toContain("Wikis");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
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


describe("GET /wikis/:id", () => {
  it("should render a view with the selected wiki", (done) => {
    request.get(`${base}${this.wiki.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("So much snow!");
      done();
    });
  });
});


describe("POST /wikis/:id/destroy", () => {
  it("should delete the wiki with the associated ID", (done) => {
    Wiki.findAll()
    .then((wikis) => {
      const wikiCountBeforeDelete = wikis.length;
      expect(wikiCountBeforeDelete).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findAll()
        .then((wikis) => {
          expect(err).toBeNull();
          expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      });
    })
  });
});


describe("GET /wikis/:id/edit", () => {
  it("should render a view with an edit wiki form", (done) => {
    request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Wiki");
      expect(body).toContain("So much snow!");
      done();
    });
  });
});

describe("POST /wikis/:id/update", () => {
  it("should update the wiki with the given values", (done) => {
    request.post({
      url: `${base}${this.wiki.id}/update`,
      form: {
        title: "JavaScript Frameworks",
        body: "There are a lot of them",
        userId: this.user.id
      }
    }, (err, res, body) => {
      expect(err).toBeNull();
      Wiki.findOne({
        where: {id: 1}
      })
      .then((wiki) => {
        expect(wiki.title).toBe("JavaScript Frameworks");
        expect(wiki.body).toBe("There are a lot of them");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
});






    // context of standard user performing CRUD actions on other user's public Wiki
    describe("standard user performing CRUD actions on other user's public Wiki", () => {

      beforeEach((done) => {
        User.create({
          email: "otheruser@example.com",
          password: "123456",
          role: "standard"
        })
        .then((user) => {
          request.get({         // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role,     
              userId: user.id,
              email: user.email
            }
          },
            (err, res, body) => {
              done();
            }
          );
        });
      });
 


describe("GET /wikis/:id", () => {
  it("should render a view with the selected wiki", (done) => {
    request.get(`${base}${this.wiki.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("So much snow!");
      done();
    });
  });
});


describe("POST /wikis/:id/destroy", () => {
  it("should not delete the wiki with the associated ID", (done) => {
    Wiki.findAll()
    .then((wikis) => {
      const wikiCountBeforeDelete = wikis.length;
      expect(wikiCountBeforeDelete).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findAll()
        .then((wikis) => {
          expect(wikis.length).toBe(wikiCountBeforeDelete);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      });
    })
  });
});


describe("GET /wikis/:id/edit", () => {
  it("should render a view with an edit wiki form", (done) => {
    request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Wiki");
      expect(body).toContain("So much snow!");
      done();
    });
  });
});

describe("POST /wikis/:id/update", () => {
  it("should update the wiki with the given values", (done) => {
    request.post({
      url: `${base}${this.wiki.id}/update`,
      form: {
        title: "JavaScript Frameworks",
        body: "There are a lot of them",
        userId: this.user.id
      }
    }, (err, res, body) => {
      expect(err).toBeNull();
      Wiki.findOne({
        where: {id: 1}
      })
      .then((wiki) => {
        expect(wiki.title).toBe("JavaScript Frameworks");
        expect(wiki.body).toBe("There are a lot of them");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
});
});
