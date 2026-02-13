// BeMyValentine - Version 1.0 (Playful & Lively)

console.log('BeMyValentine V1.0 - Playful Mode 💖');

// State & Config
const state = {
    params: new URLSearchParams(window.location.search),
    userData: null
};

// GIF Collection (Cute & Funny)
const gifs = {
    please: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveGJ5bTh5bTh5bTh5bTh5bTh5bTh5bTh5/L95W4wv8nimb9E6F/giphy.gif", // Puss in Boots eyes
    crying: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBkZDV4Znd6am16eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5/OPU6wzx8JrHna/giphy.gif", // Crying Cat
    cryingHard: "https://media.giphy.com/media/26ufcVAp3AiJJsrIs/giphy.gif", // Crying cartoon
    celebration: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveGJ5bTh5bTh5bTh5bTh5bTh5bTh5bTh5/L95W4wv8nimb9E6F/giphy.gif", // Happy Cat (Placeholder, same as please for now if url invalid, but let's change)
    celebrationReal: "https://media.giphy.com/media/TdfyKrN7HGTIY/giphy.gif" // Dancing Cat
};

// Elements
const app = document.getElementById('app');
const overlay = document.getElementById('overlay');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const privacyModal = document.getElementById('privacyModal');

// Audio Logic & Overlay Unlock
let isMusicPlaying = false;

overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('d-none');
        app.classList.remove('d-none');
        init(); // Start logic after unlock
    }, 500);

    // Play Music
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.innerHTML = '🔊';
    }).catch(console.error);
});

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '🎵';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Privacy Modal
document.getElementById('privacyLink').addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.classList.remove('d-none');
});
document.getElementById('closeModalBtn').addEventListener('click', () => {
    privacyModal.classList.add('d-none');
});

/* ===========================
   STATE MACHINARY
   =========================== */

function init() {
    const params = state.params;
    if (params.has('to') && params.has('from')) {
        // Mode: Recipient
        document.getElementById('customizationWizard').classList.add('d-none');
        state.userData = {
            to: params.get('to'),
            from: params.get('from'),
            gender: params.get('gender'),
            msg: params.get('msg')
        };
        startGreeting(state.userData);
    } else {
        // Mode: Creator
        document.getElementById('greetingScreen').classList.add('d-none');
        setupWizard();
    }
}

/* ===========================
   CREATOR MODE (Wizard)
   =========================== */
function setupWizard() {
    document.querySelectorAll('.form-outline').forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    let currentStep = 1;

    function showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.classList.add('d-none');
            el.classList.remove('active-step');
        });
        const activeStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
        activeStep.classList.remove('d-none');
        activeStep.classList.add('active-step');

        const input = activeStep.querySelector('input, textarea');
        if (input) setTimeout(() => input.focus(), 100);
    }

    function handleNext() {
        if (currentStep === 1 && !document.getElementById('senderName').value.trim()) return alert("Name please! 🥺");
        if (currentStep === 2 && !document.getElementById('recipientName').value.trim()) return alert("Their name please! 💖");

        if (currentStep < 4) {
            currentStep++;
            showStep(currentStep);
        }
    }

    document.querySelectorAll('.next-step-btn').forEach(btn => btn.addEventListener('click', handleNext));
    document.querySelectorAll('.prev-step-btn').forEach(btn => btn.addEventListener('click', () => {
        if (currentStep > 1) { currentStep--; showStep(currentStep); }
    }));

    document.getElementById('generateBtn').addEventListener('click', () => {
        const sender = document.getElementById('senderName').value.trim();
        const recipient = document.getElementById('recipientName').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const message = document.getElementById('customMessage').value.trim();

        if (!sender || !recipient) return alert("Missing details!");

        const url = new URL(window.location.href);
        url.searchParams.set('from', sender);
        url.searchParams.set('to', recipient);
        url.searchParams.set('gender', gender);
        url.searchParams.set('msg', message);
        window.location.href = url.toString();
    });
}

/* ===========================
   RECIPIENT MODE (The Flow)
   =========================== */

// 1. Greeting
function startGreeting(data) {
    const screen = document.getElementById('greetingScreen');
    screen.classList.remove('d-none');
    document.getElementById('greetingText').textContent = `Hi ${data.to} 💕`;

    // Strict 2.5s Delay
    setTimeout(() => {
        document.getElementById('clickHint').classList.remove('d-none');
        document.body.addEventListener('click', startBuildUp, { once: true });
    }, 2500);
}

// 2. Emotional Build
function startBuildUp() {
    document.getElementById('greetingScreen').classList.add('d-none');
    const screen = document.getElementById('buildScreen');
    screen.classList.remove('d-none');

    setTimeout(() => document.getElementById('buildMsg1').classList.remove('d-none'), 500);
    setTimeout(() => document.getElementById('buildMsg2').classList.remove('d-none'), 2500);

    setTimeout(() => {
        document.getElementById('buildHint').classList.remove('d-none');
        document.body.addEventListener('click', startChat, { once: true });
    }, 4500);
}

// 3. Chat Stack
function startChat() {
    document.getElementById('buildScreen').classList.add('d-none');
    const screen = document.getElementById('chatScreen');
    screen.classList.remove('d-none');
    const container = document.getElementById('chatContainer');

    const messages = [
        { text: "You know something? 🥺", side: "left" },
        { text: "You make my days brighter.", side: "right" },
        { text: "I smile more because of you.", side: "left" },
        { text: state.userData.msg || "You are special to me.", side: "right" },
        { text: "So I was thinking…", side: "left" }
    ];

    let delay = 500;
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
                }, 1000);
            }
        }, delay);
        delay += 2000; // Strict 2s delay
    });
}

// 4. The Question (Evil No Button)
function startQuestion() {
    document.getElementById('chatScreen').classList.add('d-none');
    const screen = document.getElementById('questionScreen');
    screen.classList.remove('d-none');

    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const gifContainer = document.getElementById('pleaseGifContainer');

    let clickCount = 0;

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop global click
        clickCount++;

        // Logic per V1 Spec
        // Click 1: Shift
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 100;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;

        // Click 2: Please GIF
        if (clickCount >= 1) {
            gifContainer.classList.remove('d-none');
            gifContainer.classList.add('d-flex');

            // Swap GIF based on intensity
            let gifUrl = gifs.please;
            if (clickCount > 3) gifUrl = gifs.crying;
            if (clickCount > 6) gifUrl = gifs.cryingHard;

            gifContainer.innerHTML = `<img src="${gifUrl}" class="rounded shadow-4-strong" style="width: 200px; height: 200px; object-fit: cover;">
                <p class="mt-2 fw-bold text-danger fade-in-scale">${getNoText(clickCount)}</p>`;
        }

        // Click 3+: GIF Grows
        if (clickCount >= 3) {
            const scale = 1 + (clickCount * 0.1);
            const img = gifContainer.querySelector('img');
            if (img) img.style.transform = `scale(${Math.min(scale, 1.5)})`;
        }

        // Button Shrinks
        if (clickCount > 3) {
            const btnScale = Math.max(0.1, 1 - (clickCount * 0.15));
            noBtn.style.transform += ` scale(${btnScale})`;
        }

        // Yes Button Grows "Overwhelmingly"
        const yesScale = 1 + (clickCount * 0.2);
        yesBtn.style.transform = `scale(${Math.min(yesScale, 3)})`;
        yesBtn.style.zIndex = 100;

        // Final State check
        if (clickCount > 10) {
            noBtn.remove(); // Just delete it if they are being mean!
        }
    });

    yesBtn.addEventListener('click', startCelebration);
}

function getNoText(count) {
    const texts = [
        "Please? 🥺",
        "Pretty please? 🥺",
        "Don't do get mean! 😭",
        "I'm gonna cry...",
        "You're breaking my heart 💔",
        "Limited time offer! ⏳",
        "Last chance! ⚠️",
        "Okay I'm actually crying 🌊",
        "Why are you like this? 💀"
    ];
    return texts[Math.min(count - 1, texts.length - 1)];
}

// 5. Celebration
function startCelebration() {
    document.getElementById('questionScreen').classList.add('d-none');
    document.getElementById('yesScreen').classList.remove('d-none');

    document.getElementById('celebrationGif').src = gifs.celebrationReal;

    const gender = state.userData.gender;
    const from = state.userData.from;
    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = `From ${from} ❤️`;

    startConfetti();

    // Share logic
    document.getElementById('shareAnswerBtn').addEventListener('click', () => {
        const text = `I said YES! 💖\nLook what ${from} asked me!`;
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Be My Valentine?', text: text, url: url });
        } else {
            alert('URL copied! Send it! 💌');
            navigator.clipboard.writeText(`${text}\n${url}`);
        }
    });
}

function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}
