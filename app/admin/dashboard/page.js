"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TABS = ["Site Content", "Skills", "Experience", "Projects"];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState(TABS[0]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="dash">
      <div className="dash-nav">
        <div className="brand mono">dev<span style={{ color: "var(--teal)" }}>.</span>folio — admin</div>
        <button className="icon-btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="dash-tabs">
        {TABS.map((t) => (
          <div key={t} className={`dash-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </div>
        ))}
      </div>

      <div className="dash-body">
        {tab === "Site Content" && <SiteContentTab />}
        {tab === "Skills" && <ListTab kind="skills" fields={["name", "category"]} empty={{ name: "", category: "" }} />}
        {tab === "Experience" && (
          <ListTab
            kind="experience"
            fields={["role", "company", "startDate", "endDate", "description"]}
            empty={{ role: "", company: "", startDate: "", endDate: "Present", description: "" }}
          />
        )}
        {tab === "Projects" && (
          <ListTab
            kind="projects"
            fields={["title", "description", "image", "liveUrl", "repoUrl", "tags"]}
            empty={{ title: "", description: "", image: "", liveUrl: "", repoUrl: "", tags: "" }}
            tagsField="tags"
          />
        )}
      </div>
    </div>
  );
}

function SiteContentTab() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p className="hero-sub">Loading...</p>;

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSavedMsg(res.ok ? "Saved." : "Could not save.");
  }

  const textFields = [
    ["name", "Full name"],
    ["role", "Role / title"],
    ["heroHeadline", "Hero headline"],
    ["heroSubtext", "Hero subtext"],
    ["photoUrl", "Photo URL"],
    ["cvUrl", "CV / résumé URL (PDF)"],
    ["email", "Contact email"],
    ["githubUrl", "GitHub URL"],
    ["linkedinUrl", "LinkedIn URL"],
  ];

  return (
    <div className="dash-card">
      <div className="dash-grid">
        {textFields.map(([key, label]) => (
          <div className="dash-field" key={key}>
            <label>{label.toUpperCase()}</label>
            {key === "heroSubtext" ? (
              <textarea rows={3} value={data[key] || ""} onChange={(e) => update(key, e.target.value)} />
            ) : (
              <input value={data[key] || ""} onChange={(e) => update(key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <div className="dash-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          style={{ width: "auto" }}
          checked={!!data.availableForWork}
          onChange={(e) => update("availableForWork", e.target.checked)}
        />
        <label style={{ marginBottom: 0 }}>Show "available for work" badge on the hero</label>
      </div>

      <button className="btn btn-primary" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </button>
      {savedMsg && <p className="hero-sub" style={{ marginTop: 10 }}>{savedMsg}</p>}
    </div>
  );
}

function ListTab({ kind, fields, empty, tagsField }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/${kind}`);
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [kind]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(item) {
    setEditingId(item._id);
    const next = { ...item };
    if (tagsField && Array.isArray(next[tagsField])) next[tagsField] = next[tagsField].join(", ");
    setForm(next);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (tagsField) {
      payload[tagsField] = (payload[tagsField] || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const url = editingId ? `/api/${kind}/${editingId}` : `/api/${kind}`;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    cancelEdit();
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="dash-card">
        <h3 className="mono" style={{ marginBottom: 16, fontSize: 14, color: "var(--teal)" }}>
          {editingId ? "Edit entry" : "Add new entry"}
        </h3>
        <form onSubmit={submit}>
          <div className="dash-grid">
            {fields.map((f) => (
              <div className="dash-field" key={f} style={f === "description" ? { gridColumn: "1 / -1" } : {}}>
                <label>{f === "tags" ? "TAGS (comma separated)" : f.toUpperCase()}</label>
                {f === "description" ? (
                  <textarea rows={3} value={form[f] || ""} onChange={(e) => update(f, e.target.value)} required />
                ) : (
                  <input value={form[f] || ""} onChange={(e) => update(f, e.target.value)} required={f !== "image" && f !== "liveUrl" && f !== "repoUrl" && f !== "tags"} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn btn-primary">{editingId ? "Save changes" : "Add"}</button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 className="mono" style={{ marginBottom: 4, fontSize: 14, color: "var(--slate)" }}>
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </h3>
        {loading && <p className="hero-sub">Loading...</p>}
        {!loading && items.length === 0 && <p className="hero-sub">Nothing here yet.</p>}
        {items.map((item) => (
          <div className="dash-list-item" key={item._id}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.title || item.name || item.role}</div>
              <div className="hero-sub" style={{ fontSize: 12, marginTop: 2 }}>
                {item.company || item.category || item.description?.slice(0, 60)}
              </div>
            </div>
            <div className="dash-actions">
              <button className="icon-btn" onClick={() => startEdit(item)}>Edit</button>
              <button className="icon-btn danger" onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
