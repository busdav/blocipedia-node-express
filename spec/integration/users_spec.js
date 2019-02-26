const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
// const Post = require("../../src/db/models").Post;
// const Comment = require("../../src/db/models").Comment;
const sequelize = require("../../src/db/models/index").sequelize;


describe("routes : users", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true})
    .then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        role: "standard"
      })
      .then((res) => {
        this.user = res;

        Wiki.create({
          title: "Winter Games",
          body: "Post your Winter Games stories.",
          userId: this.user.id
        })
        .then((res) => {
          this.wiki = res;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });

  describe("POST /users", () => {

    // #1
        it("should create a new user with valid values and redirect", (done) => {
    
          const options = {
            url: base,
            form: {
              email: "user@example.com",
              password: "123456789"
            }
          }
    
          request.post(options,
            (err, res, body) => {
    
    // #2
              User.findOne({where: {email: "user@example.com"}})
              .then((user) => {
                expect(user).not.toBeNull();
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(2);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
    
    // #3
        it("should not create a new user with invalid attributes and redirect", (done) => {
          request.post(
            {
              url: base,
              form: {
                email: "no",
                password: "123456789"
              }
            },
            (err, res, body) => {
              User.findOne({where: {email: "no"}})
              .then((user) => {
                expect(user).toBeNull();
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
  
  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });



  describe("GET /users/:id", () => {

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

    it("should render a view with the selected user", (done) => {
      request.get(`${base}${this.user.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain(`${this.user.email}`);
        done();
      });
    });


    it("should present a list of wikis a user has created", (done) => {

      request.get(`${base}${this.user.id}`, (err, res, body) => {

// #5
        expect(body).toContain("Winter Games");
        done();
      });

    });
  });


  describe("GET /users/:id/upgrade", () => {

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

    it("should render a view with an upgrade form", (done) => {
      request.get(`${base}${this.user.id}/upgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Charge");
        done();
      });
    });
  });


 
   describe("POST /users/:id/downgrade", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: this.user.id,
          role: "premium",
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });
    
    it("should downgrade a premium user to a standard user and redirect", (done) => {

      request.post(`${base}${this.user.id}/downgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(this.user.role).toBe("standard");
        done();
      });
    });
  });




  // Tried to implement a stripe test, but failed: 
  
  // describe("POST /users/:id/upgrade", () => {

  //   beforeEach((done) => {
  //     request.get({
  //       url: "http://localhost:3000/auth/fake",
  //       form: {
  //         userId: this.user.id,
  //         role: "standard",
  //       }
  //     },
  //       (err, res, body) => {
  //         done();
  //       }
  //     );
  //   });

  //   it("should upgrade a standard user to a premium user and redirect", (done) => {

      
  //     const options = {
  //       url: `${base}${this.user.id}/upgrade`,
  //       form: {

  //         // "id": "tok_visa",
  //         // "object": "token"

  //           "id": "src_1E7zk1B2K1jSrjX4VWwsmSp6",
  //           "object": "source",
  //           "ach_credit_transfer": {
  //             "account_number": "test_52796e3294dc",
  //             "routing_number": "110000000",
  //             "fingerprint": "ecpwEzmBOSMOqQTL",
  //             "bank_name": "TEST BANK",
  //             "swift_code": "TSTEZ122"
  //           },
  //           "amount": null,
  //           "client_secret": "src_client_secret_EbC8sWBiBMohaf63HD6xoLSs",
  //           "created": 1551163717,
  //           "currency": "gbp",
  //           "flow": "receiver",
  //           "livemode": false,
  //           "metadata": {},
  //           "owner": {
  //             "address": null,
  //             "email": "jenny.rosen@example.com",
  //             "name": null,
  //             "phone": null,
  //             "verified_address": null,
  //             "verified_email": null,
  //             "verified_name": null,
  //             "verified_phone": null
  //           },
  //           "receiver": {
  //             "address": "121042882-38381234567890123",
  //             "amount_charged": 0,
  //             "amount_received": 0,
  //             "amount_returned": 0,
  //             "refund_attributes_method": "email",
  //             "refund_attributes_status": "missing"
  //           },
  //           "statement_descriptor": null,
  //           "status": "pending",
  //           "type": "ach_credit_transfer",
  //           "usage": "reusable"



  //           // "id": "tok_visa",
  //           // "object": "token",
  //           // "card": {
  //           //   "id": "card_1E7elOB2K1jSrjX4nECGPN2b",
  //           //   "object": "card",
  //           //   "address_city": null,
  //           //   "address_country": null,
  //           //   "address_line1": null,
  //           //   "address_line1_check": null,
  //           //   "address_line2": null,
  //           //   "address_state": null,
  //           //   "address_zip": null,
  //           //   "address_zip_check": null,
  //           //   "brand": "Visa",
  //           //   "country": "US",
  //           //   "cvc_check": "pass",
  //           //   "dynamic_last4": null,
  //           //   "exp_month": 10,
  //           //   "exp_year": 2020,
  //           //   "funding": "credit",
  //           //   "last4": "4242",
  //           //   "metadata": {
  //           //   },
  //           //   "name": "asdflaksdjfalksdjf@gmail.com",
  //           //   "tokenization_method": null
  //           // },
  //           // "client_ip": "128.90.22.11",
  //           // "created": 1551083078,
  //           // "email": "asdflaksdjfalksdjf@gmail.com",
  //           // "livemode": false,
  //           // "type": "card",
  //           // "used": false

  //         // "email": "starman@tesla.com",
  //         // "validation_type": "card",
  //         // "payment_user_agent": "Stripe Checkout v3 checkout-manhattan (stripe.js/9dc17ab)",
  //         // "referrer": "http://localhost:3000/users/1/upgrade",
  //         // "card": {
  //         //   "number": "4242424242424242",
  //         //   "exp_month": "10",
  //         //   "exp_year": "20",
  //         //   "cvc": "123",
  //         //   "name": "starman@tesla.com"
  //         // },
  //         // "time_on_page": "13621",
  //         // "guid": "6ba5c842-6707-424c-9d3b-794c5b8548c4",
  //         // "muid": "a930388f-6a13-4238-a9fe-bfe112386a5d",
  //         // "sid": "258115a6-0bdd-4513-b68e-852f8ae09a6d",
  //         // "key": "pk_test_77z5YrRHm6FkeP46ilOaDsbQ"

  //       }
  //     }
  //     request.post(options, (err, res, body) => {
  //       expect(err).toBeNull();
  //       expect(this.user.role).toBe("premium");
  //       done();
  //     });
  //   });
  // });


});