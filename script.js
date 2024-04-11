import data from './driverdata.js';
import {Driver} from './driverClass.js';

const drivers = Driver.LoadData(data);

// Function to create a driver card
function createDriverCard(driver) {
    const card = document.createElement('div');
    card.classList.add('driver-card');

    card.innerHTML = `
        <div class="card-header">
            <span class="race-number">${driver.raceNumber}</span>
            <h2>${driver.firstName} ${driver.lastName}</h2>
        </div>
        <div class="card-body">
            <img src="images/${driver.firstName.toLowerCase()}-${driver.lastName.toLowerCase()}.png" alt="${driver.firstName} ${driver.lastName}" class="driver-image">
            <p>Csapat: ${driver.team}</p>
            <p>Szezon győzelmi esély: ${driver.seasonOdds}</p>
            <p>Nemzetiség: ${driver.nationality}</p>
        </div>
    `;

    return card;
}

// Function to render all driver cards
function renderDriverCards(drivers) {
    const container = document.getElementById('driver-cards-container');
    drivers.forEach(driver => {
        const card = createDriverCard(driver);
        container.appendChild(card);
    });
}

// Render betting options for both season-long and per-race bets
function renderBettingOptions() {
    const seasonLongBetSelect = document.getElementById('season-long-bet');
    const raceBetSelect = document.getElementById('race-bet');

    drivers.forEach(driver => {
        const seasonLongOption = document.createElement('option');
        seasonLongOption.value = driver.lastName;
        seasonLongOption.textContent = `${driver.firstName} ${driver.lastName}`;
        seasonLongBetSelect.appendChild(seasonLongOption);

        const raceOption = document.createElement('option');
        raceOption.value = driver.lastName;
        raceOption.textContent = `${driver.firstName} ${driver.lastName}`;
        raceBetSelect.appendChild(raceOption);
    });
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to calculate race results based on season odds
function calculateRaceResults() {
    const raceResults = [];

    drivers.forEach(driver => {
        // Calculate the probability of winning based on odds
        const winProbability = 1 / driver.seasonOdds;

        // Generate a random number between 0 and 1
        const random = Math.random();

        // Determine the finishing status
        let result;
        if (random < 0.1) {
            result = 'Crashed';
        } else if (random < winProbability) {
            result = 'Winner';
        } else {
            result = 'Finished';
        }

        raceResults.push({ driver: driver, result: result });
    });

    // Shuffle the race results array to assign positions randomly
    shuffleArray(raceResults);

    // Assign positions to drivers
    raceResults.forEach((result, index) => {
        if (result.result === 'Crashed') {
            result.position = 'DNF';
        } else if (result.result === 'Winner') {
            result.position = 1;
        } else {
            // Assign position within range 2nd to 20th
            result.position = index + 2;
        }
    });

    return raceResults;
}

// Function to simulate a race
function simulateRace(raceNumber) {
    const raceResults = calculateRaceResults();
    console.log(`Race ${raceNumber} Results:`);
    raceResults.forEach(result => {
        console.log(`${result.driver.firstName} ${result.driver.lastName}: ${result.result} - Position: ${result.position}`);
    });
}

// Function to simulate all races
function simulateAllRaces() {
    for (let i = 1; i <= 24; i++) {
        simulateRace(i);
    }
}

// Event listener for race simulation
document.getElementById('simulate-race').addEventListener('click', () => {
    const raceNumber = parseInt(document.getElementById('race-number').value);
    simulateRace(raceNumber);
});

// Event listener for simulating all races
document.getElementById('simulate-all-races').addEventListener('click', () => {
    for (let i = 1; i <= 24; i++) {
        simulateRace(i);
    }
});

document.getElementById('simulate-races').addEventListener('click', simulateAllRaces);

// Render driver cards and betting options
renderDriverCards(drivers);
renderBettingOptions();
