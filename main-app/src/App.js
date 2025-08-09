import React, { useState } from "react";
import { sha256 } from "js-sha256";

export default function App() {
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");
  const [gpa, setGpa] = useState("");
  const [major, setMajor] = useState("Computer Science");
  const [difficulty, setDifficulty] = useState(4);
  const [mining, setMining] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const majorOptions = [
    "Computer Science",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const degreeOptions = [
    "B.Tech",
    "M.Tech",
    "B.Sc",
    "M.Sc",
    "B.A",
    "M.A",
    "MBA",
    "PhD",
    "Other"
  ];

// Fetch blocks from the server
  const fetchBlocks = async () => {
    try {
      const response = await fetch('/api/blocks');
      if (response.ok) {
        const data = await response.json();
        setBlocks(data);
      }
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    }
  };

  // Save block to the server
  const saveBlockToServer = async (block) => {
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(block),
      });
      
      if (response.ok) {
        const savedBlock = await response.json();
        return savedBlock;
      } else {
        console.error('Failed to save block to server');
        return null;
      }
    } catch (error) {
      console.error('Error saving block to server:', error);
      return null;
    }
  };

  const mineBlock = async () => {
    // Validation
    if (!name || !degree || !gpa || !major) {
      alert("Please fill in all fields");
      return;
    }

    // Validate GPA range
    const gpaValue = parseFloat(gpa);
    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      alert("Please enter a valid GPA between 0 and 10");
      return;
    }

    // Validate difficulty range
    const difficultyValue = parseInt(difficulty);
    if (isNaN(difficultyValue) || difficultyValue < 1 || difficultyValue > 6) {
      alert("Please enter a valid difficulty between 1 and 6");
      return;
    }

    setMining(true);
    let nonce = 0;
    const timestamp = Date.now();
    const prefix = "0".repeat(difficultyValue);
    let hash = "";

    const data = `${name}|${degree}|${gpa}|${major}|${timestamp}`;

    while (!hash.startsWith(prefix)) {
      const raw = data + "|" + nonce;
      hash = sha256(raw);
      nonce++;
      if (nonce % 10000 === 0) await new Promise((r) => setTimeout(r, 1));
    }

    const newBlock = {
      name,
      degree,
      gpa: parseFloat(gpa),
      major,
      timestamp,
      nonce,
      hash
    };

    // Save block to server
    const savedBlock = await saveBlockToServer(newBlock);
    if (savedBlock) {
      // Fetch all blocks from server to update the display
      await fetchBlocks();
    } else {
      // If saving to server fails, still update local state
      setBlocks([...blocks, newBlock]);
    }
    
    setMining(false);
  };

  // Fetch blocks when component mounts
  React.useEffect(() => {
    fetchBlocks();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case "how-it-works":
        return (
          <div className="page-container active">
            <header className="hero">
              <h1>How Blockademic Works</h1>
              <p>Understanding the blockchain certificate minting process</p>
            </header>
            
            <main className="info-page">
              <div className="content-card">
                <h2>Blockchain Certificate Minting</h2>
                <p>Blockademic uses a proof-of-work algorithm to create tamper-proof educational certificates. Each certificate is "mined" by computing a hash that meets a specific difficulty requirement.</p>
                
                <h3>The Process</h3>
                <ol>
                  <li>Enter your certificate details in the form</li>
                  <li>Select the difficulty level (number of leading zeros in the hash)</li>
                  <li>Click "Mint Certificate" to start the mining process</li>
                  <li>The application computes hashes until one meets the difficulty requirement</li>
                  <li>Your certificate is added to the blockchain visualization</li>
                </ol>
                
                <h3>Why Blockchain for Certificates?</h3>
                <ul>
                  <li><strong>Immutable:</strong> Once minted, certificates cannot be altered</li>
                  <li><strong>Verifiable:</strong> Anyone can verify the certificate's authenticity</li>
                  <li><strong>Decentralized:</strong> No single authority controls the certificates</li>
                  <li><strong>Transparent:</strong> The minting process is open and auditable</li>
                </ul>
                
                <h3>Security Features</h3>
                <p>Each certificate includes a timestamp and nonce value that makes it computationally expensive to forge. The difficulty level determines how much work is required to mint a certificate.</p>
              </div>
            </main>
          </div>
        );
      
      case "about":
        return (
          <div className="page-container active">
            <header className="hero">
              <h1>About Blockademic</h1>
              <p>Secure educational certificate minting on the blockchain</p>
            </header>
            
            <main className="info-page">
              <div className="content-card">
              <h2>Our Mission</h2>
              <p>Blockademic aims to simplify and secure the process of issuing and verifying academic certificates by using blockchain technology.</p>

              <h2>How It Started</h2>
              <p>Blockademic was developed as a college project to demonstrate how blockchain can be applied to create verifiable and tamper-proof academic records.</p>

              <h2>Technology Stack</h2>
              <ul>
                <li><strong>Frontend:</strong> React.js with modern CSS</li>
                <li><strong>Hashing:</strong> SHA-256 algorithm</li>
                <li><strong>Backend:</strong> Node.js with MongoDB</li>
                <li><strong>Blockchain:</strong> Custom proof-of-work system</li>
              </ul>

              <h2>Future Vision</h2>
              <p>We envision Blockademic becoming a trusted standard for academic credential verification, enabling institutions to issue secure, verifiable certificates and empowering students with ownership of their academic records.</p>
            </div>
            </main>
          </div>
        );
      
      default: // home page
        return (
          <main>
            <div className="form-container">
              <h2>Create Your Certificate</h2>
              <div className="form-group">
                <label htmlFor="studentName">Student Name</label>
                <input 
                  id="studentName"
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="degree">Degree</label>
                <select 
                  id="degree"
                  value={degree} 
                  onChange={(e) => setDegree(e.target.value)}
                >
                  <option value="">Select your degree</option>
                  {degreeOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="gpa">GPA (0 - 10)</label>
                <input
                  id="gpa"
                  placeholder="Enter your GPA"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="major">Major</label>
                <select 
                  id="major"
                  value={major} 
                  onChange={(e) => setMajor(e.target.value)}
                >
                  {majorOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty (leading 0s)</label>
                <input
                  id="difficulty"
                  placeholder="1-6"
                  type="number"
                  min="1"
                  max="6"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
              </div>
              
              <button onClick={mineBlock} disabled={mining}>
                {mining ? "Minting Certificate..." : "Mint Certificate"}
              </button>
            </div>

            <section className="blockchain">
              {blocks.length === 0 ? (
                <p style={{textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1'}}>
                  No certificates minted yet. Create your first certificate above!
                </p>
              ) : (
                blocks.map((block, idx) => (
                  <div className="block" key={idx}>
                    <div className="block-header">📦 Block #{idx + 1}</div>
                    <div className="block-content">
                      <div><strong>Name:</strong> <span>{block.name}</span></div>
                      <div><strong>Degree:</strong> <span>{block.degree}</span></div>
                      <div><strong>GPA:</strong> <span>{block.gpa}</span></div>
                      <div><strong>Major:</strong> <span>{block.major}</span></div>
                      <div><strong>Timestamp:</strong> <span>{formatTimestamp(block.timestamp)}</span></div>
                      <div><strong>Nonce:</strong> <span>{block.nonce}</span></div>
                      <div><strong>Hash:</strong> <code>{block.hash}</code></div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </main>
        );
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🎓 Blockademic</div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={menuOpen ? "show" : ""}>
          <li><a href="#home" onClick={() => navigateTo("home")}>Home</a></li>
          <li><a href="#how" onClick={() => navigateTo("how-it-works")}>How It Works</a></li>
          <li><a href="#dev" onClick={() => navigateTo("about")}>About</a></li>
        </ul>
      </nav>

      {currentPage === "home" ? (
        <header className="hero" id="home">
          <h1>🎓 Blockademic</h1>
          <p>Blockademic - Mint your degree on chain</p>
        </header>
      ) : null}

      {renderPage()}

      {currentPage === "home" ? (
        <footer>
          <p>© {new Date().getFullYear()} Blockademic. Secure educational certificates on the blockchain.</p>
        </footer>
      ) : (
        <footer>
          <p>© {new Date().getFullYear()} Blockademic. Secure educational certificates on the blockchain.</p>
          <button className="secondary-button" onClick={() => navigateTo("home")}>
            Back to Home
          </button>
        </footer>
      )}
    </div>
  );
}
