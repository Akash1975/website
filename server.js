const express = require("express");
const ejs = require("ejs");
const connectDB = require("./mongo/mongo"); // your DB connect file
const session = require("express-session");
const fs = require("fs");
const path = require("path");

// routers & models
const certificateRouter = require("./routers/certificate.routers");
const skillRouter = require("./routers/skills.router");
const aboutRouter = require("./routers/about.router");
const aboutSkillRouter = require("./routers/aboutSkill.router");
const projectRouter = require("./routers/project.router");

const Certificate = require("./models/certificate.mongo");
const Skill = require("./models/skills.mongo");
const About = require("./models/about.mongo");
const AboutSkill = require("./models/aboutSkill.mongo");
const Project = require("./models/project.mongo");

const checkAdmin = require("./middleware/checkadmin");
const { saveMessage } = require("./models/msg.mongo");

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Serve uploads with fallback to default.png
app.get("/uploads/:file", (req, res) => {
  const filePath = path.join(uploadDir, req.params.file);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(uploadDir, "default.png"));
  }
});

// Session
app.use(
  session({
    secret: "Akya1907",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect DB
connectDB();

// Home route
app.get("/", async (req, res) => {
  try {
    const certificate = await Certificate.find();
    const skills = await Skill.find();
    let about = await About.findOne();
    if (!about) about = { image: "default.png", title: "About Me" };
    res.render("home", { certificate, skills, about });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home");
  }
});

// Routers
app.use("/", certificateRouter);
app.use("/certificate", certificateRouter);
app.use("/skills", skillRouter);
app.use("/", skillRouter);
app.use("/", aboutRouter);
app.use("/", aboutSkillRouter);
app.use("/projects", projectRouter);

// About page
app.get("/about", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create({});
    const aboutSkills = await AboutSkill.find();
    res.render("about", { about, aboutSkills });
  } catch (err) {
    console.error(err);
    res.render("about", {
      about: {
        paragraph1: "",
        paragraph2: "",
        paragraph3: "",
        title: "About Me",
        image: "default.png",
      },
      aboutSkills: [],
    });
  }
});

// Contact routes
app.post("/Contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await saveMessage({ name, email, message });
    req.session.successMsg = "Message sent successfully!";
    res.redirect("/Contact");
  } catch (err) {
    console.error(err);
    req.session.errorMsg = "Something went wrong!";
    res.redirect("/Contact");
  }
});

app.get("/Contact", (req, res) => {
  const successMsg = req.session.successMsg || null;
  const errorMsg = req.session.errorMsg || null;
  req.session.successMsg = null;
  req.session.errorMsg = null;
  res.render("contact", { successMsg, errorMsg });
});

// Projects page
app.get("/project", async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("project", { projects });
  } catch (error) {
    console.error(error);
    res.send("Error loading projects");
  }
});

// Admin login
// Admin login page
app.get("/admin/login", (req, res) => {
  const errorMsg = req.session.errorMsg || null; // get any session error
  req.session.errorMsg = null; // clear after showing
  res.render("admin-login", { errorMsg }); // pass it to EJS
});

app.post("/admin/interface", (req, res) => {
  const { username, password } = req.body;
  if (username === "Akash" && password === "Akya1907") {
    req.session.isAdmin = true;
    return res.redirect("/admin/interface");
  }

  req.session.errorMsg = "Invalid username or password!";
  res.redirect("/admin/login");
});

// Admin dashboard (protected)
app.get("/admin/interface", checkAdmin, async (req, res) => {
  try {
    const certificate = await Certificate.find();
    const skills = await Skill.find();
    let about = await About.findOne();
    if (!about) about = await About.create({});
    const aboutSkills = await AboutSkill.find();
    const projects = await Project.find();
    res.render("admin", { certificate, skills, about, aboutSkills, projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading admin panel");
  }
});

// Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

// Skills page
app.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.render("skill", { skills });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Skills");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
