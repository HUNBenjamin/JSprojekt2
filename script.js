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

// Render driver cards
renderDriverCards(drivers);