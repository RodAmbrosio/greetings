/* ===================== UTILITY: SCREENS ===================== */

function show(id) {
    document.querySelectorAll(".screen").forEach(x => x.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* ===================== BACKGROUND MUSIC ===================== */

const music = document.getElementById("music");
const audioStatus = document.getElementById("audioStatus");

function setAudioStatus(icon) {
    if (audioStatus) audioStatus.textContent = icon;
}

if (music) {
    music.volume = 0.4;

    // Helpful diagnostics: if the mp3 file is missing / misnamed / wrong path,
    // this fires instead of failing silently.
    music.addEventListener("error", () => {
        console.error("Audio: impossibile caricare il file. Controlla che 'audio/ocean-song.mp3' esista con lo stesso nome/maiuscole nel repository.");
        setAudioStatus("🔇");
    });

    music.addEventListener("playing", () => setAudioStatus("🔊"));
    music.addEventListener("pause", () => setAudioStatus("🔈"));
}

function startAdventure() {
    // if (music) {
    //     music.play()
    //         .then(() => setAudioStatus("🔊"))
    //         .catch(error => {
    //             console.log("Audio bloccato dal browser:", error);
    //             setAudioStatus("🔇");
    //         });
    // }
    show("message");
}

/* ===================== TINY SYNTH SOUND EFFECTS ===================== */
/* No external files needed - these are generated in the browser. They also
   double as an audio sanity-check: if you don't hear these, it's a device/
   volume/mute issue rather than a missing mp3 file. */

let sfxCtx = null;
function getSfxCtx() {
    if (!sfxCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        sfxCtx = new AC();
    }
    if (sfxCtx.state === "suspended") sfxCtx.resume();
    return sfxCtx;
}

function playTone(freq, duration = 0.18, type = "sine", startDelay = 0, gain = 0.18) {
    try {
        const ctx = getSfxCtx();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.value = gain;
        osc.connect(g).connect(ctx.destination);
        const t0 = ctx.currentTime + startDelay;
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        osc.start(t0);
        osc.stop(t0 + duration + 0.02);
    } catch (e) {
        console.log("SFX non disponibile:", e);
    }
}

function playCatchSound() {
    playTone(660, 0.12, "triangle");
    playTone(880, 0.14, "triangle", 0.08);
}

function playWinChime() {
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.35, "sine", i * 0.12, 0.15));
}

function playBlowChime() {
    [392, 494, 587, 784].forEach((f, i) => playTone(f, 0.3, "triangle", i * 0.09, 0.16));
}

/* ===================== FISHING GAME ===================== */

let found = 0;
let fishTarget = 0;

// Single artwork (images/fish-yellow.png) recoloured with CSS filters so every
// fish looks different. Drop real per-colour PNGs into /images later and swap
// the "img" values below (then you can delete the matching .color-* filter).
const FISH_CONFIG = [
    { color: "orange", img: "images/fish-yellow.png" },
    { color: "yellow", img: "images/fish-yellow.png" },
    { color: "pink", img: "images/fish-yellow.png" },
    { color: "green", img: "images/fish-yellow.png" },
    { color: "purple", img: "images/fish-yellow.png" }
];

function playGame() {
    show("game");
    found = 0;
    document.getElementById("counter").innerHTML = "Pesci trovati: 0/5";

    const fishArea = document.getElementById("fishArea");
    fishArea.innerHTML = "";

    FISH_CONFIG.forEach(cfg => {
        const fishEl = document.createElement("div");
        fishEl.className = "fish";
        fishEl.innerHTML = `<img src="${cfg.img}" class="color-${cfg.color}" alt="pesciolino ${cfg.color}">`;

        fishEl.onclick = function (e) {
            if (this.dataset.clicked) return;
            this.dataset.clicked = "true";

            playCatchSound();
            spawnSparkle(this, e);

            this.classList.add("caught");

            // Rimuove il pesce appena finisce l'animazione
            this.addEventListener("animationend", () => {
                this.remove();
            }, { once: true });

            found++;

            document.getElementById("counter").innerHTML =
                "Pesci trovati: " + found + "/5";

            if (found === 5) {
                playWinChime();
                setTimeout(() => show("cake"), 500);
            }
        };

        fishArea.appendChild(fishEl);
    });
}

function spawnSparkle(fishEl, evt) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = "✨";
    sparkle.style.left = (fishEl.offsetLeft + 30) + "px";
    sparkle.style.top = (fishEl.offsetTop + 10) + "px";
    fishEl.parentElement.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
}

/* ===================== CANDLES: TAP *OR* BLOW ===================== */

let micStream = null;
let micAnalyser = null;
let micRafId = null;
let candlesOut = false;

// function blowCandles() {
//     if (candlesOut) return;
//     candlesOut = true;
//     stopBreathDetection();
//     playBlowChime();
//     show("final");
//     // confetti();
// }

function blowCandles() {
    if (candlesOut) return;

    candlesOut = true;

    stopBreathDetection();

    playBlowChime();

    show("final");

    playFinalMusic();
}

function playFinalMusic() {

    if (!music) return;

    music.currentTime = 0;

    music.play().catch(() => { });

}

function toggleFinalMusic() {

    if (!music) return;

    const btn =
        document.getElementById("musicButton");

    if (music.paused) {

        music.play();

        btn.innerHTML =
            "🔊 Disattiva musica";

    }

    else {

        music.pause();

        btn.innerHTML =
            "🔇 Attiva musica";

    }

}
function toggleFinalMusic() {

    if (music.paused) {

        music.play();

        musicButton.innerHTML = "🔊";

    } else {

        music.pause();

        musicButton.innerHTML = "🔇";

    }

}

async function toggleMic() {
    const micBtn = document.getElementById("micBtn");
    const micLevelWrap = document.getElementById("micLevelWrap");

    if (micStream) {
        stopBreathDetection();
        return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Il microfono non è supportato su questo browser. Usa il tocco sulle candeline! 🕯️");
        return;
    }

    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = getSfxCtx();
        const source = ctx.createMediaStreamSource(micStream);
        micAnalyser = ctx.createAnalyser();
        micAnalyser.fftSize = 512;
        source.connect(micAnalyser);

        micBtn.classList.add("listening");
        micBtn.textContent = "🎤 Sto ascoltando... soffia!";
        micLevelWrap.classList.add("show");

        const data = new Uint8Array(micAnalyser.frequencyBinCount);
        const levelFill = document.getElementById("micLevelFill");

        let sustainedFrames = 0;
        const THRESHOLD = 42;       // volume level considered "a blow"
        const FRAMES_NEEDED = 5;    // must sustain for a few frames to avoid false positives

        function loop() {
            micAnalyser.getByteFrequencyData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length;

            if (levelFill) levelFill.style.width = Math.min(100, (avg / 80) * 100) + "%";

            if (avg > THRESHOLD) {
                sustainedFrames++;
                if (sustainedFrames >= FRAMES_NEEDED) {
                    blowCandles();
                    return;
                }
            } else {
                sustainedFrames = 0;
            }

            micRafId = requestAnimationFrame(loop);
        }
        loop();
    } catch (err) {
        console.log("Microfono non disponibile:", err);
        alert("Non riesco ad accedere al microfono. Puoi comunque toccare le candeline! 🕯️");
    }
}

function stopBreathDetection() {
    if (micRafId) cancelAnimationFrame(micRafId);
    micRafId = null;
    if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
    }
    const micBtn = document.getElementById("micBtn");
    const micLevelWrap = document.getElementById("micLevelWrap");
    if (micBtn) {
        micBtn.classList.remove("listening");
        micBtn.textContent = "🎤 Soffia con il microfono";
    }
    if (micLevelWrap) micLevelWrap.classList.remove("show");
}

/* ===================== CONFETTI ===================== */

function confetti() {
    const pieces = ["🎉", "🎈", "⭐", "🎊", "🐠"];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement("div");
        c.textContent = pieces[Math.floor(Math.random() * pieces.length)];
        c.style.position = "fixed";
        c.style.left = Math.random() * 100 + "%";
        c.style.top = "-40px";
        c.style.fontSize = (22 + Math.random() * 20) + "px";
        c.style.animation = `fall ${2.4 + Math.random() * 1.6}s linear`;
        c.style.pointerEvents = "none";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4200);
    }
}

/* ===================== BUBBLES (ambient) ===================== */

function spawnBubbles() {
    const wrap = document.querySelector(".bubbles");
    if (!wrap) return;
    setInterval(() => {
        const b = document.createElement("span");
        b.textContent = "🫧";
        b.style.left = Math.random() * 100 + "%";
        b.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
        b.style.animationDuration = (5 + Math.random() * 5) + "s";
        b.style.fontSize = (16 + Math.random() * 24) + "px";
        wrap.appendChild(b);
        setTimeout(() => b.remove(), 11000);
    }, 700);
}

/* ===================== SHARE / QR CODE ===================== */

let qrRendered = false;

function openShare() {
    show("share");
    const link = window.location.href;
    document.getElementById("shareLink").textContent = link;

    if (!qrRendered && window.QRCode) {
        new QRCode(document.getElementById("qrcode"), {
            text: link,
            width: 200,
            height: 200,
            colorDark: "#004d80",
            colorLight: "#ffffff"
        });
        qrRendered = true;
    }
}

function copyShareLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            const btn = document.getElementById("copyBtn");
            const original = btn.textContent;
            btn.textContent = "✅ Copiato!";
            setTimeout(() => (btn.textContent = original), 1500);
        })
        .catch(() => alert("Copia il link dalla barra degli indirizzi 🙂"));
}

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
    spawnBubbles();
});
