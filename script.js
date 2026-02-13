// BeMyValentine - Version 1.1 (Cheems Edition)

console.log('BeMyValentine V1.1 - Cheems Mode 🐶');

// State & Config
const state = {
    params: new URLSearchParams(window.location.search),
    userData: null
};

// Cheems/Doge GIF Collection
const gifs = {
    // Please / Begging
    please: "https://media1.tenor.com/m/m1m2N4j4qH4AAAAd/cheems-doge.gif", // Sad Cheems looking down
    please2: "https://media1.tenor.com/m/Z4080sY3tXUAAAAd/doge-dog.gif", // Pleading Doge

    // Crying / Sad
    crying: "https://media1.tenor.com/m/Q8yq3O1btm0AAAAd/doge-crying-doge.gif", // Crying Doge
    cryingHard: "https://media1.tenor.com/m/3bKK7XQkPz0AAAAd/doge-sad.gif", // Very sad Cheems

    // Happy / Celebration
    celebration: "https://media1.tenor.com/m/t11-B53v0eIAAAAd/cheems-doge.gif", // Dancing/Happy Cheems
    celebrationReal: "https://media1.tenor.com/m/63g5adPTk30AAAAd/doge-dance.gif" // Dancing Doge
};

// Elements
const app = document.getElementById('app');
const overlay = document.getElementById('overlay');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const privacyModal = document.getElementById('privacyModal');

// Audio Logic (Updated Source)
// Direct GitHub raw link can be more reliable than Pixabay for some browsers, 
// but Pixabay should work if not hotlink blocked. switching to a generic reliable file.
// Or we can try to use a base64 or a local file if this fails, but for now let's try a different URL.
const AUDIO_URL = "https://raw.githubusercontent.com/sanidhyy/valentine-proposal/main/assets/music.mp3"; // Example placeholder, revert to working if needed.
// Actually, let's use a known reliable CDN for "Romantic music" or keep the existing one if it was just an overlay issue. 
// User said "sound is not working too". 
// Let's try this one:
bgMusic.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Test URL
// Better one for Valentine:
bgMusic.src = "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3"; // Soft piano

let isMusicPlaying = false;

overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('d-none');
        app.classList.remove('d-none');
        init();
    }, 500);

    // Force Play
    bgMusic.volume = 0.5;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '🔊';
        }).catch(error => {
            console.log("Audio play failed:", error);
            musicToggle.innerHTML = '🔇';
        });
    }
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

// Privacy Modal
document.getElementById('privacyLink').addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.classList.remove('d-none');
});
document.getElementById('closeModalBtn').addEventListener('click', () => {
    privacyModal.classList.add('d-none');
});

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

function setupWizard() {
    // MDB Input Init
    document.querySelectorAll('.form-outline').forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    let currentStep = 1;

    function showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.classList.add('d-none');
            el.classList.remove('active-step');
        });
        const active = document.querySelector(`.wizard-step[data-step="${step}"]`);
        active.classList.remove('d-none');
        active.classList.add('active-step');
    }

    function handleNext() {
        if (currentStep === 1 && !document.getElementById('senderName').value.trim()) return alert("Enter your name (Cheems is watching!) 🐶");
        if (currentStep === 2 && !document.getElementById('recipientName').value.trim()) return alert("Who is the lucky one? 🥺");

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

    // Random Cheems Welcome
    const img = screen.querySelector('img');
    img.src = "https://media1.tenor.com/m/Z4080sY3tXUAAAAd/doge-dog.gif"; // Shy Doge

    document.getElementById('greetingText').textContent = `Hi ${data.to} 💕`;

    setTimeout(() => {
        document.getElementById('clickHint').classList.remove('d-none');
        document.body.addEventListener('click', startBuildUp, { once: true });
    }, 2000);
}

function startBuildUp() {
    document.getElementById('greetingScreen').classList.add('d-none');
    document.getElementById('buildScreen').classList.remove('d-none');

    setTimeout(() => document.getElementById('buildMsg1').classList.remove('d-none'), 500);
    setTimeout(() => document.getElementById('buildMsg2').classList.remove('d-none'), 2500);
    setTimeout(() => {
        document.getElementById('buildHint').classList.remove('d-none');
        document.body.addEventListener('click', startChat, { once: true });
    }, 4500);
}

function startChat() {
    document.getElementById('buildScreen').classList.add('d-none');
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

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;

        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 150;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;

        // Show Cheems based on anger level
        gifContainer.classList.remove('d-none');
        gifContainer.classList.add('d-flex');

        let gifUrl = gifs.please;
        if (clickCount > 2) gifUrl = gifs.please2;
        if (clickCount > 4) gifUrl = gifs.crying;
        if (clickCount > 7) gifUrl = gifs.cryingHard;

        gifContainer.innerHTML = `<img src="${gifUrl}" class="rounded shadow-4-strong" style="width: 200px; height: 200px; object-fit: cover;">
            <p class="mt-2 fw-bold text-danger fade-in-scale">${getNoText(clickCount)}</p>`;

        // Scale Buttons
        const yesScale = 1 + (clickCount * 0.3);
        yesBtn.style.transform = `scale(${Math.min(yesScale, 4)})`;
        yesBtn.style.zIndex = 100;

        if (clickCount > 4) {
            const noScale = Math.max(0.1, 1 - (clickCount * 0.1));
            noBtn.style.transform += ` scale(${noScale})`;
        }
    });

    yesBtn.addEventListener('click', startCelebration);
}

function getNoText(count) {
    const texts = [
        "Pls? 🥺", "Am chimken? 🍗", "Much sad... 🐕", "Wow. Very heartbreak. 💔",
        "Such mean. 😭", "I call police 🚓", "Why u do dis? 🥺", "Cheems cri... 🌊"
    ];
    return texts[Math.min(count - 1, texts.length - 1)];
}

function startCelebration() {
    document.getElementById('questionScreen').classList.add('d-none');
    document.getElementById('yesScreen').classList.remove('d-none');

    document.getElementById('celebrationGif').src = gifs.celebrationReal;

    const gender = state.userData.gender;
    const name = state.userData.to; // CHANGED: Now shows recipient's name ("From" logic swapped per user request)
    // Wait, user asked: "she said yes from should be her name.. not the creators name"
    // "She said YES" is the title.
    // "From [Name]" is the signature.
    // If they want "From [Her Name]", then we use `state.userData.to`.
    // But usually "From" implies the sender.
    // Let's assume the user wants the signature to be the Recipient, or maybe the "She said Yes" refers to the recipient?
    // Let's just output: "With Love, [Recipient]"?
    // User said: "from should be her name.. not the creators name"
    // Okay, I will set the subtext to be the Recipient's name.

    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = ` - ${name} ❤️`; // The Recipient's Name

    startConfetti();

    document.getElementById('shareAnswerBtn').addEventListener('click', () => {
        const text = `I said YES to ${state.userData.from}! 💖`;
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Cheems Valentine', text: text, url: url });
        } else {
            alert('Link copied! 💌');
            navigator.clipboard.writeText(`${text}\n${url}`);
        }
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
