let stockSearchInput = document.querySelector(".search");
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

var rawData = [];
let filteredData = [];

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

(async function () {
  rawData = await fetch("https://get-stock-data.leafland.co.nz/")
    .then((response) => response.json())
    .catch((error) => {});

  await displayData(rawData.values);

  stockSearchInput.removeAttribute("disabled");

  let listTypingTimer;
  let listDoneTypingInterval = 500;

  stockSearchInput.addEventListener("input", (event) => {
    clearTimeout(listTypingTimer);

    listTypingTimer = setTimeout(() => {
      filterData(rawData.values);
    }, listDoneTypingInterval);
  });

  if (stockListType === "wholesale") {
    let csv = "";
    csv += `"Botanical Name","Common Name","Grade","$R","$W","Height","Standard Height","Ready","In Production"\r\n`;
    for (let j = 0; j < rawData.values.length; j++) {
      for (let i = 0; i < 10; i++) {
        if (i !== 4) {
          csv += '"' + rawData.values[j][i] + '"' + ",";
        }
      }
      csv += "\r\n";
    }

    let myBlob = new Blob([csv], { type: "text/csv" });

    let url = window.URL.createObjectURL(myBlob);
    document.querySelector("#download-stock-list").href = url;
    document.querySelector("#download-stock-list").download = "leafland-stock-list.csv";

    document.querySelector("#download-stock-list").style.setProperty("pointer-events", "auto");
    document.querySelector("#download-stock-list").style.setProperty("opacity", "1");
  }
})();

async function displayData(dataSet) {
  if (dataSet.length < 1) {
    stockDataDiv.innerHTML = `<p class="message">No results found.</p>`;
  } else {
    stockDataDiv.innerHTML = "";

    let table = document.createElement("table");

    for (let i = 0; i < dataSet.length; i++) {
      if (i > dataSet.length - 1) {
        break;
      }

      if (i === 0) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.append(cell);
        });
        table.append(row);
      }

      if (!dataSet[i][0].includes("?")) {
        let row = document.createElement("tr");

        for (let j = 0; j < 10; j++) {
          if (j === 0) {
            let cell = document.createElement("td");
            let link = document.createElement("a");

            treeData.forEach((tree) => {
              if (tree.code === dataSet[i][13]) {
                link.href = `/trees/${tree.url}/`;
                link.innerHTML = tree.fullName;
              }
            });
            if (link.textContent !== "") {
              cell.append(link);
            } else {
              cell.textContent = dataSet[i][j].replaceAll('"', "");
            }

            row.append(cell);
          } else {
            if (stockListType === "retail") {
              if (j !== 4 && j !== 5) {
                let cell = document.createElement("td");

                cell.textContent = dataSet[i][j].replaceAll('"', "");

                row.append(cell);
              }
            } else {
              if (j !== 4) {
                let cell = document.createElement("td");

                cell.textContent = dataSet[i][j].replaceAll('"', "");

                row.append(cell);
              }
            }
          }
        }

        table.append(row);
      }
    }

    stockDataDiv.append(table);
  }
}

function filterData(stockData) {
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

  if (stockSearchInput.value.length === 0 && compareArray.length === 0 && hideFound === false) {
    displayData(rawData.values);
  } else {
    if (stockSearchInput.value.length === 0) {
      for (let j = 0; j < stockData.length; j++) {
        for (let i = 0; i < compareArray.length; i++) {
          if (stockData[j][12].toLowerCase().search(compareArray[i]) !== -1) {
            if (i === compareArray.length - 1) {
              if (hideFound) {
                if (parseInt(stockData[j][8]) > 0 || parseInt(stockData[j][9]) > 0) {
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
            data[0].toLowerCase().includes(stockSearchInput.value.toLowerCase()) ||
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
            (data[0].toLowerCase().includes(stockSearchInput.value.toLowerCase()) ||
              data[1].toLowerCase().includes(stockSearchInput.value.toLowerCase()))
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

    displayData(filteredData);
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
  filterData(rawData.values);
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

  filterData(rawData.values);
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

  filterData(rawData.values);
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

  filterData(rawData.values);
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

  filterData(rawData.values);
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

  filterData(rawData.values);
});
