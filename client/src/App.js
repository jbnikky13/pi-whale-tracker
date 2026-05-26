import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://pi-whale-tracker-production.up.railway.app";

function App() {
  const [whales, setWhales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: false });
    }
    fetchWhales();
    const interval = setInterval(fetchWhales, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWhales = async () => {
    try {
      const res = await axios.get(`${API}/api/whales`);
      setWhales(res.data.whales);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchWallet = async () => {
    if (!search) return;
    setWalletLoading(true);
    setWalletData(null);
    try {
      const res = await axios.get(`${API}/api/wallet/${search}`);
      setWalletData(res.data);
    } catch (err) {
      setWalletData({ error: "Wallet not found" });
    } finally {
      setWalletLoading(false);
    }
  };

  const makeDonation = () => {
    if (!window.Pi) {
      alert("Please open in Pi Browser");
      return;
    }
    window.Pi.authenticate(["payments"], () => {}).then(() => {
      window.Pi.createPayment({
        amount: 1,
        memo: "Support Pi Whale Tracker",
        metadata: { type: "donation" }
      }, {
        onReadyForServerApproval: async (id) => { await axios.post(`${API}/api/payments/approve`, { paymentId: id }); },
        onReadyForServerCompletion: async (id, txid) => { await axios.post(`${API}/api/payments/complete`, { paymentId: id, txid }); },
        onCancel: (id) => console.log("Cancelled:", id),
        onError: (err) => console.log("Error:", err)
      });
    });
  };

  const filteredWhales = whales.filter(w =>
    w.from.toLowerCase().includes(search.toLowerCase()) ||
    w.to.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    app: { backgroundColor: "#1a1a2e", minHeight: "100vh", color: "white", padding: "16px", fontFamily: "Arial" },
    header: { textAlign: "center", marginBottom: "20px" },
    title: { color: "#9c27b0", fontSize: "26px", margin: 0 },
    subtitle: { color: "#aaa", fontSize: "13px" },
    donateBtn: { backgroundColor: "#9c27b0", border: "none", borderRadius: "8px", color: "white", padding: "8px 20px", marginTop: "8px", cursor: "pointer", fontSize: "13px" },
    searchRow: { display: "flex", gap: "8px", marginBottom: "16px" },
    input: { flex: 1, padding: "10px", backgroundColor: "#16213e", border: "1px solid #9c27b0", borderRadius: "8px", color: "white", fontSize: "13px" },
    btn: { padding: "10px 16px", backgroundColor: "#9c27b0", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px" },
    stats: { display: "flex", gap: "10px", marginBottom: "20px" },
    stat: { flex: 1, backgroundColor: "#16213e", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #9c27b033" },
    statVal: { color: "#9c27b0", fontSize: "18px", fontWeight: "bold" },
    statLabel: { color: "#aaa", fontSize: "11px" },
    card: (a) => ({ backgroundColor: "#16213e", borderRadius: "12px", padding: "16px", marginBottom: "12px", border: `1px solid ${a >= 10000 ? "#ff6b6b" : a >= 3000 ? "#ffd93d" : "#9c27b0"}`, cursor: "pointer" }),
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    amount: (a) => ({ color: a >= 10000 ? "#ff6b6b" : a >= 3000 ? "#ffd93d" : "#9c27b0", fontSize: "20px", fontWeight: "bold" }),
    addr: { fontSize: "11px", color: "#aaa", marginTop: "8px" },
    date: { fontSize: "11px", color: "#555", marginTop: "4px" },
    modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", padding: "20px", overflowY: "auto", zIndex: 100 },
    modalBox: { backgroundColor: "#16213e", borderRadius: "12px", padding: "20px", border: "1px solid #9c27b0" },
    closeBtn: { float: "right", background: "none", border: "none", color: "#aaa", fontSize: "20px", cursor: "pointer" },
    txHash: { fontSize: "10px", color: "#666", wordBreak: "break-all", marginTop: "8px" },
    walletBox: { backgroundColor: "#16213e", borderRadius: "12px", padding: "16px", marginBottom: "12px", border: "1px solid #4caf50" },
    walletTx: { fontSize: "12px", color: "#aaa", padding: "8px 0", borderBottom: "1px solid #ffffff11" }
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <h1 style={s.title}>🐋 Pi Whale Tracker</h1>
        <p style={s.subtitle}>Tracking large Pi Network transactions in real-time</p>
        <button onClick={makeDonation} style={s.donateBtn}>⚡ Support with 1π</button>
      </div>

      <div style={s.searchRow}>
        <input
          style={s.input}
          placeholder="Enter full wallet address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyPress={e => e.key === "Enter" && searchWallet()}
        />
        <button style={s.btn} onClick={searchWallet}>Search</button>
        {search && <button style={{...s.btn, backgroundColor: "#333"}} onClick={() => { setSearch(""); setWalletData(null); }}>✕</button>}
      </div>

      {walletLoading && <p style={{ color: "#9c27b0", textAlign: "center" }}>Looking up wallet...</p>}
      {walletData && !walletData.error && (
        <div style={s.walletBox}>
          <p style={{ color: "#4caf50", fontWeight: "bold", margin: "0 0 10px" }}>✅ Wallet Transactions</p>
          {Array.isArray(walletData) && walletData.slice(0, 10).map((tx, i) => (
            <div key={i} style={s.walletTx}>
              <div>{tx.type === "payment" ? (tx.from === search ? "📤 Sent" : "📥 Received") : tx.type}</div>
              <div style={{ color: "#9c27b0" }}>{parseFloat(tx.amount || 0).toFixed(3)} π</div>
              <div>{new Date(tx.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      {walletData?.error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{walletData.error}</p>}

      <div style={s.stats}>
        <div style={s.stat}><div style={s.statVal}>{whales.length}</div><div style={s.statLabel}>Whales Found</div></div>
        <div style={s.stat}><div style={s.statVal}>{whales.reduce((a, w) => a + w.amount, 0).toLocaleString()} π</div><div style={s.statLabel}>Total Pi Moved</div></div>
        <div style={s.stat}><div style={s.statVal}>{new Date().toLocaleTimeString()}</div><div style={s.statLabel}>Last Updated</div></div>
      </div>

      <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "10px" }}>Tap any transaction to see details</p>
      {loading ? (
        <p style={{ textAlign: "center", color: "#9c27b0" }}>Loading whales...</p>
      ) : filteredWhales.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>No whale transactions found</p>
      ) : (
        filteredWhales.map(whale => (
          <div key={whale.id} style={s.card(whale.amount)} onClick={() => setSelected(whale)}>
            <div style={s.cardTop}>
              <span>{whale.amount >= 10000 ? "🐋" : whale.amount >= 3000 ? "🐬" : "🐟"}</span>
              <span style={s.amount(whale.amount)}>{whale.amount.toLocaleString()} π</span>
            </div>
            <div style={s.addr}>FROM: {whale.from.slice(0, 24)}...</div>
            <div style={s.addr}>TO: &nbsp;&nbsp;{whale.to.slice(0, 24)}...</div>
            <div style={s.date}>{new Date(whale.date).toLocaleString()}</div>
          </div>
        ))
      )}

      {selected && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            <h3 style={{ color: "#9c27b0", margin: "0 0 16px" }}>Transaction Detail</h3>
            <p><span style={{ color: "#aaa" }}>Amount:</span> <strong style={{ color: "#9c27b0" }}>{selected.amount.toLocaleString()} π</strong></p>
            <p><span style={{ color: "#aaa" }}>Date:</span> {new Date(selected.date).toLocaleString()}</p>
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "12px" }}>FROM:</p>
            <p style={{ fontSize: "12px", wordBreak: "break-all" }}>{selected.from}</p>
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "8px" }}>TO:</p>
            <p style={{ fontSize: "12px", wordBreak: "break-all" }}>{selected.to}</p>
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "8px" }}>TX HASH:</p>
            <p style={s.txHash}>{selected.txHash}</p>
            <button style={{...s.btn, width: "100%", marginTop: "12px"}} onClick={() => { setSearch(selected.from); setSelected(null); searchWallet(); }}>
              🔍 Track This Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
