import express from "express";
import banner from "../banner.js";  // Ensure this file exports an object with banner text

const router = express.Router();

// Get banner text
router.get("/", (req, res) => {
  res.json({ banner });
});

// Update banner text (Admin)
router.post("/update", (req, res) => {
  const { bannertext } = req.body;

  if (bannertext !== undefined) {
    banner.text = bannertext;  // Ensure banner object has a `text` property
  }

  res.json({ success: true, banner });
});

export default router;
