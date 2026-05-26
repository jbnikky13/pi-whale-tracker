import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [whales, setWhales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWhales();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchWhales, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWhales = async () => {
    try {
      const res = await axios.get("https://pi-whale-tracker-production.up.railway.app/api/whales");
      setWhales(res.data.whales);
    } catch (err) {
      console.error("Error fetching whales:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredWhales = whales.filter(w =>
    w.from.includes(search) || w.to.includes(search)
  );

  return (
    <div style={{ backgroundColor: "#1a1a2e", minHeight: "100vh", 
                  color: "white", padding: "20px", fontFamily: "Arial" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#9c27b0", fontSize: "28px" }}>
          🐋 Pi Whale Tracker
        </h1>
        <p style={{ color: "#aaa" }}>
          Tracking large Pi Network transactions in real-time
        </p>
      </div>

      {/* Search */}
      <input
        placeholder="Search wallet address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "12px", marginBottom: "20px",
          backgroundColor: "#16213e", border: "1px solid #9c27b0",
          borderRadius: "8px", color: "white", fontSize: "14px"
        }}
      />

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
        {[
          { label: "Whales Found", value: whales.length },
          { label: "Total Pi Moved", 
            value: whales.reduce((a, w) => a + w.amount, 0)
                        .toLocaleString() + " π" },
          { label: "Last Updated", value: new Date().toLocaleTimeString() }
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, backgroundColor: "#16213e", padding: "15px",
            borderRadius: "10px", textAlign: "center",
            border: "1px solid #9c27b033"
          }}>
            <div style={{ color: "#9c27b0", fontSize: "20px", 
                          fontWeight: "bold" }}>{stat.value}</div>
            <div style={{ color: "#aaa", fontSize: "12px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Whale Feed */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#9c27b0" }}>
          Loading whales...
        </p>
      ) : filteredWhales.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          No whale transactions found yet
        </p>
      ) : (
        filteredWhales.map(whale => (
          <div key={whale.id} style={{
            backgroundColor: "#16213e", borderRadius: "12px",
            padding: "18px", marginBottom: "15px",
            border: `1px solid ${
              whale.amount >= 100000 ? "#ff6b6b" :
              whale.amount >= 50000  ? "#ffd93d" : "#9c27b0"
            }`
          }}>
            <div style={{ display: "flex", 
                          justifyContent: "space-between",
                          alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>
                {whale.amount >= 100000 ? "🐋" :
                 whale.amount >= 50000  ? "🐬" : "🐟"}
              </span>
              <span style={{ 
                color: "#9c27b0", fontSize: "22px", fontWeight: "bold" 
              }}>
                {whale.amount.toLocaleString()} π
              </span>
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
              <div>FROM: {whale.from.slice(0, 20)}...</div>
              <div>TO: &nbsp;&nbsp;{whale.to.slice(0, 20)}...</div>
              <div style={{ marginTop: "5px", color: "#666" }}>
                {new Date(whale.date).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;