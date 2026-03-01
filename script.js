// Word list for the game
const words = [
    "algorithm", "application", "bandwidth", "browser", "byte", "cache", "client", "cloud",
    "compiler", "cookie", "cybersecurity", "database", "debug", "developer", "domain",
    "encryption", "ethernet", "firewall", "framework", "frontend", "backend", "hardware",
    "html", "hyperlink", "interface", "javascript", "kernel", "keyboard", "latency",
    "linux", "malware", "memory", "monitor", "network", "node", "object", "offline",
    "online", "password", "phishing", "pixel", "platform", "plugin", "portal", "processor",
    "program", "protocol", "python", "query", "ram", "repository", "resolution", "router",
    "script", "server", "software", "source", "spam", "spider", "sql", "storage",
    "syntax", "system", "tag", "terminal", "thread", "token", "traffic", "ui", "ux",
    "variable", "vector", "virtual", "virus", "web", "widget", "window", "wireless",
    "workflow", "xml", "zip", "agile", "architecture", "array", "binary", "boolean",
    "buffer", "class", "cluster", "command", "commit", "compile", "component", "config",
    "console", "container", "crypto", "data", "deploy", "design", "directory", "dynamic",
    "element", "endpoint", "environment", "error", "event", "exception", "execute"
];

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen')
};

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const finalWpmDisplay = document.getElementById('final-wpm');
const finalScoreDisplay = document.getElementById('final-score');
const finalAccuracyDisplay = document.getElementById('final-accuracy');

// Game State
let currentWord = '';
let score = 0;
let time = 60;
let isPlaying = false;
let timer;
let totalKeystrokes = 0;
let correctCharactersLength = 0;
const GAME_DURATION = 60; // 60 seconds

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
wordInput.addEventListener('input', checkInput);

// Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

function startGame() {
    isPlaying = true;
    score = 0;
    time = GAME_DURATION;
    totalKeystrokes = 0;
    correctCharactersLength = 0;
    
    scoreDisplay.innerText = score;
    timeDisplay.innerText = time;
    
    showScreen('game');
    
    wordInput.value = '';
    wordInput.focus();
    wordInput.classList.remove('error', 'success');
    
    showNewWord();
    
    // Clear any existing timer
    clearInterval(timer);
    // Start interval
    timer = setInterval(updateTimer, 1000);
}

function showNewWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.innerText = currentWord;
}

function checkInput(e) {
    if (!isPlaying) return;
    
    const typedValue = wordInput.value.trim();
    totalKeystrokes++;
    
    if (currentWord.startsWith(typedValue)) {
        // Correct typing so far
        wordInput.classList.remove('error');
        
        // Full word correct
        if (typedValue === currentWord) {
            wordInput.classList.add('success');
            score++;
            scoreDisplay.innerText = score;
            correctCharactersLength += currentWord.length;
            
            setTimeout(() => {
                wordInput.value = '';
                wordInput.classList.remove('success');
                showNewWord();
            }, 100);
        }
    } else {
        // Typing mistake
        wordInput.classList.add('error');
        wordInput.classList.remove('success');
    }
}

function updateTimer() {
    time--;
    timeDisplay.innerText = time;
    
    if (time === 0) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(timer);
    
    // Stats calculation
    const minutes = GAME_DURATION / 60;
    const wpm = Math.round((correctCharactersLength / 5) / minutes);
    let accuracy = 0;
    
    if (totalKeystrokes > 0) {
        // An approximation since total keystrokes can be higher due to mistakes and backspaces
        const rawAccuracy = (correctCharactersLength / totalKeystrokes) * 100;
        accuracy = Math.round(Math.min(rawAccuracy, 100)); // Cap at 100% just in case
    }
    
    finalScoreDisplay.innerText = score;
    finalWpmDisplay.innerText = wpm || 0;
    finalAccuracyDisplay.innerText = `${accuracy}%`;
    
    showScreen('end');
}
