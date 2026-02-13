// BeMyValentine V2 Core Logic

console.log('BeMyValentine V2 Initialized 💖');

// Core Elements
const app = document.getElementById('app');
const mainContainer = document.getElementById('mainContainer');
const wizardContainer = document.getElementById('customizationWizard');
const greetingScreen = document.getElementById('greetingScreen');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

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
    console.log("Transitioning to State 2 (Build)...");
    // Placeholder for next commit
    alert("Moving to Emotional Build (Next Commit)!");
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
