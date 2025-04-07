/**
 * Game Configuration
 * Contains all the constants and configuration settings for the game
 */

const CONFIG = {
   // API settings
   API_URL: 'https://restcountries.com/v3.1/all?fields=name,population,flags',
   
   // Game settings
   MIN_POPULATION: 100000, // Minimum population for countries to include
   LOADING_DELAY: 1500,    // Simulated loading time in ms
   
   // Animation timings
   POPULATION_REVEAL_DELAY: 1200,   // Delay before revealing population in ms
   RESULT_DISPLAY_DELAY: 1000,      // Delay before showing result in VS text
   NEXT_COUNTRY_DELAY: 1500,        // Delay before moving to next country
   TRANSITION_DURATION: 500,        // Duration of country transition animations
   
   // Local storage keys
   HIGH_SCORE_KEY: 'populationGameHighScore',
   
   // Accessibility
   KEYBOARD_SHORTCUTS: {
       HIGHER: ['ArrowUp', 'h', 'H'],
       LOWER: ['ArrowDown', 'l', 'L'],
       PLAY_AGAIN: ['Enter']
   }
};