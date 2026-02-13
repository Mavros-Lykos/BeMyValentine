// BeMyValentine MDB Refactor

console.log('BeMyValentine V2 MDB Initialized 💖');

// State Management
const state = {
    params: new URLSearchParams(window.location.search),
    userData: null
};

// DOM Elements
const wizardContainer = document.getElementById('customizationWizard');
const greetingScreen = document.getElementById('greetingScreen');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const privacyModal = document.getElementById('privacyModal');

// Audio Logic
let isMusicPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '🎵';
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed (interaction needed)", e));
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

// Wizard Logic
function setupWizard() {
    // Initialize MDB Inputs (Floating labels need initialization sometimes, but basic MDB works with classes)
    document.querySelectorAll('.form-outline').forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    let currentStep = 1;
    const totalSteps = 4;

    function showStep(step) {
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.classList.add('d-none');
            el.classList.remove('active-step');
        });
        const activeStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
        activeStep.classList.remove('d-none');
        activeStep.classList.add('active-step'); // For any custom animations

        // Auto focus logic
        const input = activeStep.querySelector('input, textarea');
        if (input) setTimeout(() => input.focus(), 100);
    }

    function validateAndNext() {
        if (currentStep === 1) {
            const name = document.getElementById('senderName').value.trim();
            if (!name) return alert("Please enter your name! 🥺");
        }
        if (currentStep === 2) {
            const name = document.getElementById('recipientName').value.trim();
            if (!name) return alert("Please enter their name! 💖");
        }

        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }

    // Next Buttons
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', validateAndNext);
    });

    // Prev Buttons
    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Enter Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeStep = document.querySelector('.wizard-step:not(.d-none)');
            if (activeStep && !wizardContainer.classList.contains('d-none')) {
                const input = document.activeElement;
                if (input && input.tagName === 'INPUT') {
                    e.preventDefault();
                    validateAndNext();
                }
            }
        }
    });

    // Generate Button
    document.getElementById('generateBtn').addEventListener('click', () => {
        const sender = document.getElementById('senderName').value.trim();
        const recipient = document.getElementById('recipientName').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const message = document.getElementById('customMessage').value.trim();

        if (!sender || !recipient) return alert("Please fill in all fields!");

        const url = new URL(window.location.href);
        url.searchParams.set('from', sender);
        url.searchParams.set('to', recipient);
        url.searchParams.set('gender', gender);
        url.searchParams.set('msg', message);

        window.location.href = url.toString();
    });
}

// State 1: Greeting
function setupGreeting(data) {
    greetingScreen.classList.remove('d-none');
    document.getElementById('greetingText').textContent = `Hi ${data.to} 💕`;

    // Try playing audio
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        musicToggle.innerHTML = '🔊';
        isMusicPlaying = true;
    }).catch(e => console.log("Autoplay blocked usually"));

    setTimeout(() => {
        document.getElementById('clickHint').classList.remove('d-none');
        document.body.addEventListener('click', goToBuildState, { once: true });
    }, 2000);
}

function goToBuildState() {
    greetingScreen.classList.add('d-none');
    const buildScreen = document.getElementById('buildScreen');
    buildScreen.classList.remove('d-none');

    const msg1 = document.getElementById('buildMsg1');
    const msg2 = document.getElementById('buildMsg2');
    const hint = document.getElementById('buildHint');

    setTimeout(() => msg1.classList.remove('d-none'), 500);
    setTimeout(() => msg2.classList.remove('d-none'), 2500);
    setTimeout(() => {
        hint.classList.remove('d-none');
        document.body.addEventListener('click', goToChatState, { once: true });
    }, 4500);
}

function goToChatState() {
    document.getElementById('buildScreen').classList.add('d-none');
    const chatScreen = document.getElementById('chatScreen');
    chatScreen.classList.remove('d-none');
    const chatContainer = document.getElementById('chatContainer');

    const messages = [
        { text: "You know something? 🥺", side: "left" },
        { text: "You make my days brighter.", side: "right" },
        { text: "I smile more because of you.", side: "left" },
        { text: state.userData.msg || "You are special to me.", side: "right" },
        { text: "So I was thinking…", side: "left" }
    ];

    let delay = 300;
    messages.forEach((msg, i) => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.classList.add('chat-bubble', msg.side === 'left' ? 'bubble-left' : 'bubble-right');
            bubble.innerText = msg.text;
            chatContainer.appendChild(bubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            if (i === messages.length - 1) {
                setTimeout(() => {
                    document.getElementById('chatHint').classList.remove('d-none');
                    document.body.addEventListener('click', goToQuestionState, { once: true });
                }, 1000);
            }
        }, delay);
        delay += 1500;
    });
}

function goToQuestionState() {
    document.getElementById('chatScreen').classList.add('d-none');
    document.getElementById('questionScreen').classList.remove('d-none');

    const noBtn = document.getElementById('noBtn');
    let clickCount = 0;
    const texts = ["Are you sure? 😢", "Really? 🥺", "Don't do this 😭", "I'm gonna cry...", "Heartbroken 💔"];

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;

        // Random Position
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        noBtn.style.transform = `translate(${x}px, ${y}px) scale(${1 - clickCount * 0.1})`;

        if (clickCount <= texts.length) {
            noBtn.innerText = texts[clickCount - 1];
        }

        // Show GIF
        const gifContainer = document.getElementById('pleaseGifContainer');
        gifContainer.classList.remove('d-none');
        gifContainer.classList.add('d-flex');
        gifContainer.innerHTML = `<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveGJ5bTh5bTh5bTh5bTh5bTh5bTh5bTh5/L95W4wv8nimb9E6F/giphy.gif" class="rounded shadow-4" style="max-width: 200px">`;

        // Make Yes button bigger
        const yesBtn = document.getElementById('yesBtn');
        const currentScale = 1 + (clickCount * 0.2);
        yesBtn.style.transform = `scale(${currentScale})`;
    });

    document.getElementById('yesBtn').addEventListener('click', goToYesState);
}

function goToYesState() {
    document.getElementById('questionScreen').classList.add('d-none');
    document.getElementById('yesScreen').classList.remove('d-none');

    const gender = state.userData.gender;
    const from = state.userData.from;
    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = `From ${from} ❤️`;

    startConfetti();

    document.getElementById('shareAnswerBtn').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Be My Valentine?',
                text: `I said YES! 💖\nLook what ${from} asked me!`,
                url: window.location.href
            });
        } else {
            alert('URL copied to clipboard!');
        }
    });

    document.getElementById('shareFriendBtn').addEventListener('click', () => {
        window.open(window.location.origin + window.location.pathname, '_blank');
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

// Initialization
function init() {
    const params = state.params;
    if (params.has('to') && params.has('from')) {
        wizardContainer.classList.add('d-none');
        state.userData = {
            to: params.get('to'),
            from: params.get('from'),
            gender: params.get('gender'),
            msg: params.get('msg')
        };
        setupGreeting(state.userData);
    } else {
        setupWizard();
    }
}

init();
