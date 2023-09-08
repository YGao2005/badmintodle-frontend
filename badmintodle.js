//Connecting to apiEndpoint
const apiEndpoint = 'http://localhost:8080/v1/api/players';

//defining constants that I will reference in future functions
const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");
let availableKeywords;
let results;
let allPlayers;
let answer;
//Getting the data in dataArray and making a new array called availableKeywords
fetch(apiEndpoint)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); 
  })
  .then((data) => {
    const dataArray = data.map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country,
        events: item.events,
        racket: item.racket,
        handedness: item.handedness,
        ranking: item.ranking,
        age: item.age
    }));
    allPlayers = dataArray;
    answer = dataArray[0];
    console.log(answer);
    availableKeywords = dataArray.map((item) => item.name);
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });


//function to check if what's being typed in the search bar matches anything in the availableKeywords array
inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        result = availableKeywords.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    display(result);
    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

//displaying the results from the onkeyup function below the search bar
function display(result) {
    let resultCount = 0;
    const content = result.map((list, index) => {
        resultCount++;
        return "<li onclick=selectInput(this) id='recommendation-item-" + index + "' class='recommendation-item'>" + list + "</li>";
    });
    results = resultCount;
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}


//function to change the searchbar value to what you clicked and hide the searchbar
function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}

//function to detect arrow keys and move search selections up and down accordingly
let selectedItemIndex = -1; // Initialize to -1 for no selection

inputBox.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (selectedItemIndex > 0) {
                // Move selection up
                selectedItemIndex--;
                highlightItem(selectedItemIndex);
            }
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (selectedItemIndex < results - 1) {
                // Move selection down
                selectedItemIndex++;
                highlightItem(selectedItemIndex);
            }
            break;
    }
});

document.addEventListener('keydown', function (event){
    switch (event.key) {
        case 'Enter':
                // Handle Enter key press here
            if (selectedItemIndex !== -1 && inputBox.value.trim() !== "") {
                // An item is selected, perform an action (e.g., select the item)
                const selectedItem = document.getElementById('recommendation-item-' + selectedItemIndex);
                selectInput(selectedItem);
                checkGuess(inputBox.value);
            } else {
                checkGuess(inputBox.value);
                // No item selected, perform a search or other action
                // Replace this with your desired functionality
                console.log('Enter key pressed with no item selected');
            }
            break;
    }
});

inputBox.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            // Do nothing on keyup for arrow keys to keep the highlight
            break;
    }
});

//function to highlight the selected item

function highlightItem(index) {
    // Remove the "highlighted" class from all items
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    for (let i = 0; i < recommendationItems.length; i++) {
        recommendationItems[i].classList.remove('highlighted');
    }

    // Add the "highlighted" class to the item at the specified index
    const selectedItem = document.getElementById('recommendation-item-' + index);
    if (selectedItem) {
        selectedItem.classList.add('highlighted');
    }
}

const tableBody = document.getElementById("table-body");

function checkGuess(name){
    // Get all information
    const id = getIdFromName(name);
    const country = getCountryFromId(id);
    const events = getEventsFromId(id);
    const racket = getRacketFromId(id);
    const handedness = getHandednessFromId(id);
    const ranking = getRankingFromId(id);
    const age = getAgeFromId(id);

    nameAns = answer.name === name;
    countryAns = answer.country === country;
    racketAns = answer.racket === racket;
    handednessAns = answer.handedness === handedness;
    rankingAns = answer.ranking === ranking;
    ageAns = answer.age === age;
    if(answer.events === events){
        eventsAns = "correct";
    }
    else if(answer.events.includes(events)){
        eventsAns = "partially";
    }   
    else{
        eventsAns = "incorrect";
    }

    createRow(name, nameAns, country, countryAns, events, eventsAns, racket, racketAns, handedness, handednessAns, ranking, rankingAns, age, ageAns);

    // Clear the input box
    inputBox.value = "";
}

let rowCount = 0;
function createRow(name, nameAns, country, countryAns, events, eventsAns, racket, racketAns, handedness, handednessAns, ranking, rankingAns, age, ageAns){
    // Increment row count, make new row
    rowCount++;
    const newRow = document.createElement("tr");
    
    // Append cells to row and assign class
    const playerName = document.createElement("td");
    playerName.textContent = name;
    playerName.classList.add(getColor(nameAns));

    const playerCountry = document.createElement("td");
    playerCountry.textContent = country;
    playerCountry.classList.add(getColor(countryAns));

    const playerEvents = document.createElement("td");
    playerEvents.textContent = events;
    playerEvents.classList.add(getColor(eventsAns));

    const playerRacket = document.createElement("td");
    playerRacket.textContent = racket;
    playerRacket.classList.add(getColor(racketAns));

    const playerHandedness = document.createElement("td");
    playerHandedness.textContent = handedness;
    playerHandedness.classList.add(getColor(handednessAns));

    const playerRanking = document.createElement("td");
    playerRanking.textContent = ranking;
    playerRanking.classList.add(getColor(rankingAns));

    const playerAge = document.createElement("td");
    playerAge.textContent = age;
    playerAge.classList.add(getColor(ageAns));

    // Append cells
    newRow.appendChild(playerName);
    newRow.appendChild(playerCountry);
    newRow.appendChild(playerEvents);
    newRow.appendChild(playerRacket);
    newRow.appendChild(playerHandedness);
    newRow.appendChild(playerRanking);
    newRow.appendChild(playerAge);

    // Assign colors


    // Append new row
    tableBody.appendChild(newRow);
}

// Method that returns the class name depending on if the check if true, false, or partially
function getColor(matching){
    if(matching === "correct"){
        return "correct";
    }
    else if(matching === "partially"){
        return "partially";
    }
    else if(matching){
        return "correct"
    }
    else{
        return "incorrect"
    }
}

function getIdFromName(nameToFind) {
    const foundItem = allPlayers.find(item => item.name === nameToFind);
    return foundItem ? foundItem.id : null; // Return the id if found, or null if not found
}

function getCountryFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.country : null; // Return the id if found, or null if not found
}

function getEventsFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.events : null; // Return the id if found, or null if not found
}

function getRacketFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.racket : null; // Return the id if found, or null if not found
}

function getHandednessFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.handedness : null; // Return the id if found, or null if not found
}

function getRankingFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.ranking : null; // Return the id if found, or null if not found
}

function getAgeFromId(id) {
    const foundItem = allPlayers.find(item => item.id === id);
    return foundItem ? foundItem.age : null; // Return the id if found, or null if not found
}