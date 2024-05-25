import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";
import { findUser, saveUser } from "../services/authServices.js";

const { DB_TEST_HOST, PORT } = process.env;

describe("test /api/users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);

    await saveUser({
      email: "tk@gmail.com",
      password: "123",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  test("test login with correct data", async () => {
    const loginData = {
      email: "tk@gmail.com",
      password: "123",
    };

    const { status, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(status).toBe(200);
    expect(body.user.email).toBe(loginData.email);

    const user = await findUser({ email: loginData.email });
    expect(user).not.toBeNull();
    expect(user.email).toBe(loginData.email);
  });
});
