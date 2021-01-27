const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let validPuzzle =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
  complete =
    "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, complete);
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "..9..5.1.85.4....2432..k...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.....",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    const coordinate = "A1";
    const value = "7";
    const status = { valid: true };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.deepEqual(res.body, status);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    const coordinate = "A2";
    const value = "1";
    const status = { valid: false, conflict: ["row"] };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.deepEqual(res.body, status);
        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    const coordinate = "A1";
    const value = "1";
    const status = { valid: false, conflict: ["row", "column"] };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.deepEqual(res.body, status);
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    const input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A1";
    const value = "5";
    const status = { valid: false, conflict: ["row", "column", "region"] };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: input, coordinate, value })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.deepEqual(res.body, status);
        done();
      });
  });
  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    const input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const error = { error: "Required field(s) missing" };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: input })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, error);
        done();
      });
  });
  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "..9..5.1.85.4....2432..k...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.....",
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    const coordinate1 = "K1";
    const coordinate2 = "A11";
    const error = { error: "Invalid coordinate" };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: coordinate1, value: "2" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, error);

        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: validPuzzle, coordinate: coordinate2, value: "2" })
          .end((errr, result) => {
            assert.isObject(result.body);
            assert.property(result.body, "error");
            assert.deepEqual(result.body, error);
            done();
          });
      });
  });
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    const error = { error: "Invalid value" };

    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A1", value: "X" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, error);
        done();
      });
  });
});
