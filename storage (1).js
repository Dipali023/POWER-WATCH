// Shared data layer for PowerWatch
// All outage records are stored in localStorage under the key "pw_outages"

function pwGetOutages() {
  return JSON.parse(localStorage.getItem("pw_outages")) || [];
}

function pwSaveOutages(outages) {
  localStorage.setItem("pw_outages", JSON.stringify(outages));
}

function pwAddOutage(area, note) {
  const outages = pwGetOutages();
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    area: area,
    note: note,
    startTime: new Date().toISOString(),
    endTime: null,
    status: "ongoing",
  };
  outages.push(record);
  pwSaveOutages(outages);
  return record;
}

function pwResolveOutage(id) {
  const outages = pwGetOutages();
  const record = outages.find((o) => o.id === id);
  if (record && record.status === "ongoing") {
    record.endTime = new Date().toISOString();
    record.status = "resolved";
    pwSaveOutages(outages);
  }
}

function pwFormatDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return minutes + "m";
  return hours + "h " + minutes + "m";
}

function pwFormatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pwEscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Highlights the current page in the nav bar based on the file name
function pwSetActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("active");
    }
  });
}
document.addEventListener("DOMContentLoaded", pwSetActiveNav);
