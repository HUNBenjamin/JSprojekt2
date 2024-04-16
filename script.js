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

const raceCalendar = [
    // List of races in the Formula 1 2024 championship calendar
    // Add race details: name, location, date, etc.
];

let currentRaceIndex = 0; // Index of the current race being simulated

let championshipStandings = {}; // Object to store championship standings

let playerMoney = 1000; // Starting money for the player
const seasonOdds = {}; // Object to store season odds for each driver

// Function to simulate a single race
function simulateSingleRace() {
    const race = raceCalendar[currentRaceIndex];
    const raceResults = calculateRaceResults();
    updateChampionshipStandings(raceResults);
    displayRaceResults(race, raceResults);
    currentRaceIndex++;
}

// Function to simulate remaining races
function simulateRemainingRaces() {
    for (let i = currentRaceIndex; i < raceCalendar.length; i++) {
        simulateSingleRace();
    }
}

// Function to simulate the entire season
function simulateSeason() {
    currentRaceIndex = 0;
    simulateRemainingRaces();
}

// Function to calculate race results based on season odds
function calculateRaceResults() {
    const raceResults = [];

    drivers.forEach(driver => {
        const winProbability = 1 / driver.seasonOdds;
        const random = Math.random();
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

    shuffleArray(raceResults);

    raceResults.forEach((result, index) => {
        if (result.result === 'Crashed') {
            result.position = 'DNF';
        } else if (result.result === 'Winner') {
            result.position = 1;
        } else {
            result.position = index + 2;
        }
    });

    return raceResults;
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to update championship standings
function updateChampionshipStandings(raceResults) {
    raceResults.forEach(result => {
        if (result.result !== 'Crashed') {
            if (!championshipStandings[result.driver.raceNumber]) {
                championshipStandings[result.driver.raceNumber] = {
                    driver: result.driver,
                    points: 0
                };
            }
            const points = calculatePoints(result.position);
            championshipStandings[result.driver.raceNumber].points += points;
        }
    });
}

// Function to calculate points based on finishing position
function calculatePoints(position) {
    const pointsMap = {
        1: 25,
        2: 18,
        3: 15,
        4: 12,
        5: 10,
        6: 8,
        7: 6,
        8: 4,
        9: 2,
        10: 1
    };
    return pointsMap[position] || 0;
}

// Function to display race results
function displayRaceResults(race, raceResults) {
    const raceResultsContainer = document.getElementById('race-results-container');
    const raceHeader = document.createElement('h3');
    raceHeader.textContent = `Race ${currentRaceIndex + 1}: ${race.name}`;
    raceResultsContainer.appendChild(raceHeader);

    const resultsList = document.createElement('ul');
    raceResults.forEach(result => {
        const position = result.position === 'DNF' ? 'DNF' : `${result.position}th`;
        const listItem = document.createElement('li');
        listItem.textContent = `${result.driver.firstName} ${result.driver.lastName}: ${result.result} - Position: ${position}`;
        resultsList.appendChild(listItem);
    });
    raceResultsContainer.appendChild(resultsList);
}

// Event listener for simulating single race
document.getElementById('simulate-race').addEventListener('click', simulateSingleRace);

// Event listener for simulating remaining races
document.getElementById('simulate-races').addEventListener('click', simulateRemainingRaces);

// Event listener for simulating all races
document.getElementById('simulate-all-races').addEventListener('click', simulateSeason);

// Function to handle betting options
function placeBet() {
    // Implement betting logic here
}

// Function to update player money based on betting results
function updatePlayerMoney(won) {
    if (won) {
        playerMoney *= seasonOdds[currentRaceIndex];
    } else {
        playerMoney -= seasonOdds[currentRaceIndex];
    }
}

// Function to display championship standings
function displayChampionshipStandings() {
    const standingsContainer = document.getElementById('championship-standings-container');
    standingsContainer.innerHTML = ''; // Clear previous standings

    const sortedStandings = Object.values(championshipStandings).sort((a, b) => b.points - a.points);
    const standingsList = document.createElement('ol');
    sortedStandings.forEach((standing, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${standing.driver.firstName} ${standing.driver.lastName}: ${standing.points} points`;
        standingsList.appendChild(listItem);
    });
    standingsContainer.appendChild(standingsList);
}

// Display initial championship standings
displayChampionshipStandings();

// Render driver cards and betting options
renderDriverCards(drivers);
renderBettingOptions();
