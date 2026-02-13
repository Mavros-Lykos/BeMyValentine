// BeMyValentine V2 Core Logic

console.log('BeMyValentine V2 Initialized 💖');

// Core Elements
const app = document.getElementById('app');
const mainContainer = document.getElementById('mainContainer'); // Now acts as wrapper
const wizardContainer = document.getElementById('customizationWizard');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// State Management
const state = {
    currentScreen: 'init',
    params: new URLSearchParams(window.location.search),
    userData: null
};

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
        // Small delay for animation trigger if we wanted it
        setTimeout(() => activeStep.classList.add('active'), 10);
    }

    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Validation
            if (currentStep === 1) {
                const name = document.getElementById('senderName').value;
                if (!name.trim()) return alert("Please enter your name! 🥺");
            }
            if (currentStep === 2) {
                const name = document.getElementById('recipientName').value;
                if (!name.trim()) return alert("Please enter their name! 💖");
            }

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

// Initialization
function init() {
    const params = state.params;
    if (params.has('to') && params.has('from')) {
        // We have data -> Hide Wizard, Show Greeting (Placeholder for now)
        if (wizardContainer) wizardContainer.classList.add('hidden');
        mainContainer.innerHTML = `<h1>Loading Surprise... 💖</h1>`;
        console.log("Rendering Greeting Mode");
    } else {
        // Show Wizard
        if (wizardContainer) {
            setupWizard();
        }
        console.log("Rendering Customization Mode");
    }
}

// Start
init();
