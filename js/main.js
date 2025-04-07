/**
 * Main Module
 * Initializes the game and sets up event listeners
 */

// Import necessary modules and initialize variables
import {
   initDOMReferences,
   higherButton,
   lowerButton,
   playAgainButton,
   shareButton,
   backLink,
   gameScreen,
   gameOverScreen
} from './ui.js'; // Corrected from './dom.js'

import {
   fetchCountries,
   shuffleArray,
   preloadImages
} from './data.js'; // Corrected from './api.js'

import {
   startGame,
   handleGuess,
   playAgain,
   shareScore,
   handleBack,
   isAnimating,
   showLoadingError
} from './game.js'; // Corrected from './game.js' (unchanged)

import {
   CONFIG
} from './config.js'; // Corrected from './config.js' (unchanged)

import {
   updateScoreDisplay
} from './ui.js'; // Corrected from './ui.js' (unchanged)

let highScore = 0;
let score = 0;
let countries = [];

/**
 * Initialize the game
 */
async function initGame() {
   try {
      // Initialize DOM references
      initDOMReferences();

      // Get high score from local storage
      highScore = parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY)) || 0;

      // Update high score display
      updateScoreDisplay(score, highScore);

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, CONFIG.LOADING_DELAY));

      // Fetch countries data
      countries = await fetchCountries();

      if (!countries || countries.length === 0) {
         throw new Error('No countries data available');
      }

      // Shuffle the countries array
      shuffleArray(countries);

      // Preload some flag images
      preloadImages(countries.slice(0, 10));

      // Start the game
      startGame();

   } catch (error) {
      console.error('Error initializing game:', error);
      showLoadingError('Failed to load game data. Please check your internet connection or try again later.');
   }
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboard(event) {
   if (gameScreen.classList.contains('hidden')) {
      if (CONFIG.KEYBOARD_SHORTCUTS.PLAY_AGAIN.includes(event.key) &&
         !gameOverScreen.classList.contains('hidden')) {
         playAgainButton.click();
      }
      return;
   }

   if (isAnimating) return;

   if (CONFIG.KEYBOARD_SHORTCUTS.HIGHER.includes(event.key)) {
      higherButton.click();
   } else if (CONFIG.KEYBOARD_SHORTCUTS.LOWER.includes(event.key)) {
      lowerButton.click();
   }
}

// Set up event listeners
function setupEventListeners() {
   higherButton.addEventListener('click', () => handleGuess(true));
   lowerButton.addEventListener('click', () => handleGuess(false));
   playAgainButton.addEventListener('click', playAgain);
   shareButton.addEventListener('click', () => shareScore(score));
   backLink.addEventListener('click', handleBack);
   document.addEventListener('keydown', handleKeyboard);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
   initGame().then(() => {
      setupEventListeners();
   }).catch(error => {
      console.error('Failed to initialize game:', error);
      showLoadingError('Failed to load game. Please refresh the page.');
   });
});