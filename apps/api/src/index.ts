import express from "express";

const app = express();
const port = process.env.API_PORT ?? 4000;

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "buildbudget-api" });
});

app.listen(port, () => {
  console.log(`BuildBudget API placeholder listening on port ${port}`);
});
