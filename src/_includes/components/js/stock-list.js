// init document elements
let stockSearchInput = document.querySelector(".search");
let nextButton = document.querySelector("#next");
let prevButton = document.querySelector("#prev");
let resultTotals = document.querySelector("#result-totals");
let stockDataDiv = document.querySelector("#stock-data");

let hideOutOfStock = document.querySelector("#hide-out-of-stock");
let filterEdible = document.querySelector("#filter-edible");
let filterNative = document.querySelector("#filter-native");
let filterDeciduous = document.querySelector("#filter-deciduous");
let filterEvergreen = document.querySelector("#filter-evergreen");
let filterSemiEvergreen = document.querySelector("#filter-semi-evergreen");

let compareValue = "";
let stockListType = "";

if (window.location.href.search("retail") === -1) {
  stockListType = "wholesale";
} else {
  stockListType = "retail";
}
// init other variables
var stockData = [];
let filteredData = [];
let stockStart = 0;
let stockEnd = 24;

let heading = [];

if (stockListType === "retail") {
  heading = [
    "Botanical Name",
    "Common Name",
    "Grade",
    "$Retail",
    "Height (m)",
    "Standard Height (m)",
    "Ready",
    "In Production",
  ];
} else {
  heading = [
    "Botanical Name",
    "Common Name",
    "Grade",
    "$Retail",
    "$Wholesale",
    "Height (m)",
    "Standard Height (m)",
    "Ready",
    "In Production",
  ];
}

window.addEventListener("loginUpdated", () => {
  (async function () {
    stockData = await fetch(
      "https://api.leafland.co.nz/default/get-stock-data-file?type=list"
    )
      .then((response) => response.json())
      .catch((error) => {});

    await displayData(stockData, stockStart, stockEnd);

    stockSearchInput.removeAttribute("disabled");
    stockSearchInput.addEventListener("input", (e) => {
      filterData();
    });
  })();
});

// display passed data in a table
async function displayData(dataSet, stockStart, stockEnd) {
  if (dataSet.length < 1) {
    stockDataDiv.innerHTML = `<h2 class="message">No results found</h2>`;
    resultTotals.innerHTML = `Showing 0 to 0 of 0 results`;
    nextButton.disabled = true;
    prevButton.disabled = true;
  } else {
    stockDataDiv.innerHTML = "";

    let table = document.createElement("table");

    for (let i = stockStart; i < stockEnd + 1; i++) {
      // if we reach the stockEnd of our dataset, stop iterating
      if (i > dataSet.length - 1) {
        break;
      }

      // on the first iteration, create our heading row. otherwise, create a row with our dataset at i
      if (i === stockStart) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.append(cell);
        });
        table.append(row);
      }

      let row = document.createElement("tr");

      if (stockListType === "retail") {
        for (let j = 0; j < 10; j++) {
          if (j !== 4 && j !== 5) {
            let cell = document.createElement("td");

            cell.textContent = dataSet[i][j];

            row.append(cell);
          }
        }
      } else {
        for (let j = 0; j < 10; j++) {
          if (j !== 4) {
            let cell = document.createElement("td");

            cell.textContent = dataSet[i][j];

            row.append(cell);
          }
        }
      }

      table.append(row);
    }

    stockDataDiv.append(table);
    resultTotals.innerHTML = `Showing ${stockStart + 1} to ${
      stockEnd > dataSet.length ? dataSet.length : stockEnd + 1
    } of ${dataSet.length} results`;
  }

  if (stockStart === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (dataSet.length !== 0) {
    if (stockEnd >= dataSet.length - 1) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }
  }
}

function resetStartEnd() {
  stockStart = 0;
  stockEnd = 24;
}

// init event listeners

nextButton.addEventListener("click", () => {
  stockStart += 25;
  stockEnd += 25;

  if (filteredData.length > 1) {
    displayData(filteredData, stockStart, stockEnd);
  } else {
    displayData(stockData, stockStart, stockEnd);
  }
});

prevButton.addEventListener("click", () => {
  stockStart -= 25;
  stockEnd -= 25;

  if (stockStart < 0 || stockEnd < 0) {
    resetStartEnd();
  }

  if (filteredData.length > 1) {
    displayData(filteredData, stockStart, stockEnd);
  } else {
    displayData(stockData, stockStart, stockEnd);
  }
});

function filterData() {
  filteredData = [];

  let compareArray = compareValue.split(",");
  let hideFound = false;

  if (compareArray.includes("hide")) {
    compareArray = compareArray.filter((item) => {
      return item !== "hide";
    });
    hideFound = true;
  }

  compareArray.pop();

  if (
    stockSearchInput.value.length === 0 &&
    compareArray.length === 0 &&
    hideFound === false
  ) {
    resetStartEnd();
    displayData(stockData, stockStart, stockEnd);
  } else {
    if (stockSearchInput.value.length === 0) {
      for (let j = 0; j < stockData.length; j++) {
        for (let i = 0; i < compareArray.length; i++) {
          if (stockData[j][12].toLowerCase().search(compareArray[i]) !== -1) {
            if (i === compareArray.length - 1) {
              if (hideFound) {
                if (
                  parseInt(stockData[j][8]) > 0 ||
                  parseInt(stockData[j][9]) > 0
                ) {
                  filteredData.push(stockData[j]);
                }
              } else {
                filteredData.push(stockData[j]);
              }
            }
          } else {
            break;
          }
        }
      }

      if (hideFound) {
        if (filteredData.length > 0) {
          filteredData = filteredData.filter((item) => {
            if (parseInt(item[8]) > 0 || parseInt(item[9]) > 0) {
              return true;
            } else {
              return false;
            }
          });
        } else if (compareArray.length === 0) {
          filteredData = stockData.filter((item) => {
            if (parseInt(item[8]) > 0 || parseInt(item[9]) > 0) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          filteredData = [];
        }
      }
    } else if (compareArray.length === 0) {
      stockData.forEach((data) => {
        if (data[0] != undefined) {
          if (
            data[0]
              .toLowerCase()
              .includes(stockSearchInput.value.toLowerCase()) ||
            data[1].toLowerCase().includes(stockSearchInput.value.toLowerCase())
          ) {
            if (hideFound) {
              if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
                filteredData.push(data);
              }
            } else {
              filteredData.push(data);
            }
          }
        }
      });
    } else {
      filteredData = stockData.filter((data) => {
        for (let i = 0; i < compareArray.length; i++) {
          if (
            data[12].toLowerCase().search(compareArray[i]) !== -1 &&
            data[0] != undefined &&
            (data[0]
              .toLowerCase()
              .includes(stockSearchInput.value.toLowerCase()) ||
              data[1]
                .toLowerCase()
                .includes(stockSearchInput.value.toLowerCase()))
          ) {
            if (i === compareArray.length - 1) {
              if (hideFound) {
                if (parseInt(data[8]) > 0 || parseInt(data[9]) > 0) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            }
          } else {
            return false;
          }
        }
      });
    }
    resetStartEnd();
    displayData(filteredData, stockStart, stockEnd);
  }
}

hideOutOfStock.addEventListener("input", () => {
  compareValue = "";

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterEdible.checked === true) {
    compareValue += "edible,";
  }
  if (filterNative.checked === true) {
    compareValue += "native,";
  }
  if (filterDeciduous.checked === true) {
    compareValue += "deciduous,";
  }
  if (filterEvergreen.checked === true) {
    compareValue += "evergreen,";
  }
  if (filterSemiEvergreen.checked === true) {
    compareValue += "semi-evergreen,";
  }
  filterData();
});

filterEdible.addEventListener("input", () => {
  compareValue = "";

  if (filterEdible.checked === true) {
    filterNative.disabled = true;
    compareValue += "edible,";
  } else {
    filterNative.disabled = false;
  }

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterNative.checked === true) {
    compareValue += "native,";
  }
  if (filterDeciduous.checked === true) {
    compareValue += "deciduous,";
  }
  if (filterEvergreen.checked === true) {
    compareValue += "evergreen,";
  }
  if (filterSemiEvergreen.checked === true) {
    compareValue += "semi-evergreen,";
  }

  filterData();
});

filterNative.addEventListener("input", () => {
  compareValue = "";

  if (filterNative.checked === true) {
    filterEdible.disabled = true;
    compareValue += "native,";
  } else {
    filterEdible.disabled = false;
  }

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterEdible.checked === true) {
    compareValue += "edible,";
  }
  if (filterDeciduous.checked === true) {
    compareValue += "deciduous,";
  }
  if (filterEvergreen.checked === true) {
    compareValue += "evergreen,";
  }
  if (filterSemiEvergreen.checked === true) {
    compareValue += "semi-evergreen,";
  }

  filterData();
});

filterDeciduous.addEventListener("input", () => {
  compareValue = "";

  if (filterDeciduous.checked === true) {
    filterEvergreen.disabled = true;
    filterSemiEvergreen.disabled = true;
    compareValue += "deciduous,";
  } else {
    filterEvergreen.disabled = false;
    filterSemiEvergreen.disabled = false;
  }

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterNative.checked === true) {
    compareValue += "native,";
  }
  if (filterEdible.checked === true) {
    compareValue += "edible,";
  }
  if (filterEvergreen.checked === true) {
    compareValue += "evergreen,";
  }
  if (filterSemiEvergreen.checked === true) {
    compareValue += "semi-evergreen,";
  }

  filterData();
});

filterEvergreen.addEventListener("input", () => {
  compareValue = "";

  if (filterEvergreen.checked === true) {
    filterDeciduous.disabled = true;
    filterSemiEvergreen.disabled = true;
    compareValue += "evergreen,";
  } else {
    filterDeciduous.disabled = false;
    filterSemiEvergreen.disabled = false;
  }

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterNative.checked === true) {
    compareValue += "native,";
  }
  if (filterEdible.checked === true) {
    compareValue += "edible,";
  }
  if (filterDeciduous.checked === true) {
    compareValue += "deciduous,";
  }
  if (filterSemiEvergreen.checked === true) {
    compareValue += "semi-evergreen,";
  }

  filterData();
});

filterSemiEvergreen.addEventListener("input", () => {
  compareValue = "";

  if (filterSemiEvergreen.checked === true) {
    filterDeciduous.disabled = true;
    filterEvergreen.disabled = true;
    compareValue += "semi-evergreen,";
  } else {
    filterDeciduous.disabled = false;
    filterEvergreen.disabled = false;
  }

  if (hideOutOfStock.checked === true) {
    compareValue += "hide,";
  }
  if (filterNative.checked === true) {
    compareValue += "native,";
  }
  if (filterEdible.checked === true) {
    compareValue += "edible,";
  }
  if (filterDeciduous.checked === true) {
    compareValue += "deciduous,";
  }
  if (filterEvergreen.checked === true) {
    compareValue += "evergreen,";
  }

  filterData();
});
