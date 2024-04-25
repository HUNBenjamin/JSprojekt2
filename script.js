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

// Store betting information
let bets = [];
let seasonLongBets = [];

// Function to handle placing a bet on the entire season
document.getElementById('place-season-bet').addEventListener('click', () => {
    const selectedDriver = document.getElementById('season-long-bet').value;
    const betAmount = parseInt(document.getElementById('season-long-bet-amount').value);
    placeSeasonBet(selectedDriver, betAmount);
});

// Function to handle placing a bet on a single race
document.getElementById('place-race-bet').addEventListener('click', () => {
    const selectedDriver = document.getElementById('race-bet').value;
    const betAmount = parseInt(document.getElementById('race-bet-amount').value);
    placeBet(selectedDriver, betAmount);
});

// Function to handle betting options
function placeBet(driverName, amount) {
    const driver = drivers.find(driver => driver.lastName === driverName);
    if (!driver) {
        document.getElementById('money-warning').innerHTML = 'Kérem válasszon egy versenyzőt!';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    if (amount <= 0) {
        document.getElementById('money-warning').innerHTML = 'A tétnek minimum 1$-nak kell lennie!';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    if (amount > playerMoney) {
        document.getElementById('money-warning').innerHTML = 'Ennyi pénze nincsen, válasszon egy kisebb értéket!';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    bets.push({ driver: driver, amount: amount });
    document.getElementById('money-warning').innerHTML = 'Sikeres fogadás!';
}

// Function to calculate and display betting results
function displayBettingResults(raceResults) {
    bets.forEach(bet => {
        const winner = raceResults.find(result => result.result === 'Winner' && result.driver.lastName === bet.driver.lastName);
        if (winner) {
            const odds = bet.driver.seasonOdds;
            const winnings = bet.amount * odds;
            playerMoney += winnings;
            document.getElementById('betResult').innerHTML += `Gratulálok! ${winnings}$-t nyertél ${bet.driver.firstName} ${bet.driver.lastName} versenyzőre fogadásoddal!<br>`;
            document.getElementById('money-warning').innerHTML = '';
        } else {
            playerMoney -= bet.amount;
            document.getElementById('betResult').innerHTML += `Sajnos ${bet.driver.firstName} ${bet.driver.lastName} nem nyerte meg ezt a versenyt!<br>`;
            document.getElementById('money-warning').innerHTML = '';
        }
    });
    bets = []; // Clear bets after displaying results
}

function placeSeasonBet(driverName, amount) {
    const driver = drivers.find(driver => driver.lastName === driverName);
    if (!driver) {
        document.getElementById('money-warning').innerHTML = 'Kérem válasszon ki egy versenyzőt';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    if (amount <= 0) {
        document.getElementById('money-warning').innerHTML = 'A tétnek minimum 1$-nak kell lennie!';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    if (amount > playerMoney) {
        document.getElementById('money-warning').innerHTML = 'Ennyi pénze nincsen, válasszon egy kisebb értéket!';
        document.getElementById('betResult').innerHTML = '';
        return;
    }

    // Add the bet to the seasonLongBets array
    seasonLongBets.push({ driver, amount });

    document.getElementById('betResult').innerHTML = `Sikeres fogadás ${driverName} versenyzőre.`;
    document.getElementById('money-warning').innerHTML = '';
}

// Function to update player money based on betting results
function updatePlayerMoney(won) {
    let péz = playerMoney
    if (won) {
        playerMoney *= seasonOdds[currentRaceIndex] - péz;
    } else {
        playerMoney -= seasonOdds[currentRaceIndex];
    }
}

const raceCalendar = [
    {
        name: "Bahrain Grand Prix",
        location: "Bahrain International Circuit, Sakhir, Bahrain",
        date: "Mar 2"
    },
    {
        name: "Saudi Arabian Grand Prix",
        location: "Jeddah Street Circuit, Jeddah, Saudi Arabia",
        date: "Mar 9"
    },
    {
        name: "Australian Grand Prix",
        location: "Albert Park, Melbourne, Australia",
        date: "Mar 24"
    },
    {
        name: "Japanese Grand Prix",
        location: "Suzuka Circuit, Suzuka, Japan",
        date: "Apr 7"
    },
    {
        name: "Chinese Grand Prix",
        location: "Shanghai International Circuit, Shanghai, China",
        date: "Apr 21"
    },
    {
        name: "Miami Grand Prix",
        location: "Miami International Autodrome, Miami, USA",
        date: "May 5"
    },
    {
        name: "Emilia Romagna Grand Prix",
        location: "Autodromo Enzo e Dino Ferrari, Imola, Italy",
        date: "May 19"
    },
    {
        name: "Monaco Grand Prix",
        location: "Circuit de Monaco, Monte Carlo, Monaco",
        date: "May 26"
    },
    {
        name: "Canadian Grand Prix",
        location: "Circuit Gilles Villeneuve, Montreal, Canada",
        date: "Jun 9"
    },
    {
        name: "Spanish Grand Prix",
        location: "Circuit de Catalunya, Barcelona, Spain",
        date: "Jun 23"
    },
    {
        name: "Austrian Grand Prix",
        location: "Red Bull Ring, Spielberg, Austria",
        date: "Jun 30"
    },
    {
        name: "British Grand Prix",
        location: "Silverstone Circuit, Silverstone, United Kingdom",
        date: "Jul 7"
    },
    {
        name: "Hungarian Grand Prix",
        location: "Hungaroring, Budapest, Hungary",
        date: "Jul 21"
    },
    {
        name: "Belgian Grand Prix",
        location: "Circuit de Spa-Francorchamps, Spa, Belgium",
        date: "Jul 28"
    },
    {
        name: "Dutch Grand Prix",
        location: "Circuit Zandvoort, Zandvoort, Netherlands",
        date: "Aug 25"
    },
    {
        name: "Italian Grand Prix",
        location: "Autodromo Nazionale Monza, Monza, Italy",
        date: "Sep 1"
    },
    {
        name: "Azerbaijan Grand Prix",
        location: "Baku City Circuit, Baku, Azerbaijan",
        date: "Sep 15"
    },
    {
        name: "Singapore Grand Prix",
        location: "Marina Bay Street Circuit, Marina Bay, Singapore",
        date: "Sep 22"
    },
    {
        name: "United States Grand Prix",
        location: "Circuit of the Americas, Austin, USA",
        date: "Oct 20"
    },
    {
        name: "Mexican Grand Prix",
        location: "Autodromo Hermanos Rodriguez, Mexico City, Mexico",
        date: "Oct 27"
    },
    {
        name: "Brazilian Grand Prix",
        location: "Autódromo José Carlos Pace, Interlagos, São Paulo, Brazil",
        date: "Nov 3"
    },
    {
        name: "Las Vegas Grand Prix",
        location: "Las Vegas Street Circuit, Las Vegas, USA",
        date: "Nov 24"
    },
    {
        name: "Lusail Grand Prix",
        location: "Losail International Circuit, Lusail, Qatar",
        date: "Dec 1"
    },
    {
        name: "Abu Dhabi Grand Prix",
        location: "Yas Marina Circuit, Abu Dhabi, UAE",
        date: "Dec 8"
    }
];


let currentRaceIndex = 0; // Index of the current race being simulated

let championshipStandings = {}; // Object to store championship standings

let playerMoney = 1000; // Starting money for the player
const seasonOdds = {}; // Object to store season odds for each driver

// Function to simulate a single race
function simulateSingleRace() {
    // Clear previous race results
    const raceResultsContainer = document.getElementById('race-results-container');
    raceResultsContainer.innerHTML = '';

    const race = raceCalendar[currentRaceIndex];
    if (!race) {
        console.error("Error: Race object is undefined.");
        return;
    }
    // Simulate the race to determine if the bet is won
    const raceResults = calculateRaceResults();
    if (raceResults) { // Check if raceResults is defined
        displayBettingResults(raceResults);
    }
    updateChampionshipStandings(raceResults);
    displayRaceResults(raceCalendar[currentRaceIndex], raceResults);
    displayBettingResults(raceResults);
    displayChampionshipStandings();
    currentRaceIndex++; // Move the increment inside the function
    displayPlayerMoney();
}


// Function to simulate remaining races
function simulateRemainingRaces() {
    for (let i = currentRaceIndex; i < raceCalendar.length; i++) {
        simulateSingleRace();
    }
    settleSeasonLongBets();
}

// Function to simulate the entire season
function simulateSeason() {
    function simulateSeason() {
        while (currentRaceIndex < raceCalendar.length) {
            simulateSingleRace();
        }
        // After all races have been simulated, settle season-long bets
        settleSeasonLongBets();
    }
}

function settleSeasonLongBets() {
    const finalStandings = Object.values(championshipStandings).sort((a, b) => b.points - a.points);
    seasonLongBets.forEach(bet => {
        const driverStanding = finalStandings.find(standing => standing.driver.lastName === bet.driver.lastName);
        if (driverStanding) {
            const odds = bet.driver.seasonOdds;
            const winnings = bet.amount * odds;
            playerMoney += winnings;
            document.getElementById('betResult').innerHTML += `Gratulálok! ${winnings} a teljes szezonú fogadásog ${bet.driver.firstName} ${bet.driver.lastName} versenyzőre nyert!<br>`;
        } else {
            playerMoney -= bet.amount;
            document.getElementById('betResult').innerHTML += `Sajnos ${bet.driver.firstName} ${bet.driver.lastName} nem nyerte meg a bajnokságot.<br>`;
        }
    });
    seasonLongBets = []; // Clear season-long bets after settling
    document.getElementById('betResult').innerHTML = '';
}

// Function to calculate race results based on season odds
function calculateRaceResults() {
    let raceResults = [];

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

    // Calculate race results based on driver's odds
    raceResults.sort((a, b) => a.driver.seasonOdds - b.driver.seasonOdds);

    let winnerCount = 0;
    for (let i = 0; i < raceResults.length; i++) {
        if (raceResults[i].result === 'Winner') {
            winnerCount++;
        }
    }

    if (winnerCount !== 1) {
        let winnerIndex = Math.floor(Math.random() * raceResults.length);
        while (raceResults[winnerIndex].result === 'Crashed') {
            winnerIndex = Math.floor(Math.random() * raceResults.length);
        }
        raceResults[winnerIndex].result = 'Winner';
    }

    shuffleArray(raceResults);

    let startPosCounter = 2;

    raceResults.forEach((result, _) => {
        if (result.result === 'Crashed') {
            result.position = 'DNF';
        } else if (result.result === 'Winner') {
            result.position = 1;
        } else {
            result.position = startPosCounter;
            startPosCounter++;
        }
    });

    raceResults = selectionSortByPosition(raceResults);
    return raceResults;
}

//Function to sort raceResults array by position
function selectionSortByPosition(array){
    let dnfArray = [];
    if(array.length <= 1) return array;

    for(let i = 0; i < array.length;i++){
        if(array[i].position == "DNF" && !dnfArray.includes(array[i])){
            dnfArray.push(array[i])
            continue;
        };
        for(let j = i; j < array.length;j++){
            if(array[j].position == "DNF" && !dnfArray.includes(array[j])){
                dnfArray.push(array[j])
                continue;
            };
            if(array[i].position < array[j].position) array = swapArrayPlaces(array,i,j);
            if(array[i].position > array[j].position) array = swapArrayPlaces(array,j,i);
        }
    }
    return [
        ...array.filter(el =>{
        return el.position != "DNF"
    }),
    ...dnfArray
];
}

//Function to swap array values between 2 index
function swapArrayPlaces(resultArray,ix,iy){
    let temp = resultArray[ix];
    resultArray[ix] = resultArray[iy];
    resultArray[iy] = temp;
    return resultArray
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Adjust shuffling based on season odds
        const probability1 = 1 / array[i].driver.seasonOdds;
        const probability2 = 1 / array[j].driver.seasonOdds;
        if (Math.random() < probability1 / (probability1 + probability2)) {
            [array[i], array[j]] = [array[j], array[i]];
        }
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
    console.log("Displaying race results...");
    if (!race || !race.name) {
        console.error("Error: Race object is undefined or does not have a name property.");
        return;
    }

    // console.log(raceResults)

    const raceResultsContainer = document.getElementById('race-results-container');
    const raceHeader = document.createElement('h3');
    raceHeader.textContent = `Race ${currentRaceIndex + 1}: ${race.name}`;
    raceResultsContainer.appendChild(raceHeader);

    const resultsList = document.createElement('ul');
    raceResults.forEach(result => {
        // sortByFinishPlace(result)
        const position = result.position === 'DNF' ? 'DNF' : `${result.position}`;
        const listItem = document.createElement('li');
        listItem.innerHTML = `<img src="images/${result.driver.firstName}-${result.driver.lastName}.png" alt="" style="width: 60px;"> ${result.driver.firstName} ${result.driver.lastName}: ${result.result} - Position: ${position}`;
        resultsList.appendChild(listItem);
    });
    raceResultsContainer.appendChild(resultsList);
}

function sortByFinishPlace(result){
    console.log(result.position);
}

// Event listener for simulating single race
document.getElementById('simulate-race').addEventListener('click', simulateSingleRace);

// Event listener for simulating remaining races
document.getElementById('simulate-races').addEventListener('click', simulateRemainingRaces);

// Event listener for simulating all races
document.getElementById('simulate-all-races').addEventListener('click', simulateSeason);

// Function to display championship standings
function displayChampionshipStandings() {
    console.log("Displaying championship standings...");

    const standingsContainer = document.getElementById('championship-standings-container');
    standingsContainer.innerHTML = ''; // Clear previous standings

    const sortedStandings = Object.values(championshipStandings).sort((a, b) => b.points - a.points);

    const standingsHeader = document.createElement('h3');
    standingsHeader.textContent = 'Championship Standings';
    standingsContainer.appendChild(standingsHeader);

    const standingsList = document.createElement('ol');
    let szamozas = 1
    sortedStandings.forEach((standing, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${szamozas}. <img src="images/${standing.driver.firstName}-${standing.driver.lastName}.png" alt="" style="width: 60px;"> ${standing.driver.firstName} ${standing.driver.lastName} - ${standing.points} points`;
        standingsList.appendChild(listItem);
        szamozas++;
    });
    standingsContainer.appendChild(standingsList);
}

// Function to display player money
function displayPlayerMoney() {
    console.log("Displaying player money...");
    const moneyDisplay = document.getElementById('money-display');
    moneyDisplay.textContent = `Money: $${playerMoney}`;
}

// Function to initialize the application
function init() {
    renderDriverCards(drivers);
    renderBettingOptions();
    displayChampionshipStandings();
    displayPlayerMoney();
}

// Initialize the application
init();