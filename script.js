// BeMyValentine V2 Core Logic

console.log('BeMyValentine V2 Initialized 💖');

// Core Elements
const app = document.getElementById('app');
const mainContainer = document.getElementById('mainContainer');
const wizardContainer = document.getElementById('customizationWizard');
const greetingScreen = document.getElementById('greetingScreen');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const privacyModal = document.getElementById('privacyModal');

// State Management
const state = {
    currentScreen: 'init',
    params: new URLSearchParams(window.location.search),
    userData: null
};

// Audio Handling
let isMusicPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '🎵';
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed", e));
        musicToggle.innerHTML = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Privacy Modal Logic
document.getElementById('privacyLink').addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.classList.remove('hidden');
    privacyModal.style.display = 'flex';
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
    privacyModal.classList.add('hidden');
    privacyModal.style.display = 'none';
});

// Wizard Logic
function setupWizard() {
    let currentStep = 1;
    const totalSteps = 4;

    function showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });
        const activeStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
        activeStep.classList.remove('hidden');
        setTimeout(() => activeStep.classList.add('active'), 10);
    }

    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 1 && !document.getElementById('senderName').value.trim()) return alert("Please enter your name! 🥺");
            if (currentStep === 2 && !document.getElementById('recipientName').value.trim()) return alert("Please enter their name! 💖");

            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
        const sender = document.getElementById('senderName').value;
        const recipient = document.getElementById('recipientName').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const message = document.getElementById('customMessage').value;

        const url = new URL(window.location.href);
        url.searchParams.set('from', sender);
        url.searchParams.set('to', recipient);
        url.searchParams.set('gender', gender);
        url.searchParams.set('msg', message);

        window.location.href = url.toString();
    });
}

// State 1: Greeting Logic
function setupGreeting(data) {
    if (greetingScreen) {
        greetingScreen.classList.remove('hidden');
        const greetingText = document.getElementById('greetingText');
        const hint = document.getElementById('clickHint');

        greetingText.textContent = `Hi ${data.to} 💕`;

        // Audio attempt
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            musicToggle.innerHTML = '🔊';
            isMusicPlaying = true;
        }).catch(() => console.log("Audio waiting for interaction"));

        // Timer
        setTimeout(() => {
            hint.classList.remove('hidden');
            document.body.addEventListener('click', goToState2, { once: true });
        }, 2500);
    }
}

function goToState2() {
    greetingScreen.classList.add('hidden');

    const buildScreen = document.getElementById('buildScreen');
    const msg1 = document.getElementById('buildMsg1');
    const msg2 = document.getElementById('buildMsg2');
    const hint = document.getElementById('buildHint');

    if (buildScreen) {
        buildScreen.classList.remove('hidden');

        // Sequence
        setTimeout(() => msg1.classList.remove('hidden'), 500);
        setTimeout(() => msg2.classList.remove('hidden'), 2500);

        // Hint
        setTimeout(() => {
            hint.classList.remove('hidden');
            document.body.addEventListener('click', goToState3, { once: true });
        }, 4500);
    }
}

function goToState3() {
    document.getElementById('buildScreen').classList.add('hidden');
    const chatScreen = document.getElementById('chatScreen');
    const chatContainer = document.getElementById('chatContainer');
    chatScreen.classList.remove('hidden');

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
            chatContainer.appendChild(bubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            if (i === messages.length - 1) {
                setTimeout(() => {
                    document.getElementById('chatHint').classList.remove('hidden');
                    document.body.addEventListener('click', goToState4, { once: true });
                }, 1000);
            }
        }, delay);
        delay += 2000;
    });
}

function goToState4() {
    document.getElementById('chatScreen').classList.add('hidden');
    const questionScreen = document.getElementById('questionScreen');
    questionScreen.classList.remove('hidden');

    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const gifContainer = document.getElementById('pleaseGifContainer');

    // No Button Logic
    let noClickCount = 0;

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        noClickCount++;
        const texts = [
            "Are you sure? 😢",
            "Really sure? 🥺",
            "Think again! 😭",
            "Last chance! 💔",
            "You're breaking my heart...",
            "I'm gonna cry...",
            "Pls dont do this...",
            "I already told my mom!"
        ];

        // 1. Move Button Randomly
        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 150;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;

        // 2. Change Text
        if (noClickCount <= texts.length) {
            noBtn.innerText = texts[noClickCount - 1] || "Okay fine... 😭";
        }

        // 3. Shrink Button
        const scale = Math.max(0.5, 1 - (noClickCount * 0.1));
        noBtn.style.transform += ` scale(${scale})`;

        // 4. Show GIF
        gifContainer.classList.remove('hidden');
        // Placeholder GIF
        gifContainer.innerHTML = `<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveGJ5bTh5bTh5bTh5bTh5bTh5bTh5bTh5/L95W4wv8nimb9E6F/giphy.gif" alt="Please" style="width: 100%; max-width: 200px; border-radius: 10px;">`;

        // 5. Grow GIF
        if (noClickCount > 2) {
            const gifScale = 1 + (noClickCount * 0.1);
            gifContainer.querySelector('img').style.transform = `scale(${Math.min(gifScale, 2)})`;
        }
    });

    yesBtn.addEventListener('click', goToState5);
}

function goToState5() {
    document.getElementById('questionScreen').classList.add('hidden');
    const yesScreen = document.getElementById('yesScreen');
    yesScreen.classList.remove('hidden');

    // Message Logic
    const gender = state.userData.gender;
    const name = state.userData.from;
    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = `From ${name} ❤️`;

    // Confetti
    startConfetti();

    // Share Elements
    document.getElementById('shareAnswerBtn').addEventListener('click', shareAnswer);
    document.getElementById('shareFriendBtn').addEventListener('click', () => {
        window.open(window.location.origin + window.location.pathname, '_blank');
    });
}

function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function shareAnswer() {
    const text = `I said YES! 💖\nLook what ${state.userData.from} asked me!`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({ title: 'Be My Valentine?', text: text, url: url }).catch(console.error);
    } else {
        alert("Link copied to clipboard! Send it to them 💖");
        navigator.clipboard.writeText(`${text}\n${url}`);
    }
}

// Initialization
function init() {
    const params = state.params;
    if (params.has('to') && params.has('from')) {
        // Greeting Mode
        if (wizardContainer) wizardContainer.remove();
        state.userData = {
            to: params.get('to'),
            from: params.get('from'),
            gender: params.get('gender'),
            msg: params.get('msg')
        };
        setupGreeting(state.userData);
        console.log("Rendering Greeting Mode");
    } else {
        // Wizard Mode
        if (greetingScreen) greetingScreen.remove();
        setupWizard();
        console.log("Rendering Customization Mode");
    }
}

init();
