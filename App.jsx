import React, { useEffect, useState } from "react";

// The Vortex - single-file React app (App.jsx)
// - TailwindCSS classes are used for styling (assumes your Vercel project includes Tailwind)
// - Members, photos, and messages persist in localStorage
// - Photos are stored as data URLs in localStorage (replace with real image URLs if you prefer)

export default function App() {
  const placeholderImg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='%23030b1a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2393c5ff' font-size='22'>Add Photo</text></svg>";

  const defaultMembers = [
    { id: 1, name: "Saint kieran", role: "(role)", photo: placeholderImg },
    { id: 2, name: "Chems", role: "(role)", photo: placeholderImg },
    { id: 3, name: "Mark", role: "(role)", photo: placeholderImg },
    { id: 4, name: "Young blood", role: "(role)", photo: placeholderImg },
  ];

  const [members, setMembers] = useState(() => {
    try {
      const raw = localStorage.getItem("vortex_members");
      return raw ? JSON.parse(raw) : defaultMembers;
    } catch (e) {
      return defaultMembers;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("vortex_messages");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [quote, setQuote] = useState(() => localStorage.getItem("vortex_quote") || "Your squad quote goes here...");

  useEffect(() => {
    localStorage.setItem("vortex_members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("vortex_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("vortex_quote", quote);
  }, [quote]);

  // Member handlers
  function addMember() {
    if (!newName.trim()) return;
    const id = Date.now();
    const newMember = { id, name: newName.trim(), role: "(role)", photo: placeholderImg };
    setMembers((m) => [...m, newMember]);
    setNewName("");
  }

  function removeMember(id) {
    // Instead of fully deleting, replace with a placeholder entry so layout persists
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, name: "(placeholder)", photo: placeholderImg } : x)));
  }

  function updateMemberName(id, name) {
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, name } : x)));
  }

  function updateMemberRole(id, role) {
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, role } : x)));
  }

  function handlePhotoUpload(e, id) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setMembers((m) => m.map((x) => (x.id === id ? { ...x, photo: dataUrl } : x)));
    };
    reader.readAsDataURL(file);
  }

  // Messages
  function postMessage() {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), text: newMessage.trim(), time: new Date().toISOString() };
    setMessages((ms) => [msg, ...ms]);
    setNewMessage("");
  }

  function clearMessages() {
    if (!confirm("Clear all messages? This cannot be undone.")) return;
    setMessages([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06040b] via-[#070617] to-[#0b0520] text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg" style={{ textShadow: "0 0 20px rgba(99,102,241,0.25)" }}>
          <span className="mr-3">🌪️</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">The Vortex</span>
        </h1>
        <p className="mt-3 text-slate-300">private beach party — let the part begin</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Card */}
        <section className="md:col-span-1 bg-[#071025]/50 backdrop-blur rounded-2xl p-4 border border-[#2a1f3a] shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Members</h2>

          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/2">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#7c3aed]/40">
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <input
                    className="bg-transparent w-full text-lg font-medium outline-none"
                    value={m.name}
                    onChange={(e) => updateMemberName(m.id, e.target.value)}
                  />
                  <input
                    className="bg-transparent w-full text-sm text-slate-400 outline-none"
                    value={m.role}
                    onChange={(e) => updateMemberRole(m.id, e.target.value)}
                    placeholder="(role)"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="cursor-pointer text-xs px-2 py-1 rounded-md bg-white/5 text-slate-200">📷
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, m.id)} className="sr-only" />
                  </label>
                  <button onClick={() => removeMember(m.id)} className="text-xs px-2 py-1 rounded-md bg-white/5">Remove</button>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#2a1f3a] placeholder:text-slate-500 outline-none"
                placeholder="Add name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMember()}
              />
              <button onClick={addMember} className="px-4 py-2 rounded-md bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-black font-semibold">Add</button>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">Tip: Upload each member's photo. Removing a member replaces them with a placeholder — easy to re-add.</div>
        </section>

        {/* Message Wall */}
        <section className="md:col-span-2 bg-[#071025]/50 backdrop-blur rounded-2xl p-5 border border-[#2a1f3a] shadow-lg flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold">Message Wall</h2>
            <div className="text-sm text-slate-400">Saved locally to your browser</div>
          </div>

          <div className="mt-3 flex gap-3">
            <input
              placeholder="Write something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && postMessage()}
              className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#2a1f3a] outline-none"
            />
            <button onClick={postMessage} className="px-4 py-2 rounded-md bg-[#10b981]/90 font-semibold">Post</button>
            <button onClick={clearMessages} className="px-3 py-2 rounded-md bg-white/5">Clear</button>
          </div>

          <div className="mt-4 overflow-y-auto max-h-[40vh] space-y-3">
            {messages.length === 0 ? (
              <div className="text-slate-500">No messages yet — be the first to drop a line.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-gradient-to-r from-[#0b1320]/50 to-transparent border border-[#1f1630]">
                  <div className="text-sm text-slate-300">{new Date(msg.time).toLocaleString()}</div>
                  <div className="mt-1 text-lg">{msg.text}</div>
                </div>
              ))
            )}
          </div>

          <hr className="my-4 border-t border-[#1a1230]/40" />

          {/* Vibes section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Vibes / Quote</h3>
              <textarea
                className="mt-2 w-full min-h-[80px] rounded-md bg-transparent border border-[#2a1f3a] p-3 outline-none"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
              <div className="mt-2 text-xs text-slate-400">Edit your group quote — it saves automatically.</div>
            </div>

            <div>
              <h3 className="font-semibold">Theme Song (placeholder)</h3>
              <p className="text-sm text-slate-400">Upload or paste a link to your group theme song below (optional).</p>
              <div className="mt-2 flex gap-2">
                <input id="songUrl" placeholder="https://... or leave blank" className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#2a1f3a] outline-none" />
                <button onClick={() => {
                  const el = document.getElementById("songUrl");
                  const url = el?.value?.trim();
                  if (!url) return alert("Paste an audio URL or upload locally to serve it.");
                  const player = document.getElementById("audioPlayer");
                  player.src = url;
                  player.load();
                }} className="px-3 py-2 rounded-md bg-white/5">Load</button>
              </div>

              <audio id="audioPlayer" controls className="mt-4 w-full rounded-md bg-[#05020b]/60">
                <source src="" />
                Your browser does not support the audio element.
              </audio>

              <div className="mt-2 text-xs text-slate-500">Tip: For private hosting of audio, upload your file to the project and reference it. Vercel supports static assets in a public folder.</div>
            </div>
          </div>

        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-10 text-center text-sm text-slate-500">Made for <span className="text-white">The Vortex</span> • Dark neon theme</footer>
    </div>
  );
}
