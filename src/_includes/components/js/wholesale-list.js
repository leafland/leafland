// init document elements
let wholesaleSearchInput = document.querySelector(".search");
let nextButton = document.querySelector("#next");
let prevButton = document.querySelector("#prev");
let resultTotals = document.querySelector("#result-totals");
let stockDataDiv = document.querySelector("#stock-data");

// init other variables
var stockData = [];
let filteredData = [];
let wholesaleStart = 0;
let wholesaleEnd = 24;
let heading = [
  "BOTANICAL NAME",
  "COMMON NAME",
  "GRADE",
  "$R",
  "$W-10%",
  "$W-20%",
  "HEIGHT (m)",
  "STANDARD (m)",
  "READY",
  "COMING ON",
];

window.addEventListener("loginUpdated", () => {
  (async function () {
    stockData = await fetch(
      "https://api.leafland.co.nz/default/get-stock-data-file?type=list"
    )
      .then((response) => response.json())
      .catch((error) => {});

    await displayData(stockData, wholesaleStart, wholesaleEnd);

    wholesaleSearchInput.removeAttribute("disabled");
    wholesaleSearchInput.addEventListener("input", (e) => {
      if (e.target.value.length <= 0) {
        displayData(stockData, wholesaleStart, wholesaleEnd);
      } else {
        searchWholesaleData(e.target.value);
      }
    });

    document.body.classList.add("page-loaded");
  })();
});

// display passed data in a table
async function displayData(dataSet, wholesaleStart, wholesaleEnd) {
  if (dataSet.length < 1) {
    stockDataDiv.innerHTML = `<h2 class="message">No results found</h2>`;
    resultTotals.innerHTML = `Showing 0 to 0 of 0 results`;
    nextButton.disabled = true;
    prevButton.disabled = true;
  } else {
    stockDataDiv.innerHTML = "";

    let table = document.createElement("table");

    for (let i = wholesaleStart; i < wholesaleEnd + 1; i++) {
      // if we reach the end of our dataset, stop iterating
      if (i > dataSet.length - 1) {
        break;
      }

      // on the first iteration, create our heading row. otherwise, create a row with our dataset at i
      if (i === wholesaleStart) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.appendChild(cell);
        });
        table.appendChild(row);
      }
      let row = document.createElement("tr");

      for (let j = 0; j < 10; j++) {
        let cell = document.createElement("td");

        cell.textContent = dataSet[i][j];

        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    stockDataDiv.appendChild(table);
    resultTotals.innerHTML = `Showing ${wholesaleStart + 1} to ${
      wholesaleEnd > dataSet.length ? dataSet.length : wholesaleEnd + 1
    } of ${dataSet.length} results`;
  }

  if (wholesaleStart === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (dataSet.length !== 0) {
    if (wholesaleEnd >= dataSet.length - 1) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }
  }
}

// a simple search for the user to filter the results
function searchWholesaleData(input) {
  if (input.length > 0) {
    filteredData = [];

    stockData.forEach((data) => {
      if (data[0] != undefined) {
        if (
          data[0].toLowerCase().includes(input.toLowerCase()) ||
          data[1].toLowerCase().includes(input.toLowerCase())
        ) {
          filteredData.push(data);
        }
      }
    });

    stockDataDiv.innerHTML = "";
    resetStartEnd();
    displayData(filteredData, wholesaleStart, wholesaleEnd);
  }
}

function resetStartEnd() {
  wholesaleStart = 0;
  wholesaleEnd = 24;
}

// init event listeners

nextButton.addEventListener("click", () => {
  wholesaleStart += 25;
  wholesaleEnd += 25;

  if (filteredData.length > 1 && wholesaleSearchInput.value.length > 0) {
    displayData(filteredData, wholesaleStart, wholesaleEnd);
  } else {
    displayData(stockData, wholesaleStart, wholesaleEnd);
  }
});

prevButton.addEventListener("click", () => {
  wholesaleStart -= 25;
  wholesaleEnd -= 25;

  if (wholesaleStart < 0 || wholesaleEnd < 0) {
    resetStartEnd();
  }

  if (filteredData.length > 1 && wholesaleSearchInput.value.length > 0) {
    displayData(filteredData, wholesaleStart, wholesaleEnd);
  } else {
    displayData(stockData, wholesaleStart, wholesaleEnd);
  }
});
