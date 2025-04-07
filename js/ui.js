/**
 * UI Module
 * Handles UI updates and interactions
 */

// Import necessary functions and variables
import { formatPopulation } from './utils.js'; // Assuming formatPopulation is in utils.js
import { CONFIG } from './config.js'; // Assuming CONFIG is in config.js

// DOM Elements
let loadingScreen, gameScreen, gameOverScreen;
let scoreValue, highscoreValue, finalScoreElement, highScoreElement;
let leftFlag, leftName, leftPopulation, leftCard;
let rightFlag, rightName, rightPopulation, rightCard, populationPlaceholder;
let vsText;
let higherButton, lowerButton, playAgainButton, shareButton, backLink;

/**
 * Initialize DOM references
 */
function initDOMReferences() {
    loadingScreen = document.getElementById('loading-screen');
    gameScreen = document.getElementById('game-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    
    scoreValue = document.getElementById('score-value');
    highscoreValue = document.getElementById('highscore-value');
    finalScoreElement = document.getElementById('final-score');
    highScoreElement = document.getElementById('high-score');
    
    leftFlag = document.getElementById('left-flag');
    leftName = document.getElementById('left-name');
    leftPopulation = document.getElementById('left-population');
    leftCard = document.getElementById('left-card');
    
    rightFlag = document.getElementById('right-flag');
    rightName = document.getElementById('right-name');
    rightPopulation = document.getElementById('right-population');
    rightCard = document.getElementById('right-card');
    populationPlaceholder = document.getElementById('population-placeholder');
    
    vsText = document.getElementById('vs-text');
    
    higherButton = document.getElementById('higher-button');
    lowerButton = document.getElementById('lower-button');
    playAgainButton = document.getElementById('play-again-button');
    shareButton = document.getElementById('share-button');
    backLink = document.getElementById('back-link');
}

/**
 * Show loading error
 * @param {string} message - Error message to display
 */
function showLoadingError(message) {
    const loadingContainer = document.querySelector('.loading-container');
    loadingContainer.innerHTML = `
        <div class="error-message">
            ${message || 'Failed to load game data. Please refresh the page.'}
        </div>
    `;
}

/**
 * Update the country display
 * @param {Object} currentCountry - Current country object
 * @param {Object} nextCountry - Next country object
 */
function updateCountryDisplay(currentCountry, nextCountry) {
    // Update left (current) country
    leftFlag.src = currentCountry.flag;
    leftFlag.alt = `Flag of ${currentCountry.name}`;
    leftName.textContent = currentCountry.name;
    leftPopulation.textContent = formatPopulation(currentCountry.population);
    
    // Update right (next) country
    rightFlag.src = nextCountry.flag;
    rightFlag.alt = `Flag of ${nextCountry.name}`;
    rightName.textContent = nextCountry.name;
    rightPopulation.textContent = '';  // Clear the text before animation
    rightPopulation.classList.add('hidden');
    populationPlaceholder.classList.remove('hidden');
    
    // Reset card animations
    leftCard.classList.remove('slide-left');
    rightCard.classList.remove('slide-from-right');
    leftCard.style.opacity = '1';
    rightCard.style.opacity = '1';
}

/**
 * Update score display
 * @param {number} score - Current score
 * @param {number} highScore - High score
 */
function updateScoreDisplay(score, highScore) {
    scoreValue.textContent = score;
    highscoreValue.textContent = highScore;
}

/**
 * Show result in VS text
 * @param {boolean} isCorrect - Whether the guess was correct
 */
function showResultInVS(isCorrect) {
    // Change VS text to show result
    vsText.textContent = isCorrect ? '✓' : '✗';
    vsText.className = isCorrect ? 'vs-text correct' : 'vs-text incorrect';
    
    // Change back to VS after a delay
    setTimeout(() => {
        vsText.textContent = 'VS';
        vsText.className = 'vs-text';
    }, CONFIG.NEXT_COUNTRY_DELAY);
}

/**
 * Show game over screen
 * @param {number} score - Final score
 * @param {number} highScore - High score
 */
function showGameOver(score, highScore) {
    // Hide game screen and show game over screen
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    
    // Update final score and high score
    finalScoreElement.textContent = score;
    highScoreElement.textContent = highScore;
}

/**
 * Share score
 * @param {number} score - Score to share
 */
function shareScore(score) {
    const text = `I scored ${score} in the Population by Country game! Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Population by Country Game',
            text: text,
            url: window.location.href
        }).catch(error => {
            console.error('Error sharing:', error);
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

/**
 * Fallback sharing method (copy to clipboard)
 * @param {string} text - Text to copy to clipboard
 */
function fallbackShare(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
    
    // Notify the user
    alert('Score copied to clipboard!');
}

/**
 * Handle back button
 * @param {Event} e - Click event
 */
function handleBack(e) {
    e.preventDefault();
    const confirmLeave = confirm('Are you sure you want to leave the game?');
    if (confirmLeave) {
        window.location.href = '/';
    }
}

/**
 * Toggle button state
 * @param {boolean} disabled - Whether buttons should be disabled
 */
function toggleButtons(disabled) {
    higherButton.disabled = disabled;
    lowerButton.disabled = disabled;
}