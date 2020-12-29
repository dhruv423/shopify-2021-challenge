const { beforeAll, expect } = require("@jest/globals");
const needle = require("needle");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

describe("upload", () => {
  describe("successful login and upload", () => {
    let loginResponse;
    let uploadResponse;
    beforeAll(async () => {
      const body = {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      };
      loginResponse = await needle(
        "post",
        `localhost:${PORT}/user/login`,
        body,
        {
          json: true,
        }
      );
      const data = {
        images: {
          file:
            path.resolve(__dirname, "../") +
            "/uploads/Screen Shot 2020-12-29 at 12.13.20 PM.png",
          content_type: "image/png",
        },
        JWTToken: loginResponse.body.token,
      };

      uploadResponse = await needle(
        "post",
        `localhost:${PORT}/image/upload`,
        data,
        { multipart: true }
      );
    });
    test("return image object", () => {
      expect(uploadResponse.body.results).toBeDefined();
    });
    test("expect status code to be 200", () => {
      expect(uploadResponse.statusCode).toBe(200);
    });
  });

  describe("successful login and unsuccessful upload", () => {
    let loginResponse;
    let uploadResponse;
    beforeAll(async () => {
      const body = {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      };
      loginResponse = await needle(
        "post",
        `localhost:${PORT}/user/login`,
        body,
        {
          json: true,
        }
      );

      const data = {
        images: {
          file:
            path.resolve(__dirname, "../") +
            "/uploads/Screen Shot 2020-12-29 at 12.13.20 PM.png",
          content_type: "image/png",
        },
        JWTToken: loginResponse.body.token,
      };

      uploadResponse = await needle(
        "post",
        `localhost:${PORT}/image/upload`,
        data,
        { multipart: true }
      );
    });
    test("return error", () => {
      expect(uploadResponse.body.errors).toBeDefined();
    });
    test("expect status code to be 400", () => {
      expect(uploadResponse.statusCode).toBe(400);
    });
  });
});
