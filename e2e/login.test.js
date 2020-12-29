const { beforeAll, expect } = require("@jest/globals");
const needle = require("needle");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

describe("login", () => {
  describe("successful login", () => {
    let response;
    beforeAll(async () => {
      console.log(process.env.TEST_EMAIL);
      const body = {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      };
      response = await needle("post", `localhost:${PORT}/user/login`, body, {
        json: true,
      });
    });
    test("return token", () => {
      expect(response.body.token).toBeDefined();
    });
    test("expect status code to be 200", () => {
      expect(response.statusCode).toBe(200);
    });
  });

  describe("unsuccessful login", () => {
    let response;
    beforeAll(async () => {
      const body = {
        email: process.env.TEST_EMAIL,
        password: "testpassword",
      };
      response = await needle("post", `localhost:${PORT}/user/login`, body, {
        json: true,
      });
    });
    test("return error message", () => {
      expect(response.body).toBe("Invalid Password");
    });
    test("expect status code to be 400", () => {
      expect(response.statusCode).toBe(400);
    });
  });
});
