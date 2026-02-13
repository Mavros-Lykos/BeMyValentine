// BeMyValentine V2 Core Logic

console.log('BeMyValentine V2 Initialized 💖');

// Core Elements
const app = document.getElementById('app');
const mainContainer = document.getElementById('mainContainer');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// State Management
const state = {
    currentScreen: 'init', // init, customize, greeting, build, chat, question, yes
    params: new URLSearchParams(window.location.search),
    userData: {}
};

// Audio Handling
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

// Initialization
function init() {
    const params = state.params;
    if (params.has('to') && params.has('from')) {
        // Render Greeting
        console.log("Rendering Greeting Mode");
    } else {
        // Render Customization Wizard
        console.log("Rendering Customization Mode");
    }
}

// Start
init();
