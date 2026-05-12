import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import jobsRouter from "./jobs";
import companiesRouter from "./companies";
import aiRouter from "./ai";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/ai", aiRouter);

describe("Jobs API", () => {
  it("GET /api/jobs returns array", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/jobs?grade=Junior returns only Junior jobs", async () => {
    const res = await request(app).get("/api/jobs?grade=Junior");
    expect(res.status).toBe(200);
    res.body.forEach((job: { grade: string }) => {
      expect(job.grade).toBe("Junior");
    });
  });

  it("GET /api/jobs?city=Almaty returns only Almaty jobs", async () => {
    const res = await request(app).get("/api/jobs?city=Almaty");
    expect(res.status).toBe(200);
    res.body.forEach((job: { city: string }) => {
      expect(job.city).toBe("Almaty");
    });
  });

  it("GET /api/jobs/meta returns filter options", async () => {
    const res = await request(app).get("/api/jobs/meta");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("cities");
    expect(res.body).toHaveProperty("grades");
    expect(res.body).toHaveProperty("workFormats");
    expect(Array.isArray(res.body.cities)).toBe(true);
  });

  it("GET /api/jobs/:id returns job with company", async () => {
    const list = await request(app).get("/api/jobs");
    const id = list.body[0]?.id;
    if (!id) return;
    const res = await request(app).get(`/api/jobs/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", id);
    expect(res.body).toHaveProperty("company");
    expect(Array.isArray(res.body.skills)).toBe(true);
  });

  it("GET /api/jobs/:id returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/jobs/nonexistent-id");
    expect(res.status).toBe(404);
  });
});

describe("Companies API", () => {
  it("GET /api/companies returns array", async () => {
    const res = await request(app).get("/api/companies");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/companies/:id returns company with jobs", async () => {
    const list = await request(app).get("/api/companies");
    const id = list.body[0]?.id;
    if (!id) return;
    const res = await request(app).get(`/api/companies/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", id);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });
});

describe("AI Chat API", () => {
  it("POST /api/ai/chat returns answer and toolCalls", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({ city: "Almaty", grade: "Junior" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(Array.isArray(res.body.toolCalls)).toBe(true);
    expect(res.body.toolCalls[0].tool).toBe("jobSearchTool");
  });
});
