import express from "express";
import fs from "fs";
import path from "path";
import constants from "../constants.js";

const router = express.Router();
const constantsPath = path.resolve("constants.js");

// ✅ Fetch constants
// ✅ Fetch latest constants dynamically
router.get("/", async (req, res) => {
  try {
    const { default: updatedConstants } = await import(`file://${constantsPath}?${Date.now()}`);
    res.json({
      botNames: updatedConstants.botNames,
      profilePics: updatedConstants.profilePics,
      messageTemplates: updatedConstants.messageTemplates,
      reactions: updatedConstants.reactions,
      botMessages: updatedConstants.botMessages,
    });
  } catch (error) {
    console.error("Error loading constants.js:", error);
    res.status(500).json({ error: "Failed to load constants.js" });
  }
});


// ✅ Update constants and write to file
router.post("/", (req, res) => {
  const { type, data } = req.body;
  const validTypes = ["botNames", "profilePics", "messageTemplates", "reactions", "botMessages"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  // ✅ Update constants in memory
  constants[type] = [...data];

  // ✅ Convert to module.exports format
  const fileContent = `export default ${JSON.stringify(constants, null, 2)};`;

  // ✅ Write the updated constants.js file
  try {
    fs.writeFileSync(constantsPath, fileContent, "utf8");
    res.json({ success: true, message: `${type} updated successfully!` });
  } catch (error) {
    console.error("Error updating constants.js:", error);
    res.status(500).json({ error: "Failed to update constants.js" });
  }
});

export default router;
