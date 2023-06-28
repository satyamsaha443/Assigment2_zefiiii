import { expect } from "chai";
import chaiHttp from "chai-http";
import express from "express";
import { pingRouter } from "./ping.route.js";

const app = express();
app.use(express.json());
app.use("/api/v1", pingRouter);

chai.use(chaiHttp);

describe("Ping API Test Suite", function () {
  this.timeout(8000);

  let server;

  before(function (done) {
    server = app.listen(3000, () => {
      console.log("Server is running on port 3000");
      done();
    });
  });

  it("should get instance's health status", function () {
    return chai
      .request(server)
      .get("/api/v1/ping")
      .then(function (res) {
        expect(res.status).to.equal(200);
        expect(res.body.ping).to.equal("pong!");
      });
  });

  it("should return an error if the ping route is not found", function () {
    return chai
      .request(server)
      .get("/api/v1/nonexistent-route")
      .then(function (res) {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("Route not found");
      });
  });

  it("should return a 500 status if there is an internal server error", function () {
    app.get("/api/v1/internal-error", function (req, res) {
      throw new Error("Internal server error");
    });

    return chai
      .request(server)
      .get("/api/v1/internal-error")
      .then(function (res) {
        expect(res.status).to.equal(500);
        expect(res.body.error).to.equal("Internal server error");
      });
  });

  after(function (done) {
    server.close(() => {
      console.log("Server closed");
      done();
    });
  });
});
