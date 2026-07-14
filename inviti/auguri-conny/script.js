// ---------- fairy light garland ----------
(function drawGarland() {
    const wrap = document.getElementById("garland");
    if (!wrap) return;
    const w = window.innerWidth;
    const bulbCount = Math.max(10, Math.round(w / 55));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} 90`);
    svg.setAttribute("preserveAspectRatio", "none");

    // swag wire path (two sagging arcs)
    const path = document.createElementNS(svgNS, "path");
    const seg = w / 2;
    path.setAttribute(
        "d",
        `M0,10 Q${seg / 2},60 ${seg},18 Q${seg + seg / 2},60 ${w},10`
    );
    path.setAttribute("stroke", "rgba(232,184,75,.35)");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("fill", "none");
    svg.appendChild(path);

    const pathLen = path.getTotalLength();
    for (let i = 0; i < bulbCount; i++) {
        const pt = path.getPointAtLength((pathLen / (bulbCount - 1)) * i);
        const c = document.createElementNS(svgNS, "circle");
        c.setAttribute("cx", pt.x);
        c.setAttribute("cy", pt.y + 6);
        c.setAttribute("r", 4);
        c.setAttribute("class", "bulb");
        c.style.animationDelay = `${(i % 6) * 0.4}s`;
        svg.appendChild(c);
    }
    wrap.appendChild(svg);
})();

// ---------- screen navigation ----------
function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
}

// ---------- countdown to 17 luglio 2026, 19:00 ----------
function startCountdown() {
    const target = new Date("2026-07-17T19:00:00");

    const els = {
        h: document.getElementById("cd-hours"),
        m: document.getElementById("cd-mins"),
        s: document.getElementById("cd-secs"),
    };

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function tick() {
        const diff = target.getTime() - Date.now();

        if (diff <= 0) {
            els.h.textContent = "00";
            els.m.textContent = "00";
            els.s.textContent = "00";
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        els.h.textContent = pad(hours);
        els.m.textContent = pad(mins);
        els.s.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);
}

// ---------- envelope reveal ----------
function openEnvelope(el) {
    el.classList.add("open");
    el.style.pointerEvents = "none";
    setTimeout(() => showScreen("destination"), 550);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cd-hours")) {
        startCountdown();
    }
});