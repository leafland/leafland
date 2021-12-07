// init document elements
let freightSearchInput = document.querySelector(".search");
let nextButton = document.querySelector("#next");
let prevButton = document.querySelector("#prev");
let resultTotals = document.querySelector("#result-totals");
let freightDataDiv = document.querySelector("#freight-data");

// init other variables
let range = "Sheet1!A:C";
let heading = ["LOCATION", "GRADE", "PRICE"];
let filteredData = [];
let freightData = [];
let freightStart = 0;
let freightEnd = 24;

(async function () {
  freightData = await fetch(
    "https://api.leafland.co.nz/default/get-freight-data-file"
  )
    .then((response) => response.json())
    .catch((error) => {});

  await displayData(freightData, freightStart, freightEnd);
  document.body.classList.add("page-loaded");

  freightSearchInput.removeAttribute("disabled");
  freightSearchInput.addEventListener("input", (e) => {
    if (e.target.value.length <= 0) {
      displayData(freightData, freightStart, freightEnd);
    } else {
      searchFreightData(e.target.value);
    }
  });
})();

// display passed data in a table
async function displayData(dataSet, freightStart, freightEnd) {
  if (dataSet.length < 1) {
    freightDataDiv.innerHTML = "";
    freightDataDiv.innerHTML += `<h2 class="message">No results found</h2>`;
    resultTotals.innerHTML = `Showing 0 to 0 of 0 results`;
  } else {
    freightDataDiv.innerHTML = "";

    let table = document.createElement("table");

    for (let i = freightStart; i < freightEnd + 1; i++) {
      // if we reach the end of our dataset, stop iterating
      if (i > dataSet.length - 1) {
        break;
      }

      if (i === freightStart) {
        let row = document.createElement("tr");

        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.appendChild(cell);
        });

        table.appendChild(row);
      }

      let row = document.createElement("tr");

      let locationCell = document.createElement("td");
      locationCell.textContent = dataSet[i][0];

      let gradeCell = document.createElement("td");
      gradeCell.textContent = dataSet[i][1];

      let priceCell = document.createElement("td");
      priceCell.textContent = dataSet[i][2];

      if (dataSet[i][1] === "Minimum") {
        gradeCell.classList.add("minimum-red");
        locationCell.classList.add("minimum-red");
        priceCell.classList.add("minimum-red");
      }

      row.appendChild(locationCell);
      row.appendChild(gradeCell);
      row.appendChild(priceCell);

      table.appendChild(row);
    }

    freightDataDiv.appendChild(table);
    resultTotals.innerHTML = `Showing ${freightStart + 1} to ${
      freightEnd > dataSet.length ? dataSet.length : freightEnd + 1
    } of ${dataSet.length} results`;
  }

  if (freightStart === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (dataSet.length !== 0) {
    if (freightEnd >= dataSet.length - 1) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }
  }
}

// a simple search for the user to filter the results
function searchFreightData(input) {
  if (input.length > 0) {
    filteredData = [];

    freightData.forEach((data) => {
      if (data[0] != undefined) {
        if (data[0].toLowerCase().includes(input.toLowerCase())) {
          filteredData.push(data);
        }
      }
    });

    freightDataDiv.innerHTML = "";
    resetStartEnd();
    displayData(filteredData, freightStart, freightEnd);
  }
}

function resetStartEnd() {
  freightStart = 0;
  freightEnd = 24;
}

// init event listeners

nextButton.addEventListener("click", () => {
  freightStart += 25;
  freightEnd += 25;
  if (filteredData.length > 1 && freightSearchInput.value.length > 0) {
    displayData(filteredData, freightStart, freightEnd);
  } else {
    displayData(freightData, freightStart, freightEnd);
  }
});

prevButton.addEventListener("click", () => {
  freightStart -= 25;
  freightEnd -= 25;
  if (freightStart < 0 || freightEnd < 0) {
    resetStartEnd();
  }
  if (filteredData.length > 1 && freightSearchInput.value.length > 0) {
    displayData(filteredData, freightStart, freightEnd);
  } else {
    displayData(freightData, freightStart, freightEnd);
  }
});
