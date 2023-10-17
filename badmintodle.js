// Now you can use gsap as an object containing GSAP's functionality
//Connecting to apiEndpoint
const apiEndpoint = 'http://ec2-3-17-68-20.us-east-2.compute.amazonaws.com:8080/v1/api/players';


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
    const dataArray = data.map((playerObj) => ({
        id: playerObj.id,
        name: playerObj.name,
        country: playerObj.country,
        events: playerObj.events,
        handedness: playerObj.handedness,
        ranking: playerObj.ranking,
        age: playerObj.age,
        height: playerObj.height,
        gender: playerObj.gender
    }));
    allPlayers = dataArray;
    availableKeywords = dataArray.map((playerObj) => playerObj.name);
    getNewAnswer();
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
    // This else is for when the input goes back to empty, the highlighting should also be reset
    else{
        selectedItemIndex = -1;
    }
    display(result);
    if(!result.length){
        resultsBox.innerHTML = '';
    }
    highlightItem(selectedItemIndex);
}


//displaying the results from the onkeyup function below the search bar
function display(result) {
    let resultCount = 0;
    const content = result.map((list, index) => {
        resultCount++;
        return "<li onclick=selectInput(this) id='recommendation-playerObj-" + index + "' class='recommendation-playerObj'>"
        + list
        + "</li>";
    });
    results = resultCount;
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}


//function to change the searchbar value to what you clicked and hide the searchbar
function selectInput(list){
    inputBox.value = list.innerHTML;
    checkGuess(inputBox.value);
    resultsBox.innerHTML = '';
}

//function to detect arrow keys and move search selections up and down accordingly
let selectedItemIndex = -1; // Initialize to -1 for no selection
document.addEventListener('keydown', function (event){
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
        case 'Enter':
                // If enter is pressed while a player is highlighted, select that player
            if (selectedItemIndex !== -1) {
                // An playerObj is selected, perform an action (e.g., select the playerObj)
                const selectedItem = document.getElementById('recommendation-playerObj-' + selectedItemIndex);
                selectInput(selectedItem);
            } else { // If no player is selected through arrow keys and the search bar has a valid player, check guess
                const lowerCaseArray = availableKeywords.map(item => item.toLowerCase());
                const lowerCaseInput = inputBox.value.toLowerCase();
                let foundIndex = -1; // Initialize to -1 (not found)
                for (let i = 0; i < lowerCaseArray.length; i++) {
                    // Convert the current array element to lowercase for comparison
                    const lowerCaseElement = lowerCaseArray[i].toLowerCase();

                    if (lowerCaseElement === lowerCaseInput) {
                        foundIndex = i; // Set the index where the match occurred
                        break; // Exit the loop when a match is found
                    }
                }
                if(foundIndex !== -1){
                    checkGuess(availableKeywords[foundIndex]);
                }
            }
            break;
    }
});

//function to highlight the selected playerObj
function highlightItem(index) {
    // Remove the "highlighted" class from all items
    const recommendationItems = document.querySelectorAll('.recommendation-playerObj');
    for (let i = 0; i < recommendationItems.length; i++) {
        recommendationItems[i].classList.remove('highlighted');
    }

    // Add the "highlighted" class to the playerObj at the specified index
    const selectedItem = document.getElementById('recommendation-playerObj-' + index);
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
    const handedness = getHandednessFromId(id);
    const ranking = getRankingFromId(id);
    const age = getAgeFromId(id);
    const height = getHeightFromId(id);
    const gender = getGenderFromId(id);

    let nameAns = answer.name === name;
    let countryAns = answer.country === country;
    let handednessAns = answer.handedness === handedness;
    let rankingAns = answer.ranking === ranking;
    let ageAns = answer.age === age;
    let heightAns = answer.height === height;
    let genderAns = answer.gender === gender;
    let eventsAns = answer.events === events;

    createRow(gender, genderAns, name, nameAns, country, countryAns, events, eventsAns, handedness, handednessAns, ranking, rankingAns, age, ageAns, height, heightAns);

    // Check to see if correct
    if (
        getColor(genderAns) === "correct" &&
        getColor(countryAns) === "correct" &&
        getColor(eventsAns) === "correct" &&
        getColor(handednessAns) === "correct" &&
        getColor(rankingAns) === "correct" &&
        getColor(ageAns) === "correct" &&
        getColor(heightAns) === "correct"
    ) {
        // Call another function when all conditions are met
        completedPuzzle();
    }
    
    // Clear the input box
    inputBox.value = "";
}

let rowCount = 0;
function createRow(gender, genderAns, name, nameAns, country, countryAns, events, eventsAns, handedness, handednessAns, ranking, rankingAns, age, ageAns, height, heightAns){
    // Increment row count, make new row
    rowCount++;
    const newRow = document.createElement("tr");

    // Append cells to row and assign class
    const cells = [
        createCell("name", name, nameAns),
        createCell("gender", gender, genderAns),
        createCell("country", country, countryAns),
        createCell("country", events, eventsAns),
        createCell("handedness", handedness, handednessAns),
        createCell("ranking", ranking, rankingAns),
        createCell("age", age, ageAns),
        createCell("height", height, heightAns),
    ];

    gsap.from(cells, { opacity: 0, x: -20, duration: 0.5, ease: Power1.easeInOut, stagger: 0.2 });

    // Append new row
    cells.forEach((cell) => {
        newRow.appendChild(cell);
    });

    // Append the new row to the table
    tableBody.appendChild(newRow);
    

    // Append new row
    tableBody.appendChild(newRow);
}

function createCell(name, attribute, attributeAns){
    const playerAttribute = document.createElement("td");
    if(name === "name"){
        playerAttribute.textContent = attribute;
        playerAttribute.classList.add(name);
    }
    else if(name === "height"){
        playerAttribute.innerHTML = attribute + isHeightHigher(attribute);
        playerAttribute.classList.add(getColor(attributeAns));
    }
    else if(name === "ranking"){
        playerAttribute.innerHTML = attribute + isRankHigher(attribute);
        playerAttribute.classList.add(getColor(attributeAns));
    }
    else if(name === "age"){
        playerAttribute.innerHTML = attribute + isAgeHigher(attribute);
        playerAttribute.classList.add(getColor(attributeAns));
    }
    else{
        playerAttribute.textContent = attribute;
        playerAttribute.classList.add(getColor(attributeAns));
    }
    return playerAttribute;
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

function isHeightHigher(height){
    const guessHeight = heightStringToInches(height);
    const answerHeight = heightStringToInches(answer.height);
    if(guessHeight < answerHeight){
        return "<i class='fa-solid fa-arrow-up'></i>"
    }
    else if(guessHeight > answerHeight){
        return "<i class='fa-solid fa-arrow-down'></i>"
    }
    else{
        return "";
    }
}

function heightStringToInches(heightString) {
    const parts = heightString.split("'");
    if (parts.length !== 2) {
      throw new Error('Invalid height format');
    }
  
    const feet = parseInt(parts[0], 10);
    const inches = parseInt(parts[1].replace('"', ''), 10);
  
    if (isNaN(feet) || isNaN(inches)) {
      throw new Error('Invalid height values');
    }
  
    return feet * 12 + inches;
}

function isAgeHigher(age){
    if(age < answer.age){
        return "<i class='fa-solid fa-arrow-up'></i>"
    }
    else if(age > answer.age){
        return "<i class='fa-solid fa-arrow-down'></i>"
    }
    else{
        return "";
    }
}

function isRankHigher(rank){
    if(rank > answer.ranking){
        return "<i class='fa-solid fa-arrow-up'></i>"
    }
    else if (rank < answer.ranking){
        return "<i class='fa-solid fa-arrow-down'></i>"
    }
    else{
        return "";
    }
}

function getIdFromName(nameToFind) {
    const foundItem = allPlayers.find(playerObj => playerObj.name === nameToFind);
    return foundItem ? foundItem.id : null; // Return the id if found, or null if not found
}

function getCountryFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.country : null; // Return the id if found, or null if not found
}

function getEventsFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.events : null; // Return the id if found, or null if not found
}

function getHandednessFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.handedness : null; // Return the id if found, or null if not found
}

function getRankingFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.ranking : null; // Return the id if found, or null if not found
}

function getAgeFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.age : null; // Return the id if found, or null if not found
}

function getHeightFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.height : null; // Return the id if found, or null if not found
}

function getGenderFromId(id) {
    const foundItem = allPlayers.find(playerObj => playerObj.id === id);
    return foundItem ? foundItem.gender : null; // Return the id if found, or null if not found
}

function completedPuzzle(){
    let answerPopup = document.getElementById("answer");
    answerPopup.textContent = answer.name;
    confetti({
        particleCount: 75,
        spread: 360
    });
    openPopup();
}

let popup = document.getElementById("popup");
let popupContainer = document.getElementById("popup-container");
function openPopup(){
    popup.classList.add("open-popup");
    popupContainer.classList.add("open-container")
}

function closePopup(){
    popup.classList.remove("open-popup");
    popupContainer.classList.remove("open-container")
}

function playAgain(){
    closePopup();
    getNewAnswer();
    clearTable();
}

function getNewAnswer(){
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    answer = allPlayers[randomIndex];
    console.log(answer.name);
}

function clearTable(){
    const tableBody = document.getElementById("table-body");
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}