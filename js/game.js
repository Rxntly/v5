/**
 * Game Module
 * Handles core game logic and animations
 */

// Game state variables
let currentIndex = 0;
let nextIndex = 1;
let score = 0;
let highScore = 0;
let isAnimating = false;
let isGameOver = false;

// Declare variables
let populationPlaceholder = document.getElementById('population-placeholder');
let formatPopulation = (population) => population.toLocaleString();
let leftCard = document.getElementById('left-card');
let rightCard = document.getElementById('right-card');
let leftFlag = document.getElementById('left-flag');
let leftName = document.getElementById('left-name');
let leftPopulation = document.getElementById('left-population');
let rightFlag = document.getElementById('right-flag');
let rightName = document.getElementById('right-name');
let rightPopulation = document.getElementById('right-population');
let scoreValue = document.getElementById('score-value');
let highscoreValue = document.getElementById('highscore-value');
let vsText = document.getElementById('vs-text');
let loadingScreen = document.getElementById('loading-screen');
let gameScreen = document.getElementById('game-screen');
let gameOverScreen = document.getElementById('game-over-screen');

// Configuration object
const CONFIG = {
    TRANSITION_DURATION: 500,
    RESULT_DISPLAY_DELAY: 1000,
    POPULATION_REVEAL_DELAY: 750,
    HIGH_SCORE_KEY: 'highScore',
};

// Sample countries data (replace with your actual data)
const countries = [
    { name: 'Country A', population: 1000000, flag: 'flag_a.png' },
    { name: 'Country B', population: 2000000, flag: 'flag_b.png' },
    { name: 'Country C', population: 1500000, flag: 'flag_c.png' },
    { name: 'Country D', population: 2500000, flag: 'flag_d.png' },
    { name: 'Country E', population: 1200000, flag: 'flag_e.png' },
];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

/**
 * Updates the score display
 * @param {number} score - Current score
 * @param {number} highScore - High score
 */
function updateScoreDisplay(score, highScore) {
    scoreValue.textContent = score;
    highscoreValue.textContent = highScore;
}

/**
 * Updates the country display
 * @param {Object} leftCountry - Data for the left country
 * @param {Object} rightCountry - Data for the right country
 */
function updateCountryDisplay(leftCountry, rightCountry) {
    leftFlag.src = leftCountry.flag;
    leftFlag.alt = `Flag of ${leftCountry.name}`;
    leftName.textContent = leftCountry.name;
    leftPopulation.textContent = formatPopulation(leftCountry.population);

    rightFlag.src = rightCountry.flag;
    rightFlag.alt = `Flag of ${rightCountry.name}`;
    rightName.textContent = rightCountry.name;
    rightPopulation.textContent = '';
    rightPopulation.classList.add('hidden');
    populationPlaceholder.classList.remove('hidden');
}

/**
 * Toggles the disabled state of the buttons
 * @param {boolean} disabled - Whether the buttons should be disabled
 */
function toggleButtons(disabled) {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
}

/**
 * Show result in VS text
 * @param {boolean} isCorrect - Whether the guess was correct
 */
function showResultInVS(isCorrect) {
    if (isCorrect) {
        vsText.textContent = 'Correct!';
        vsText.className = 'vs-text correct';
    } else {
        vsText.textContent = 'Incorrect!';
        vsText.className = 'vs-text incorrect';
    }
}

/**
 * Show game over screen
 * @param {number} score - Final score
 * @param {number} highScore - High score
 */
function showGameOver(score, highScore) {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-highscore').textContent = highScore;
}

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element to display the number
 * @param {number} targetNumber - Target number to count up to
 */
function animateNumberCount(element, targetNumber) {
    // Hide placeholder
    populationPlaceholder.classList.add('hidden');
    
    // Show the population element but keep it empty initially
    element.textContent = '';
    element.classList.remove('hidden');
    element.classList.add('number-scroll');
    
    // Start with a lower number (about 10% of the target)
    const startNumber = Math.floor(targetNumber * 0.1);
    const duration = 1000; // 1 second animation
    const framesPerSecond = 60;
    const totalFrames = duration / 1000 * framesPerSecond;
    const increment = (targetNumber - startNumber) / totalFrames;
    
    let currentNumber = startNumber;
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        currentNumber += increment;
        
        if (frame >= totalFrames) {
            clearInterval(counter);
            currentNumber = targetNumber;
        }
        
        element.textContent = formatPopulation(Math.floor(currentNumber));
        
        if (frame >= totalFrames) {
            // Animation complete
            setTimeout(() => {
                element.classList.remove('number-scroll');
            }, 200);
        }
    }, 1000 / framesPerSecond);
}

/**
 * Animate country transition
 * @param {Object} currentCountry - Current country data
 * @param {Object} nextCountry - Next country data
 * @param {Object} upcomingCountry - Upcoming country data
 * @param {Function} callback - Callback function after animation completes
 */
function animateCountryTransition(currentCountry, nextCountry, upcomingCountry, callback) {
    // Animate the right card moving to the left
    leftCard.style.opacity = '0';
    rightCard.classList.add('slide-left');
    
    setTimeout(() => {
        // Update left card with right card's data
        leftFlag.src = nextCountry.flag;
        leftFlag.alt = `Flag of ${nextCountry.name}`;
        leftName.textContent = nextCountry.name;
        leftPopulation.textContent = formatPopulation(nextCountry.population);
        leftCard.style.opacity = '1';
        
        // Update right card with new country
        rightFlag.src = upcomingCountry.flag;
        rightFlag.alt = `Flag of ${upcomingCountry.name}`;
        rightName.textContent = upcomingCountry.name;
        rightPopulation.textContent = '';
        rightPopulation.classList.add('hidden');
        populationPlaceholder.classList.remove('hidden');
        
        // Reset animations
        rightCard.classList.remove('slide-left');
        rightCard.classList.add('slide-from-right');
        
        // Reset animation state after transition completes
        setTimeout(() => {
            rightCard.classList.remove('slide-from-right');
            rightPopulation.classList.remove('number-scroll');
            scoreValue.classList.remove('pulse');
            highscoreValue.classList.remove('pulse');
            
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, CONFIG.TRANSITION_DURATION);
    }, CONFIG.TRANSITION_DURATION);
}

/**
 * Animate score update
 * @param {boolean} isHighScore - Whether this is a new high score
 */
function animateScoreUpdate(isHighScore) {
    scoreValue.classList.add('pulse');
    
    if (isHighScore) {
        highscoreValue.classList.add('pulse');
    }
}

/**
 * Start the game
 */
function startGame() {
    // Reset game state
    score = 0;
    currentIndex = 0;
    nextIndex = 1;
    isGameOver = false;
    
    // Update score display
    updateScoreDisplay(score, highScore);
    
    // Reset VS text
    vsText.textContent = 'VS';
    vsText.className = 'vs-text';
    
    // Hide loading screen and show game screen
    loadingScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update country displays
    updateCountryDisplay(countries[currentIndex], countries[nextIndex]);
    
    // Enable buttons
    toggleButtons(false);
}

/**
 * Handle player's guess
 * @param {boolean} isHigher - Whether the player guessed higher
 */
function handleGuess(isHigher) {
    if (isAnimating || isGameOver) return;
    isAnimating = true;
    
    // Disable buttons during animation
    toggleButtons(true);
    
    const currentPopulation = countries[currentIndex].population;
    const nextPopulation = countries[nextIndex].population;
    
    // Animate the population number counting up
    animateNumberCount(rightPopulation, nextPopulation);
    
    // Determine if the guess is correct
    const isCorrect = 
        (isHigher && nextPopulation > currentPopulation) || 
        (!isHigher && nextPopulation < currentPopulation);
    
    // Wait for the population reveal animation
    setTimeout(() => {
        // Show result in VS text
        showResultInVS(isCorrect);
        
        if (isCorrect) {
            // Increase score
            score++;
            
            // Update score display
            updateScoreDisplay(score, highScore);
            
            // Animate score update
            animateScoreUpdate(false);
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                localStorage.setItem(CONFIG.HIGH_SCORE_KEY, highScore);
                updateScoreDisplay(score, highScore);
                animateScoreUpdate(true);
            }
            
            // Prepare next country
            let upcomingIndex = nextIndex + 1;
            if (upcomingIndex >= countries.length) {
                shuffleArray(countries);
                upcomingIndex = 0;
            }
            
            // Move to next comparison after a delay
            setTimeout(() => {
                // Animate the transition
                animateCountryTransition(
                    countries[currentIndex],
                    countries[nextIndex],
                    countries[upcomingIndex],
                    () => {
                        // Update indices
                        currentIndex = nextIndex;
                        nextIndex = upcomingIndex;
                        
                        // Reset animation state
                        isAnimating = false;
                        
                        // Re-enable buttons
                        toggleButtons(false);
                    }
                );
            }, CONFIG.RESULT_DISPLAY_DELAY);
            
        } else {
            // Game over after a delay
            setTimeout(() => {
                isGameOver = true;
                showGameOver(score, highScore);
                isAnimating = false;
            }, CONFIG.RESULT_DISPLAY_DELAY);
        }
    }, CONFIG.POPULATION_REVEAL_DELAY);
}

/**
 * Play again
 */
function playAgain() {
    // Shuffle countries for a new game
    shuffleArray(countries);
    
    // Reset indices
    currentIndex = 0;
    nextIndex = 1;
    
    // Reset score
    score = 0;
    
    // Hide game over screen
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Reset animation classes
    rightPopulation.classList.remove('number-scroll');
    
    // Update country display
    updateCountryDisplay(countries[currentIndex], countries[nextIndex]);
    
    // Update score display
    updateScoreDisplay(score, highScore);
    
    // Reset game state
    isGameOver = false;
    
    // Enable buttons
    toggleButtons(false);
}