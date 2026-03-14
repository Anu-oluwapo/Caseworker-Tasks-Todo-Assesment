import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Tasks API", () => {
  const app = createApp();

  it("creates + lists tasks", async () => {
    const createRes = await request(app)
      .post("/api/tasks")
      .send({ title: "Call claimant", dueAt: "2030-01-01T10:00:00.000Z" })
      .expect(201);

    expect(createRes.body).toHaveProperty("_id");
    expect(createRes.body.title).toBe("Call claimant");
    expect(createRes.body.status).toBe("todo");

    const listRes = await request(app).get("/api/tasks").expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
  });

  it("updates status", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Review evidence", dueAt: "2030-02-01T10:00:00.000Z" })
      .expect(201);

    const id = created.body._id;

    const patched = await request(app)
      .patch(`/api/tasks/${id}/status`)
      .send({ status: "done" })
      .expect(200);

    expect(patched.body.status).toBe("done");
  });

  it("updates task data", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Code Testing", dueAt: "2030-02-01T10:00:00.000Z" })
      .expect(201);

    const id = created.body._id;

    const patched = await request(app)
      .patch(`/api/tasks/${id}`)
      .send({ title: "Code Review" })
      .expect(200);

    expect(patched.body.title).toBe("Code Review");
  });

  it("returns 400 on invalid payload", async () => {
    await request(app).post("/api/tasks").send({ title: "A" }).expect(400);
  });
});
