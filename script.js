// BeMyValentine - Version 1.5 (GIF Fixes + Dance Animation)

console.log('BeMyValentine V1.5 - GIF Fixes 💖');

// State & Config
const state = {
    params: new URLSearchParams(window.location.search),
    userData: null
};

// GIF Collection
const gifs = {
    please: "assets/gifs/please.gif",
    nervous: "assets/gifs/nervous.gif",
    crying: "assets/gifs/crying.gif",
    sadHamster: "assets/gifs/sad_hamster.gif",
    finish: "assets/gifs/finish.gif",
    dance: "assets/gifs/dance.gif"
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



    // Generate Link Logic (Step 4 -> Step 5)
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

        const finalUrl = url.toString();

        // Show Step 5
        currentStep = 5;
        showStep(5);

        // Populate Input
        const shareInput = document.getElementById('shareUrl');
        shareInput.value = finalUrl;
        new mdb.Input(shareInput.parentNode).update(); // Update label state

        // WhatsApp Share
        document.getElementById('whatsappShare').onclick = () => {
            const text = `Hey ${recipient}! I have a secret message for you... 🤫💌\nCheck it out here: ${finalUrl}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        };

        // Copy Link
        document.getElementById('copyLinkBtn').onclick = () => {
            shareInput.select();
            shareInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(finalUrl).then(() => {
                alert('Link copied to clipboard! 📋✨');
            });
        };

        // Preview
        document.getElementById('previewBtn').onclick = () => finalUrl ? window.location.href = finalUrl : null;
    });

    // Internal Enter Key Logic for Wizard (Closure access to currentStep/handleNext)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !document.getElementById('customizationWizard').classList.contains('d-none')) {
            if (currentStep === 4) document.getElementById('generateBtn').click();
            else if (currentStep < 5) handleNext();
        }
    });
}

// Global Enter Key Listener (Runs everywhere)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // 1. OVERLAY (Start Screen)
        const overlay = document.getElementById('overlay');
        if (!overlay.classList.contains('d-none')) {
            overlay.click();
            e.preventDefault();
        }
    }
});

// --- STORY SCREEN TRANSITION HANDLERS ---
function addStoryNavigation(currentScreenId, nextFunction) {
    const handleNav = () => {
        document.removeEventListener('keydown', handleKey);
        nextFunction();
    };
    const handleKey = (e) => {
        if (e.key === 'Enter') {
            handleNav();
        }
    };
    document.getElementById(currentScreenId).onclick = handleNav; // Touch/Click
    document.addEventListener('keydown', handleKey, { once: true }); // Enter Key
}

function startGreeting(data) {
    const screen = document.getElementById('greetingScreen');
    screen.classList.remove('d-none');
    document.getElementById('greetingText').textContent = `Hi ${data.to} 💕`;
    setTimeout(() => {
        document.getElementById('clickHint').classList.remove('d-none');
        // Enable Navigation
        addStoryNavigation('greetingScreen', startBuildUp1);
    }, 2000);
}

function startBuildUp1() {
    document.getElementById('greetingScreen').classList.add('d-none');
    document.getElementById('buildScreen1').classList.remove('d-none');
    addStoryNavigation('buildScreen1', startBuildUp2);
}

function startBuildUp2() {
    document.getElementById('buildScreen1').classList.add('d-none');
    document.getElementById('buildScreen2').classList.remove('d-none');
    addStoryNavigation('buildScreen2', startChat);
}

function startChat() {
    document.getElementById('buildScreen2').classList.add('d-none');
    document.getElementById('chatScreen').classList.remove('d-none');

    // --- POPULATE CHAT HEADER ---
    const senderName = state.userData.from;
    const recipientGender = state.userData.gender; // 'male' or 'female'

    document.getElementById('chatHeaderName').innerText = senderName;
    // Logic: If recipient is female, sender is likely male (👨), and vice versa
    const avatarEmoji = recipientGender === 'male' ? '👩' : '👨';
    document.getElementById('chatAvatar').innerText = avatarEmoji;

    const container = document.getElementById('chatContainer');
    const messages = [
        { text: "Hewwo... 🥺", side: "right" },
        { text: "Can I ask something?", side: "right" },
        { text: "It's impawtant...", side: "right" },
        { text: state.userData.msg || "You mean the world to me.", side: "right" },
        { text: "So...", side: "right" }
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
                    addStoryNavigation('chatScreen', startQuestion);
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

    // Get the existing img from HTML, or create one as fallback
    let reactionGif = gifContainer.querySelector('img');
    if (!reactionGif) {
        reactionGif = document.createElement('img');
        reactionGif.src = gifs.please;
        reactionGif.className = 'rounded shadow-4-strong';
        reactionGif.style.cssText = 'width: 200px; height: 200px; object-fit: cover; transition: all 0.5s ease;';
        gifContainer.appendChild(reactionGif);
    }

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // --- Check if we've shown all texts ---
        const totalTexts = 9; // Based on getNoText array length
        if (clickCount >= totalTexts) {
            // Move No Button behind Yes Button and disable interaction
            const yesRect = yesBtn.getBoundingClientRect();

            // Use fixed positioning to guarantee exact overlap regardless of container context
            noBtn.style.position = 'fixed';
            noBtn.style.left = (yesRect.left + yesRect.width / 2) + 'px';
            noBtn.style.top = (yesRect.top + yesRect.height / 2) + 'px';

            // Center it and shrink to 0
            noBtn.style.transform = 'translate(-50%, -50%) scale(0)';
            noBtn.style.transition = 'all 0.5s ease';

            noBtn.style.zIndex = '-1';
            noBtn.style.opacity = '0';
            noBtn.disabled = true;
            noBtn.style.pointerEvents = 'none';

            return;
        }

        clickCount++;

        // 1. Move Button (Random but somewhat constrained to screen)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const x = (Math.random() - 0.5) * (windowWidth * 0.8);
        const y = (Math.random() - 0.5) * (windowHeight * 0.8);

        noBtn.style.transform = `translate(${x}px, ${y}px)`;
        noBtn.style.position = 'absolute';
        noBtn.style.zIndex = '1500';

        // 2. GIF Logic - Show only please.gif and increase its size
        gifContainer.classList.remove('d-none');
        gifContainer.classList.add('d-flex');
        reactionGif.src = gifs.please;
        reactionGif.style.display = 'block';

        const scale = 1 + (clickCount * 0.2);
        reactionGif.style.transform = `scale(${scale})`;
        reactionGif.style.zIndex = '100';

        // 3. SPAWN FLOATING TEXT (Collision Aware)
        const text = getNoText(clickCount);
        console.log("Spawning text:", text);
        spawnFloatingText(text);

        // 4. Yes Button Grow
        const yesScale = 1 + (clickCount * 0.4);
        yesBtn.style.transform = `scale(${Math.min(yesScale, 5)})`;
        yesBtn.style.zIndex = 1500;

        // 5. No Button Shrink
        if (clickCount > 3) {
            const noScale = Math.max(0.2, 1 - (clickCount * 0.1));
            noBtn.style.transform += ` scale(${noScale})`;
        }
    });

    yesBtn.addEventListener('click', startCelebration);
}

function spawnFloatingText(text) {
    const el = document.createElement('div');
    el.innerText = text;
    el.className = 'pop-text';

    // Initial invisible append to measure size
    el.style.opacity = '0';
    document.body.appendChild(el);

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    // Get exclusion zone (The main card/content area)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const excludeWidth = Math.min(600, window.innerWidth * 0.8);
    const excludeHeight = Math.min(500, window.innerHeight * 0.6);

    const excludeLeft = centerX - (excludeWidth / 2);
    const excludeRight = centerX + (excludeWidth / 2);
    const excludeTop = centerY - (excludeHeight / 2);
    const excludeBottom = centerY + (excludeHeight / 2);

    let x, y, safe = false;
    let attempts = 0;

    // Viewport bounds (safe area)
    const maxX = window.innerWidth - width - 20;
    const maxY = window.innerHeight - height - 20;
    const minX = 20;
    const minY = 20;

    while (!safe && attempts < 50) {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;

        if (x + width > excludeLeft - 20 && x < excludeRight + 20 &&
            y + height > excludeTop - 20 && y < excludeBottom + 20) {
            safe = false;
        } else {
            safe = true;
        }
        attempts++;
    }

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.opacity = '';

    setTimeout(() => {
        el.remove();
    }, 3000);
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
    const index = Math.min(count - 1, texts.length - 1);
    return texts[index];
}

function startCelebration() {
    document.getElementById('questionScreen').classList.add('d-none');
    document.getElementById('yesScreen').classList.remove('d-none');
    document.getElementById('celebrationGif').src = gifs.finish;

    const gender = state.userData.gender;
    const name = state.userData.to;
    document.getElementById('yesMessage').innerText = `${gender === 'female' ? 'She' : 'He'} said YES 💍💖`;
    document.getElementById('yesSubtext').innerText = ` - ${name} ❤️`;

    startConfetti();
    document.querySelectorAll('.pop-text').forEach(el => el.remove());

    // Add dancing GIFs from corners
    addDancingGifs();

    document.getElementById('shareAnswerBtn').addEventListener('click', () => {
        const text = `I said YES to ${state.userData.from}! 💖`;
        const url = window.location.href;
        if (navigator.share) navigator.share({ title: 'Valentine', text: text, url: url });
        else { alert('Link copied! 💌'); navigator.clipboard.writeText(`${text}\n${url}`); }
    });
}

function addDancingGifs() {
    // Alternating dance GIFs from lower corners
    let currentSide = 0; // 0 = left, 1 = right

    function showNextDancer() {
        const dancer = document.createElement('img');
        dancer.src = gifs.dance;
        dancer.style.position = 'fixed';
        dancer.style.width = '150px';
        dancer.style.height = '150px';
        dancer.style.objectFit = 'cover';
        dancer.style.bottom = '20px';
        dancer.style.zIndex = '9999';
        dancer.style.opacity = '0';
        dancer.style.transition = 'opacity 0.5s ease-in-out';
        dancer.style.pointerEvents = 'none';

        // Alternate between left and right corners
        if (currentSide === 0) {
            dancer.style.left = '20px';
            dancer.style.right = 'auto';
        } else {
            dancer.style.right = '20px';
            dancer.style.left = 'auto';
        }

        document.body.appendChild(dancer);

        // Fade in
        setTimeout(function () {
            dancer.style.opacity = '1';
        }, 100);

        // Fade out after 2 seconds
        setTimeout(function () {
            dancer.style.opacity = '0';
            setTimeout(function () {
                dancer.remove();

                // Switch to the other side and show next
                currentSide = (currentSide + 1) % 2;
                var yesScreen = document.getElementById('yesScreen');
                if (yesScreen && !yesScreen.classList.contains('d-none')) {
                    showNextDancer();
                }
            }, 500);
        }, 2000);
    }

    // Start the alternating animation
    showNextDancer();
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
