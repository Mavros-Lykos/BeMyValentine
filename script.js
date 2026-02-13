// BeMyValentine - Version 1.4 (Fixed Floating Texts)

console.log('BeMyValentine V1.4 - Visibility Fix 💖');

// State & Config
const state = {
    params: new URLSearchParams(window.location.search),
    userData: null
};

// GIF Collection
const gifs = {
    please: "https://media1.tenor.com/m/m1m2N4j4qH4AAAAd/cheems-doge.gif",
    please2: "https://media1.tenor.com/m/Z4080sY3tXUAAAAd/doge-dog.gif",
    crying: "https://media1.tenor.com/m/Q8yq3O1btm0AAAAd/doge-crying-doge.gif",
    cryingHard: "https://media1.tenor.com/m/3bKK7XQkPz0AAAAd/doge-sad.gif",
    celebration: "https://media1.tenor.com/m/t11-B53v0eIAAAAd/cheems-doge.gif",
    celebrationReal: "https://media1.tenor.com/m/63g5adPTk30AAAAd/doge-dance.gif"
};

// Elements
const app = document.getElementById('app');
const overlay = document.getElementById('overlay');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const privacyModal = document.getElementById('privacyModal');

// Audio Logic 
let isMusicPlaying = false;
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('d-none');
        app.classList.remove('d-none');
        init();
    }, 500);

    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.innerHTML = '🔊';
    }).catch(console.error);
});

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '🔇';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

document.getElementById('privacyLink').addEventListener('click', (e) => { e.preventDefault(); privacyModal.classList.remove('d-none'); });
document.getElementById('closeModalBtn').addEventListener('click', () => { privacyModal.classList.add('d-none'); });

/* ===========================
   LOGIC
   =========================== */

function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('to') && params.has('from')) {
        document.getElementById('customizationWizard').classList.add('d-none');
        state.userData = {
            to: params.get('to'),
            from: params.get('from'),
            gender: params.get('gender'),
            msg: params.get('msg')
        };
        startGreeting(state.userData);
    } else {
        document.getElementById('greetingScreen').classList.add('d-none');
        setupWizard();
    }
}

(function checkGenderForOverlay() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('to') && params.has('from') && params.has('gender')) {
        const gender = params.get('gender');
        const overlayText = document.getElementById('overlayText');
        if (gender === 'male') overlayText.innerHTML = "Hey Sir,<br>There is a mail for you... 📩";
        else overlayText.innerHTML = "Hey Ma'am,<br>There is a mail for you... 📩";
    }
})();

function setupWizard() {
    document.querySelectorAll('.form-outline').forEach((formOutline) => new mdb.Input(formOutline).init());
    let currentStep = 1;
    function showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => { el.classList.add('d-none'); el.classList.remove('active-step'); });
        const active = document.querySelector(`.wizard-step[data-step="${step}"]`);
        active.classList.remove('d-none'); active.classList.add('active-step');
    }
    function handleNext() {
        if (currentStep === 1 && !document.getElementById('senderName').value.trim()) return alert("Enter your name 🐶");
        if (currentStep === 2 && !document.getElementById('recipientName').value.trim()) return alert("Who is the lucky one? 🥺");
        if (currentStep < 4) { currentStep++; showStep(currentStep); }
    }
    document.querySelectorAll('.next-step-btn').forEach(btn => btn.addEventListener('click', handleNext));
    document.querySelectorAll('.prev-step-btn').forEach(btn => btn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; showStep(currentStep); } }));
    document.getElementById('generateBtn').addEventListener('click', () => {
        const sender = document.getElementById('senderName').value.trim();
        const recipient = document.getElementById('recipientName').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const message = document.getElementById('customMessage').value.trim();
        if (!sender || !recipient) return alert("Fill everything pls!");
        const url = new URL(window.location.href);
        url.searchParams.set('from', sender);
        url.searchParams.set('to', recipient);
        url.searchParams.set('gender', gender);
        url.searchParams.set('msg', message);
        window.location.href = url.toString();
    });
}

function startGreeting(data) {
    const screen = document.getElementById('greetingScreen');
    screen.classList.remove('d-none');
    document.getElementById('greetingText').textContent = `Hi ${data.to} 💕`;
    setTimeout(() => {
        document.getElementById('clickHint').classList.remove('d-none');
        document.body.addEventListener('click', startBuildUp1, { once: true });
    }, 2000);
}

function startBuildUp1() {
    document.getElementById('greetingScreen').classList.add('d-none');
    document.getElementById('buildScreen1').classList.remove('d-none');
    document.body.addEventListener('click', startBuildUp2, { once: true });
}

function startBuildUp2() {
    document.getElementById('buildScreen1').classList.add('d-none');
    document.getElementById('buildScreen2').classList.remove('d-none');
    document.body.addEventListener('click', startChat, { once: true });
}

function startChat() {
    document.getElementById('buildScreen2').classList.add('d-none');
    document.getElementById('chatScreen').classList.remove('d-none');
    const container = document.getElementById('chatContainer');
    const messages = [
        { text: "Hewwo... 🥺", side: "left" },
        { text: "Can I ask something?", side: "right" },
        { text: "It's impawtant...", side: "left" },
        { text: state.userData.msg || "You mean the world to me.", side: "right" },
        { text: "So...", side: "left" }
    ];
    let delay = 300;
    messages.forEach((msg, i) => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.classList.add('chat-bubble', msg.side === 'left' ? 'bubble-left' : 'bubble-right');
            bubble.innerText = msg.text;
            container.appendChild(bubble);
            container.scrollTop = container.scrollHeight;
            if (i === messages.length - 1) {
                setTimeout(() => {
                    document.getElementById('chatHint').classList.remove('d-none');
                    document.body.addEventListener('click', startQuestion, { once: true });
                }, 800);
            }
        }, delay);
        delay += 1500;
    });
}

function startQuestion() {
    document.getElementById('chatScreen').classList.add('d-none');
    document.getElementById('questionScreen').classList.remove('d-none');

    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const gifContainer = document.getElementById('pleaseGifContainer');
    let clickCount = 0;

    gifContainer.innerHTML = `<img src="${gifs.please}" id="reactionGif" class="rounded shadow-4-strong d-none" style="width: 200px; height: 200px; object-fit: cover; transition: all 0.5s ease;">`;
    const reactionGif = document.getElementById('reactionGif');

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;

        // 1. Move Button
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const x = (Math.random() - 0.5) * (windowWidth * 0.6);
        const y = (Math.random() - 0.5) * (windowHeight * 0.6);
        noBtn.style.transform = `translate(${x}px, ${y}px)`;

        // 2. GIF Logic
        gifContainer.classList.remove('d-none');
        gifContainer.classList.add('d-flex');
        reactionGif.classList.remove('d-none');

        let gifUrl = gifs.please;
        if (clickCount > 2) gifUrl = gifs.please2;
        if (clickCount > 5) gifUrl = gifs.crying;
        if (clickCount > 8) gifUrl = gifs.cryingHard;
        reactionGif.src = gifUrl;

        const scale = 1 + (clickCount * 0.2);
        reactionGif.style.transform = `scale(${scale})`;

        // 3. SPAWN FLOATING TEXT (The Crucial Part)
        const text = getNoText(clickCount);
        console.log("Spawning text:", text); // Debug
        spawnFloatingText(text);

        // 4. Yes Button Grow
        const yesScale = 1 + (clickCount * 0.4);
        yesBtn.style.transform = `scale(${Math.min(yesScale, 5)})`;
        yesBtn.style.zIndex = 1000;

        // 5. No Button Shrink
        if (clickCount > 3) {
            const noScale = Math.max(0.1, 1 - (clickCount * 0.1));
            noBtn.style.transform += ` scale(${noScale})`;
        }
    });

    yesBtn.addEventListener('click', startCelebration);
}

function spawnFloatingText(text) {
    const el = document.createElement('div');
    el.innerText = text;
    el.className = 'pop-text'; // Use standard prop

    // Random Position on Screen
    // Ensure it doesn't spawn off-screen
    const x = Math.random() * (window.innerWidth - 200); // Subtract roughly width of box
    const y = Math.random() * (window.innerHeight - 100);

    el.style.left = `${Math.max(20, x)}px`;
    el.style.top = `${Math.max(20, y)}px`;

    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 3000); // Match CSS animation duration
}

function getNoText(count) {
    const texts = [
        "Please 🥺",
        "Are you sure? 💔",
        "Think carefully… 🤔",
        "This is a limited-time offer. ⏳",
        "Non-refundable emotional investment. 📉",
        "I already practiced telling my mom 😭",
        "But we'd look so cute together! 🧸",
        "Don't break my heart! 💔",
        "I'm actually crying now... 🌊"
    ];
    return texts[Math.floor(Math.random() * texts.length)];
}

function startCelebration() {
    document.getElementById('questionScreen').classList.add('d-none');
    document.getElementById('yesScreen').classList.remove('d-none');
    document.getElementById('celebrationGif').src = gifs.celebrationReal;

    const gender = state.userData.gender;
    const name = state.userData.to;
    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = ` - ${name} ❤️`;

    startConfetti();
    document.querySelectorAll('.pop-text').forEach(el => el.remove());

    document.getElementById('shareAnswerBtn').addEventListener('click', () => {
        const text = `I said YES to ${state.userData.from}! 💖`;
        const url = window.location.href;
        if (navigator.share) navigator.share({ title: 'Valentine', text: text, url: url });
        else { alert('Link copied! 💌'); navigator.clipboard.writeText(`${text}\n${url}`); }
    });
}

function startConfetti() {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const duration = 15 * 1000;
    const end = Date.now() + duration;
    (function frame() {
        const left = end - Date.now();
        if (left <= 0) return;
        confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        requestAnimationFrame(frame);
    }());
}
