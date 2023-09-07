//Connecting to apiEndpoint
const apiEndpoint = 'http://localhost:8080/v1/api/players';

//defining constants that I will reference in future functions
const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");
let availableKeywords;
let results;
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
      name: item.name,
      country: item.country
    }));
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
let rowCount = 0;
function checkGuess(name){
    const newRow = document.createElement("tr");
    
    // Increment the row count
    rowCount++;
    
    // Create table cells (columns) and populate them
    const cell1 = document.createElement("td");
    cell1.textContent = inputBox.value;
    const cell2 = document.createElement("td");
    cell2.textContent = "Denmark";
    const cell3 = document.createElement("td");
    cell3.textContent = "6'4";
    
    // Append cells to the row
    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    
    // Append the new row to the table body
    tableBody.appendChild(newRow);
    
    // Clear the input box
    inputBox.value = "";
}