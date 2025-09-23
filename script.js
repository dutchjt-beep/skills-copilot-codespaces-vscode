// Game state
let gameState = {
    currentLevel: 1,
    playerHealth: 100,
    playerPosition: { x: 50, y: 350 },
    collectedFragments: [],
    hasMapUpgrade: false,
    checkpointData: null,
    fragmentsPerLevel: {
        1: { x: 100, y: 100, text: "Memory Fragment 1: Your childhood home address was 123 Oak Street." },
        2: { x: 200, y: 200, text: "Memory Fragment 2: Your first pet was a golden retriever named Max." },
        3: { x: 300, y: 150, text: "Memory Fragment 3: Your favorite song was 'Imagine' by John Lennon." }
    }
};

// DOM elements
const screens = {
    mainMenu: document.getElementById('main-menu'),
    gameScreen: document.getElementById('game-screen'),
    deathScreen: document.getElementById('death-screen'),
    fragmentScreen: document.getElementById('fragment-screen')
};

const elements = {
    newGameBtn: document.getElementById('new-game-btn'),
    loadGameBtn: document.getElementById('load-game-btn'),
    menuBtn: document.getElementById('menu-btn'),
    player: document.getElementById('player'),
    door: document.getElementById('door'),
    health: document.getElementById('health'),
    fragmentCount: document.getElementById('fragment-count'),
    currentLevel: document.getElementById('current-level'),
    mapUpgrade: document.getElementById('map-upgrade'),
    fragmentsContainer: document.getElementById('fragments-container'),
    fragmentText: document.getElementById('fragment-text'),
    continueBtn: document.getElementById('continue-btn'),
    deathMsg1: document.getElementById('death-msg-1'),
    deathMsg2: document.getElementById('death-msg-2')
};

// Initialize game
function initGame() {
    // Check for saved checkpoint
    const savedCheckpoint = localStorage.getItem('gameCheckpoint');
    if (savedCheckpoint) {
        elements.loadGameBtn.disabled = false;
    }

    // Event listeners
    elements.newGameBtn.addEventListener('click', startNewGame);
    elements.loadGameBtn.addEventListener('click', loadGame);
    elements.menuBtn.addEventListener('click', showMainMenu);
    elements.continueBtn.addEventListener('click', hideFragmentScreen);
    elements.mapUpgrade.addEventListener('change', toggleMapUpgrade);

    // Player movement
    document.addEventListener('keydown', handlePlayerMovement);

    // Initialize map upgrade checkbox state
    elements.mapUpgrade.checked = gameState.hasMapUpgrade;
    
    showMainMenu();
}

function startNewGame() {
    gameState = {
        currentLevel: 1,
        playerHealth: 100,
        playerPosition: { x: 50, y: 350 },
        collectedFragments: [],
        hasMapUpgrade: false,
        checkpointData: null,
        fragmentsPerLevel: {
            1: { x: 100, y: 100, text: "Memory Fragment 1: Your childhood home address was 123 Oak Street." },
            2: { x: 200, y: 200, text: "Memory Fragment 2: Your first pet was a golden retriever named Max." },
            3: { x: 300, y: 150, text: "Memory Fragment 3: Your favorite song was 'Imagine' by John Lennon." }
        }
    };
    
    // Clear any saved checkpoint
    localStorage.removeItem('gameCheckpoint');
    elements.loadGameBtn.disabled = true;
    
    showGameScreen();
}

function loadGame() {
    const savedCheckpoint = localStorage.getItem('gameCheckpoint');
    if (savedCheckpoint) {
        gameState = JSON.parse(savedCheckpoint);
        showGameScreen();
    }
}

function showMainMenu() {
    hideAllScreens();
    screens.mainMenu.classList.add('active');
}

function showGameScreen() {
    hideAllScreens();
    screens.gameScreen.classList.add('active');
    updateGameDisplay();
    createLevelFragments();
}

function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
}

function updateGameDisplay() {
    // Update player position
    elements.player.style.left = gameState.playerPosition.x + 'px';
    elements.player.style.top = gameState.playerPosition.y + 'px';
    
    // Update UI
    elements.health.textContent = gameState.playerHealth;
    elements.fragmentCount.textContent = gameState.collectedFragments.length;
    elements.currentLevel.textContent = gameState.currentLevel;
    
    // Update map upgrade
    elements.mapUpgrade.checked = gameState.hasMapUpgrade;
    
    // Show/hide door based on map upgrade
    if (gameState.hasMapUpgrade) {
        elements.door.classList.remove('hidden');
    } else {
        elements.door.classList.add('hidden');
    }
    
    // Enable map upgrade after collecting first fragment
    if (gameState.collectedFragments.length > 0) {
        elements.mapUpgrade.disabled = false;
    }
}

function createLevelFragments() {
    // Clear existing fragments
    elements.fragmentsContainer.innerHTML = '';
    
    // Create fragment for current level if not collected
    const levelFragmentId = `level_${gameState.currentLevel}`;
    
    if (!gameState.collectedFragments.includes(levelFragmentId)) {
        const fragmentData = gameState.fragmentsPerLevel[gameState.currentLevel];
        if (fragmentData) {
            const fragment = document.createElement('div');
            fragment.className = 'fragment';
            fragment.style.left = fragmentData.x + 'px';
            fragment.style.top = fragmentData.y + 'px';
            fragment.dataset.level = gameState.currentLevel;
            fragment.addEventListener('click', collectFragment);
            elements.fragmentsContainer.appendChild(fragment);
        }
    }
}

function collectFragment(event) {
    const fragment = event.target;
    const level = parseInt(fragment.dataset.level);
    const fragmentId = `level_${level}`;
    
    // Mark as collected
    gameState.collectedFragments.push(fragmentId);
    fragment.classList.add('collected');
    
    // Show fragment text
    const fragmentData = gameState.fragmentsPerLevel[level];
    elements.fragmentText.textContent = fragmentData.text;
    
    hideAllScreens();
    screens.fragmentScreen.classList.add('active');
    
    updateGameDisplay();
}

function hideFragmentScreen() {
    showGameScreen();
    
    // Enable map upgrade after first fragment
    if (gameState.collectedFragments.length > 0) {
        elements.mapUpgrade.disabled = false;
    }
}

function toggleMapUpgrade() {
    gameState.hasMapUpgrade = elements.mapUpgrade.checked;
    updateGameDisplay();
}

function handlePlayerMovement(event) {
    if (!screens.gameScreen.classList.contains('active')) {
        return;
    }
    
    const moveSpeed = 20;
    const mapBounds = {
        left: 0,
        top: 0,
        right: 570, // Map width - player width
        bottom: 370 // Map height - player height
    };
    
    let newX = gameState.playerPosition.x;
    let newY = gameState.playerPosition.y;
    
    switch(event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            newX = Math.max(mapBounds.left, newX - moveSpeed);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            newX = Math.min(mapBounds.right, newX + moveSpeed);
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            newY = Math.max(mapBounds.top, newY - moveSpeed);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            newY = Math.min(mapBounds.bottom, newY + moveSpeed);
            break;
        case ' ':
            // Simulate taking damage (spacebar)
            takeDamage(25);
            break;
        case 'Enter':
            // Check if near door
            checkDoorInteraction();
            break;
    }
    
    gameState.playerPosition.x = newX;
    gameState.playerPosition.y = newY;
    updateGameDisplay();
}

function takeDamage(amount) {
    gameState.playerHealth -= amount;
    updateGameDisplay();
    
    if (gameState.playerHealth <= 0) {
        playerDeath();
    }
}

function playerDeath() {
    // Save checkpoint
    saveCheckpoint();
    
    // Show death screen with messages
    hideAllScreens();
    screens.deathScreen.classList.add('active');
    
    // Show death messages in sequence
    setTimeout(() => {
        elements.deathMsg1.classList.remove('hidden');
        elements.deathMsg1.classList.add('show');
    }, 500);
    
    setTimeout(() => {
        elements.deathMsg2.classList.remove('hidden');
        elements.deathMsg2.classList.add('show');
    }, 3000);
    
    // Return to main menu after messages
    setTimeout(() => {
        elements.deathMsg1.classList.remove('show');
        elements.deathMsg2.classList.remove('show');
        elements.deathMsg1.classList.add('hidden');
        elements.deathMsg2.classList.add('hidden');
        showMainMenu();
        
        // Enable load game button
        elements.loadGameBtn.disabled = false;
    }, 6000);
}

function saveCheckpoint() {
    const checkpointData = {
        currentLevel: gameState.currentLevel,
        playerHealth: 100, // Restore health at checkpoint
        playerPosition: { x: 50, y: 350 }, // Reset position
        collectedFragments: [...gameState.collectedFragments],
        hasMapUpgrade: gameState.hasMapUpgrade,
        fragmentsPerLevel: gameState.fragmentsPerLevel
    };
    
    localStorage.setItem('gameCheckpoint', JSON.stringify(checkpointData));
}

function checkDoorInteraction() {
    const doorPosition = { x: 540, y: 20 }; // Door position
    const playerPos = gameState.playerPosition;
    
    // Check if player is near door (within 50 pixels)
    const distance = Math.sqrt(
        Math.pow(playerPos.x - doorPosition.x, 2) + 
        Math.pow(playerPos.y - doorPosition.y, 2)
    );
    
    if (distance < 50) {
        // Advance to next level
        nextLevel();
    }
}

function nextLevel() {
    if (gameState.currentLevel < 3) {
        gameState.currentLevel++;
        gameState.playerPosition = { x: 50, y: 350 }; // Reset position
        showGameScreen();
    } else {
        // Game complete
        alert('Congratulations! You have completed all levels!');
        showMainMenu();
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);