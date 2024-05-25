import request from "supertest";
import app from "../app.js"; // Assuming your app is exported as 'app'

describe("login controller", () => {
  it("should return status 200 and a token when login is successful", async () => {
    const userData = { email: "test@example.com", password: "password123" };

    const res = await request(app).post("/api/users/login").send(userData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toEqual(
      expect.objectContaining({
        email: userData.email,
        subscription: expect.any(String),
      })
    );
  }, 15000); // Increase timeout to 10 seconds
});
