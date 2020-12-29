const { beforeAll, expect } = require("@jest/globals");
const needle = require("needle");
require("dotenv").config();

const UserRoute = require("../routes/user_route");

const PORT = process.env.PORT || 3000;

describe("register", () => {
  describe("successful register", () => {
    let response;
    beforeAll(async () => {
      const body = {
        name: "Test User",
        email: "test@tester.com",
        password: "testpassword",
        confirmPassword: "testpassword",
      };
      response = await needle("post", `localhost:${PORT}/user/register`, body, {
        json: true,
      });
    });
    test("return user object", () => {
      expect(response.body).toBeDefined();
    });
    test("expect status code to be 200", () => {
      expect(response.statusCode).toBe(200);
    });
  });

  describe("unsuccessful register", () => {
    let response;
    beforeAll(async () => {
      const body = {
        name: "Test User",
        email: "test@tester.com",
        password: "testpassword",
        confirmPassword: "testpass",
      };
      response = await needle("post", `localhost:${PORT}/user/register`, body, {
        json: true,
      });
    });
    test("return error message", () => {
      const error = JSON.parse(response.body).password;
      expect(error).toBe("Passwords do not match");
    });
    test("expect status code to be 400", () => {
      expect(response.statusCode).toBe(400);
    });
  });
});
