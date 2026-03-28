require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 AI Skill Extraction
async function extractSkillsAI(text) {
  const prompt = `
  Extract technical skills from the following resume text.
  Return ONLY a JSON array.

  Resume:
  ${text}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0].message.content;

  try {
    return JSON.parse(result);
  } catch {
    return result.split(",");
  }
}

// 🔹 Upload API
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    const skills = await extractSkillsAI(data.text);

    res.json({ skills });
  } catch (err) {
    res.status(500).json({ error: "Error processing resume" });
  }
});

// 🔹 Job Matching (dummy)
app.post("/jobs", (req, res) => {
  const jobs = [
    { title: "Frontend Developer", match: "85%" },
    { title: "Backend Developer", match: "75%" },
    { title: "Data Analyst", match: "65%" }
  ];
  res.json(jobs);
});

// 🔹 Skill Gap + Learning
app.post("/analyze", async (req, res) => {
  const { skills } = req.body;

  const prompt = `
  Based on these skills: ${skills},

  1. Suggest missing important tech skills
  2. Suggest FREE learning resources

  Return JSON:
  {
    "missing_skills": [],
    "resources": []
  }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0].message.content;

  try {
    res.json(JSON.parse(result));
  } catch {
    res.json({ message: result });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
