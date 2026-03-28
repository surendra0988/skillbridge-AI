import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analysis, setAnalysis] = useState({});

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    setSkills(res.data.skills);

    const jobRes = await axios.post("http://localhost:5000/jobs", {
      skills: res.data.skills
    });
    setJobs(jobRes.data);

    const analysisRes = await axios.post("http://localhost:5000/analyze", {
      skills: res.data.skills
    });
    setAnalysis(analysisRes.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 SkillBridge AI</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Upload Resume</button>

      <h2>Skills:</h2>
      <ul>
        {skills.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h2>Jobs:</h2>
      <ul>
        {jobs.map((j, i) => (
          <li key={i}>{j.title} - {j.match}</li>
        ))}
      </ul>

      <h2>Missing Skills:</h2>
      <ul>
        {analysis.missing_skills?.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h2>Learning Resources:</h2>
      <ul>
        {analysis.resources?.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

export default App;
