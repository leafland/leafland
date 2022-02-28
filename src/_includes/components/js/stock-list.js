// init document elements
let retailSearchInput = document.querySelector(".search");
let nextButton = document.querySelector("#next");
let prevButton = document.querySelector("#prev");
let resultTotals = document.querySelector("#result-totals");
let stockDataDiv = document.querySelector("#stock-data");

let hideOutOfStock = document.querySelector("#hide-out-of-stock");
let filterEdible = document.querySelector("#filter-edible");
let filterNative = document.querySelector("#filter-native");

let stockListType = "";

if (window.location.href.search("retail") === -1) {
  stockListType = "wholesale";
} else {
  stockListType = "retail";
}
// init other variables
var stockData = [];
let filteredData = [];
let retailStart = 0;
let retailEnd = 24;

let heading = [];

if (stockListType === "retail") {
  heading = [
    "BOTANICAL NAME",
    "COMMON NAME",
    "GRADE",
    "$R",
    "HEIGHT (m)",
    "STANDARD (m)",
    "READY",
    "COMING ON",
  ];
} else {
  heading = [
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
}

window.addEventListener("loginUpdated", () => {
  (async function () {
    stockData = await fetch(
      "https://api.leafland.co.nz/default/get-stock-data-file?type=list"
    )
      .then((response) => response.json())
      .catch((error) => {});

    await displayData(stockData, retailStart, retailEnd);

    retailSearchInput.removeAttribute("disabled");
    retailSearchInput.addEventListener("input", (e) => {
      if (e.target.value.length <= 0) {
        if (filteredData.length > 0) {
          displayData(filteredData, retailStart, retailEnd);
        } else {
          displayData(stockData, retailStart, retailEnd);
        }
      } else {
        searchRetailData(e.target.value);
      }
    });
  })();
});

// display passed data in a table
async function displayData(dataSet, retailStart, retailEnd) {
  if (dataSet.length < 1) {
    stockDataDiv.innerHTML = `<h2 class="message">No results found</h2>`;
    resultTotals.innerHTML = `Showing 0 to 0 of 0 results`;
    nextButton.disabled = true;
    prevButton.disabled = true;
  } else {
    stockDataDiv.innerHTML = "";

    let table = document.createElement("table");

    for (let i = retailStart; i < retailEnd + 1; i++) {
      // if we reach the end of our dataset, stop iterating
      if (i > dataSet.length - 1) {
        break;
      }

      // on the first iteration, create our heading row. otherwise, create a row with our dataset at i
      if (i === retailStart) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.appendChild(cell);
        });
        table.appendChild(row);
      }

      let row = document.createElement("tr");

      if (stockListType === "retail") {
        for (let j = 0; j < 10; j++) {
          if (j !== 4 && j !== 5) {
            let cell = document.createElement("td");

            cell.textContent = dataSet[i][j];

            row.appendChild(cell);
          }
        }
      } else {
        for (let j = 0; j < 10; j++) {
          let cell = document.createElement("td");

          cell.textContent = dataSet[i][j];

          row.appendChild(cell);
        }
      }

      table.appendChild(row);
    }

    stockDataDiv.appendChild(table);
    resultTotals.innerHTML = `Showing ${retailStart + 1} to ${
      retailEnd > dataSet.length ? dataSet.length : retailEnd + 1
    } of ${dataSet.length} results`;
  }

  if (retailStart === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (dataSet.length !== 0) {
    if (retailEnd >= dataSet.length - 1) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }
  }
}

// a simple search for the user to filter the results
function searchRetailData(input) {
  if (input.length > 0) {
    if (filteredData.length > 0) {
      filteredData = filteredData.filter((data) => {
        if (data[0] != undefined) {
          if (
            data[0].toLowerCase().includes(input.toLowerCase()) ||
            data[1].toLowerCase().includes(input.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } else {
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
    }

    resetStartEnd();
    displayData(filteredData, retailStart, retailEnd);
  }
}

function resetStartEnd() {
  retailStart = 0;
  retailEnd = 24;
}

// init event listeners

nextButton.addEventListener("click", () => {
  retailStart += 25;
  retailEnd += 25;

  if (filteredData.length > 1) {
    displayData(filteredData, retailStart, retailEnd);
  } else {
    displayData(stockData, retailStart, retailEnd);
  }
});

prevButton.addEventListener("click", () => {
  retailStart -= 25;
  retailEnd -= 25;

  if (retailStart < 0 || retailEnd < 0) {
    resetStartEnd();
  }

  if (filteredData.length > 1) {
    displayData(filteredData, retailStart, retailEnd);
  } else {
    displayData(stockData, retailStart, retailEnd);
  }
});

function filterData() {
  filteredData = [];
  if (hideOutOfStock.checked === true) {
    if (filterNative.checked === true && filterEdible.checked === true) {
      stockData.forEach((data) => {
        if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
          if (data[11] !== undefined) {
            if (
              data[11].toLowerCase().search("edible") !== -1 &&
              data[11].toLowerCase().search("native") !== -1
            ) {
              filteredData.push(data);
            }
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    } else if (filterNative.checked === true) {
      stockData.forEach((data) => {
        if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
          if (data[11] !== undefined) {
            if (data[11].toLowerCase().search("native") !== -1) {
              filteredData.push(data);
            }
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    } else if (filterEdible.checked === true) {
      stockData.forEach((data) => {
        if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
          if (data[11] !== undefined) {
            if (data[11].toLowerCase().search("edible") !== -1) {
              filteredData.push(data);
            }
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    } else {
      stockData.forEach((data) => {
        if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
          filteredData.push(data);
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    }
  } else if (filterNative.checked === true) {
    if (filterEdible.checked === true) {
      stockData.forEach((data) => {
        if (data[11] !== undefined) {
          if (
            data[11].toLowerCase().search("edible") !== -1 &&
            data[11].toLowerCase().search("native") !== -1
          ) {
            filteredData.push(data);
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    } else {
      stockData.forEach((data) => {
        if (data[11] !== undefined) {
          if (data[11].toLowerCase().search("native") !== -1) {
            filteredData.push(data);
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    }
  } else if (filterEdible.checked === true) {
    if (filterNative.checked === true) {
      stockData.forEach((data) => {
        if (data[11] !== undefined) {
          if (
            data[11].toLowerCase().search("edible") !== -1 &&
            data[11].toLowerCase().search("native") !== -1
          ) {
            filteredData.push(data);
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    } else {
      stockData.forEach((data) => {
        if (data[11] !== undefined) {
          if (data[11].toLowerCase().search("edible") !== -1) {
            filteredData.push(data);
          }
        }
      });

      resetStartEnd();
      displayData(filteredData, retailStart, retailEnd);
    }
  } else {
    resetStartEnd();
    displayData(stockData, retailStart, retailEnd);
  }
}

hideOutOfStock.addEventListener("input", () => {
  filterData();
});

filterEdible.addEventListener("input", () => {
  filterData();
  // filteredData = [];
  // if (filterEdible.checked === true) {
  //   stockData.forEach((data) => {
  //     if (data[11] !== undefined) {
  //       if (data[11].toLowerCase().search("edible") !== -1) {
  //         filteredData.push(data);
  //       }
  //     }
  //   });

  //   resetStartEnd();
  //   displayData(filteredData, retailStart, retailEnd);
  // } else {
  //   resetStartEnd();
  //   displayData(stockData, retailStart, retailEnd);
  // }
});

filterNative.addEventListener("input", () => {
  filterData();
  // filteredData = [];
  // if (filterNative.checked === true) {
  //   stockData.forEach((data) => {
  //     if (data[11] !== undefined) {
  //       if (data[11].toLowerCase().search("native") !== -1) {
  //         filteredData.push(data);
  //       }
  //     }
  //   });

  //   resetStartEnd();
  //   displayData(filteredData, retailStart, retailEnd);
  // } else {
  //   resetStartEnd();
  //   displayData(stockData, retailStart, retailEnd);
  // }
});
