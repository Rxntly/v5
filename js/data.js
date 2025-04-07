/**
 * Data Module
 * Handles fetching, processing, and managing country data
 */

// Import the config module
import CONFIG from './config.js';

// Country data storage
let countries = [];

/**
 * Fetch countries data from the API
 * @returns {Promise<Array>} Array of processed country objects
 */
async function fetchCountries() {
    try {
        const response = await fetch(CONFIG.API_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch countries data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched countries data:', data); // Debug log
        
        // Filter and process countries data
        return data
            .filter(country => 
                country.population > CONFIG.MIN_POPULATION && 
                country.name.common && 
                (country.flags.png || country.flags.svg)
            )
            .map(country => ({
                name: country.name.common,
                population: country.population,
                flag: country.flags.png || country.flags.svg
            }));
            
    } catch (error) {
        console.error('Error fetching countries data:', error);
        throw error;
    }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Preload images to prevent flickering
 * @param {Array} countriesToPreload - Array of country objects to preload flags for
 */
function preloadImages(countriesToPreload) {
    countriesToPreload.forEach(country => {
        if (country.flag) {
            const img = new Image();
            img.src = country.flag;
        }
    });
}

/**
 * Format population number with commas
 * @param {number} population - Population number to format
 * @returns {string} Formatted population string
 */
function formatPopulation(population) {
    return new Intl.NumberFormat().format(population);
}