import express from "express";
import progress from "../progressbar.js";

const router = express.Router();

// Get progress
router.get("/", (req, res) => {
  res.json(progress);
});

// Update progress (Admin)
router.post("/update", (req, res) => {
  const { start, end, current } = req.body;
  
  if (start !== undefined) progress.start = start;
  if (end !== undefined) progress.end = end;
  if (current !== undefined) progress.current = current;

  res.json({ success: true, progress });
});

export default router;
