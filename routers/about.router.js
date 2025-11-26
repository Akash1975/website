// routers/about.router.js
const express = require("express");
const router = express.Router();
const About = require("../models/about.mongo");
const multer = require("multer");

// Optional: return about JSON (useful for API)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // your upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// Update About including image
router.post(
  "/admin/about/update/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { paragraph1, paragraph2, paragraph3, title } = req.body;
      const updateData = { paragraph1, paragraph2, paragraph3, title };

      if (req.file) {
        updateData.image = req.file.filename; // save new image
      }

      await About.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.redirect("/admin/interface");
    } catch (err) {
      console.error("Error updating about:", err);
      res.status(500).send("Error updating about");
    }
  }
);
router.get("/api/about", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({}); // create default document
    }
    res.json(about);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update about paragraphs (used by admin form)
// router.post("/admin/about/update/:id", async (req, res) => {
//   try {
//     const { paragraph1, paragraph2, paragraph3, title } = req.body;
//     await About.findByIdAndUpdate(
//       req.params.id,
//       { paragraph1, paragraph2, paragraph3, title },
//       { new: true, runValidators: true }
//     );
//     res.redirect("/admin/interface");
//   } catch (err) {
//     console.error("Error updating about:", err);
//     res.status(500).send("Error updating about");
//   }
// });

module.exports = router;
