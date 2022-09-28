let treeWrapper = document.querySelector("#tree-wrapper");
let content = document.querySelector("#content");

let treeFinderStart = 0;
let treeFinderEnd = 23;

let imageDataSubset = [];
let inputsArray = document.querySelectorAll(".filter-input");
let treeFilter = [];
let heightsArray = [];
let widthsArray = [];

let filterSettings = {
  empty: true,
  uses: [],
  tolerates: [],
  types: [],
  winterFoliage: [],
  origin: [],
  soilType: [],
  sunAndShade: [],
  height: [],
  width: [],
  fruitingSeason: [],
  floweringSeason: [],
  flowerColour: [],
  autumnColour: [],
  foliageColour: [],
};

if (sessionStorage.getItem("filterSettings")) {
  filterSettings = JSON.parse(sessionStorage.getItem("filterSettings"));
}

if (filterSettings.empty === false) {
  for (let i = 0; i < inputsArray.length; i++) {
    if (
      filterSettings[`${inputsArray[i].dataset.category}`].includes(
        inputsArray[i].value
      )
    ) {
      inputsArray[i].checked = true;
      inputsArray[i].parentNode.classList.add("option-selected");
    } else {
      inputsArray[i].checked = false;
    }
  }
}

let buttonDiv = document.querySelector("#button-div");
let loadMoreButton = document.querySelector("#load-more");
let returnToTopButton = document.querySelector("#return-to-top");

let filteredData = [];

function updateTreeFilter() {
  filterSettings.uses.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.tolerates.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.types.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.winterFoliage.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.origin.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.soilType.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.sunAndShade.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.height.forEach((value) => {
    treeFilter.push(value);
    heightsArray.push(value);
  });
  filterSettings.width.forEach((value) => {
    treeFilter.push(value);
    widthsArray.push(value);
  });
  filterSettings.fruitingSeason.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.floweringSeason.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.flowerColour.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.autumnColour.forEach((value) => {
    treeFilter.push(value);
  });
  filterSettings.foliageColour.forEach((value) => {
    treeFilter.push(value);
  });
}

function createClearButton(filterInput) {
  let clearFilter = document.createElement("button");
  clearFilter.dataset.value = filterInput.value;

  if (filterInput.value.includes("-fc")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Flowers</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-flc")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Foliage</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-ac")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Autumn Foliage</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-fs")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Fruiting</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-fls")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Flowering</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-h")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " High</span> <span class='clear-button'></span>";
  } else if (filterInput.value.includes("-w")) {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      " Wide</span> <span class='clear-button'></span>";
  } else {
    clearFilter.innerHTML =
      "<span class='clear-text'>" +
      document.querySelector(`label[for="${filterInput.value}"]`).textContent +
      "</span> <span class='clear-button'></span>";
  }

  clearFilter.addEventListener("click", () => {
    document.querySelector(
      `#${CSS.escape(clearFilter.dataset.value)}`
    ).checked = false;

    document
      .querySelector(`#${CSS.escape(clearFilter.dataset.value)}`)
      .parentNode.classList.remove("option-selected");

    clearFilter.style.setProperty("display", "none");

    treeWrapper.style.setProperty("opacity", "0");
    filteredData = [];
    treeFilter = [];
    heightsArray = [];
    widthsArray = [];

    filterSettings = {
      empty: true,
      uses: [],
      tolerates: [],
      types: [],
      winterFoliage: [],
      origin: [],
      soilType: [],
      sunAndShade: [],
      height: [],
      width: [],
      fruitingSeason: [],
      floweringSeason: [],
      flowerColour: [],
      autumnColour: [],
      foliageColour: [],
    };

    for (let i = 0; i < inputsArray.length; i++) {
      if (inputsArray[i].checked === true) {
        filterSettings[`${inputsArray[i].dataset.category}`].push(
          inputsArray[i].value
        );

        filterSettings.empty = false;
      }
    }

    if (filterSettings.empty === false) {
      updateTreeFilter();
    } else {
      document.querySelector("#clear-filter-buttons").innerHTML = "";
    }

    sessionStorage.setItem("filterSettings", JSON.stringify(filterSettings));
    resetStartEnd();
    treeWrapper.innerHTML = "";
    (async function () {
      await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
    })();

    treeWrapper.style.setProperty("opacity", "1");
  });

  document.querySelector("#clear-filter-buttons").appendChild(clearFilter);
}

(async function () {
  updateTreeFilter();

  if (treeFilter.length > 0) {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

    window.addEventListener("dataLoaded", async () => {
      await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
    });

    inputsArray.forEach((filterInput) => {
      if (filterInput.checked === true) {
        createClearButton(filterInput);
      }
    });

    let clearAll = document.createElement("button");
    clearAll.id = "clear-all";
    clearAll.innerHTML =
      "<span class='clear-text'>Clear All Filters</span> <span class='clear-button'></span>";

    clearAll.addEventListener("click", () => {
      document.querySelector("#clear-filter-buttons").innerHTML = "";
      treeWrapper.style.setProperty("opacity", "0");
      filteredData = [];
      treeFilter = [];
      heightsArray = [];
      widthsArray = [];
      inputsArray.forEach((filterInput) => {
        if (filterInput.checked === true) {
          filterInput.checked = false;
          filterInput.parentNode.classList.remove("option-selected");
        }
      });

      filterSettings = {
        empty: true,
        uses: [],
        tolerates: [],
        types: [],
        winterFoliage: [],
        origin: [],
        soilType: [],
        sunAndShade: [],
        height: [],
        width: [],
        fruitingSeason: [],
        floweringSeason: [],
        flowerColour: [],
        autumnColour: [],
        foliageColour: [],
      };
      sessionStorage.setItem("filterSettings", JSON.stringify(filterSettings));
      resetStartEnd();
      treeWrapper.innerHTML = "";
      (async function () {
        await populatePage(
          treeFinderStart,
          treeFinderEnd,
          treeData,
          treeFilter
        );
      })();

      treeWrapper.style.setProperty("opacity", "1");
    });

    document.querySelector("#clear-filter-buttons").appendChild(clearAll);
  } else {
    window.addEventListener("dataLoaded", async () => {
      await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
    });
  }
})();

async function populatePage(
  treeFinderStart,
  treeFinderEnd,
  trees,
  treeFilter = []
) {
  let add = false;
  let treeDataSubset = [];

  if (treeFilter.length > 0) {
    filteredData = trees.filter((tree) => {
      let compareValue = "";

      if (tree.uses !== "" && tree.uses !== undefined) {
        compareValue += `${tree.uses}`;
      }
      if (tree.tolerates !== "" && tree.tolerates !== undefined) {
        compareValue += `${tree.tolerates}`;
      }
      if (tree.winterFoliage !== "" && tree.winterFoliage !== undefined) {
        compareValue += `${tree.winterFoliage}`;
      }
      if (tree.origin !== "" && tree.origin !== undefined) {
        compareValue += `${tree.origin}`;
      }
      if (tree.soilType !== "" && tree.soilType !== undefined) {
        compareValue += `${tree.soilType}`;
      }
      if (tree.sunShade !== "" && tree.sunShade !== undefined) {
        compareValue += `${tree.sunShade}`;
      }
      if (tree.types !== "" && tree.types !== undefined) {
        compareValue += `${tree.types}`;
      }
      if (tree.height !== "" && tree.height !== undefined) {
        let compareArray = tree.height.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-h`;
        });
      }
      if (tree.width !== "" && tree.width !== undefined) {
        let compareArray = tree.width.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-w`;
        });
      }
      if (tree.flowers !== "" && tree.flowers !== undefined) {
        if (tree.flowers.summer !== "") {
          compareValue += "summer-fls";

          tree.flowers.summer.split(", ").forEach((color) => {
            compareValue += `${color}-fc`;
          });
        }
        if (tree.flowers.autumn !== "") {
          compareValue += "autumn-fls";
          tree.flowers.autumn.split(", ").forEach((color) => {
            compareValue += `${color}-fc`;
          });
        }
        if (tree.flowers.winter !== "") {
          compareValue += "winter-fls";
          tree.flowers.winter.split(", ").forEach((color) => {
            compareValue += `${color}-fc`;
          });
        }
        if (tree.flowers.spring !== "") {
          compareValue += "spring-fls";
          tree.flowers.spring.split(", ").forEach((color) => {
            compareValue += `${color}-fc`;
          });
        }
      }

      if (tree.foliage !== "" && tree.foliage !== undefined) {
        if (tree.foliage.summer !== "") {
          tree.foliage.summer.split(", ").forEach((color) => {
            compareValue += `${color}-flc`;
          });
        }
        if (tree.foliage.autumn !== "") {
          tree.foliage.autumn.split(", ").forEach((color) => {
            compareValue += `${color}-ac`;
          });
        }
        if (tree.foliage.winter !== "") {
          tree.foliage.winter.split(", ").forEach((color) => {
            compareValue += `${color}-flc`;
          });
        }
        if (tree.foliage.spring !== "") {
          tree.foliage.spring.split(", ").forEach((color) => {
            compareValue += `${color}-flc`;
          });
        }
      }
      if (tree.fruit !== "" && tree.fruit !== undefined) {
        if (tree.fruit.summer !== "") {
          compareValue += `summer-fs`;
        }
        if (tree.fruit.autumn !== "") {
          compareValue += `autumn-fs`;
        }
        if (tree.fruit.winter !== "") {
          compareValue += `winter-fs`;
        }
        if (tree.fruit.spring !== "") {
          compareValue += `spring-fs`;
        }
      }

      let heightFound = false;
      let widthFound = false;

      for (let i = 0; i < treeFilter.length; i++) {
        if (treeFilter[i].search("-h") !== -1) {
          for (let j = 0; j < heightsArray.length; j++) {
            if (compareValue.search(heightsArray[j]) !== -1) {
              heightFound = true;
              break;
            } else {
              heightFound = false;
            }

            if (j === heightsArray.length - 1) {
              heightFound = false;
            }
          }
        } else if (treeFilter[i].search("-w") !== -1) {
          for (let j = 0; j < widthsArray.length; j++) {
            if (compareValue.search(widthsArray[j]) !== -1) {
              widthFound = true;
              break;
            } else {
              widthFound = false;
            }

            if (j === widthsArray.length - 1) {
              widthFound = false;
            }
          }
        } else if (compareValue.search(treeFilter[i]) !== -1) {
          add = true;
        } else {
          add = false;
          break;
        }

        if (heightsArray.length > 0 && widthsArray.length > 0) {
          if (heightFound && widthFound) {
            add = true;
          } else {
            add = false;
          }
        } else if (heightsArray.length > 0) {
          if (heightFound) {
            add = true;
          } else {
            add = false;
          }
        } else if (widthsArray.length > 0) {
          if (widthFound) {
            add = true;
          } else {
            add = false;
          }
        }
      }

      return add;
    });

    if (filteredData.length !== 0) {
      for (let i = treeFinderStart; i < treeFinderEnd + 1; i++) {
        if (i > filteredData.length - 1) {
          break;
        } else {
          treeDataSubset.push(filteredData[i]);
        }
      }

      if (treeFinderEnd >= filteredData.length - 1) {
        loadMoreButton.disabled = true;
      } else {
        loadMoreButton.disabled = false;
      }
    }
  } else {
    if (trees.length > 0) {
      for (let i = treeFinderStart; i < treeFinderEnd + 1; i++) {
        if (i > trees.length - 1) {
          break;
        } else {
          treeDataSubset.push(trees[i]);
        }
      }
      if (treeFinderEnd >= trees.length - 1) {
        loadMoreButton.disabled = true;
      } else {
        loadMoreButton.disabled = false;
      }
    }
  }

  if (treeDataSubset.length === 0) {
    let noProducts = document.createElement("p");
    noProducts.id = "no-products";
    noProducts.classList.add("paragraph-title");

    buttonDiv.style.setProperty("opacity", "0");

    treeWrapper.innerHTML = "";
    noProducts.textContent = "No trees found. Try different filter options.";
    treeWrapper.insertAdjacentElement("afterbegin", noProducts);

    loadMoreButton.disabled = true;
    returnToTopButton.disabled = true;
  } else {
    returnToTopButton.disabled = false;
    buttonDiv.style.setProperty("opacity", "1");

    for (let i = 0; i < treeDataSubset.length; i++) {
      if (!(treeDataSubset[i] === undefined || treeDataSubset[i] === null)) {
        let treeUrl = document.createElement("a");
        treeUrl.href = `/trees/${treeDataSubset[i].url}/`;
        treeUrl.classList.add("tree-item");

        let treeTitle = document.createElement("h2");
        let treeSubtitle = document.createElement("h3");

        let titleContainer = document.createElement("div");
        titleContainer.classList.add("title-container");

        if (treeDataSubset[i].cultivar !== "") {
          if (treeDataSubset[i].form !== "") {
            treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> f. <i>${treeDataSubset[i].form}</i> '${treeDataSubset[i].cultivar}'`;
          } else if (treeDataSubset[i].variety !== "") {
            treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> var. <i>${treeDataSubset[i].variety}</i> '${treeDataSubset[i].cultivar}'`;
          } else if (treeDataSubset[i].subspecies !== "") {
            treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> subsp. <i>${treeDataSubset[i].subspecies}</i> '${treeDataSubset[i].cultivar}'`;
          } else if (treeDataSubset[i].hybrid !== "") {
            if (treeDataSubset[i].hybrid.search(" x ") !== -1) {
              let text = treeDataSubset[i].hybrid.split(" x ");
              let newText = text.join("</i> x <i>");
              treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${newText}</i> '${treeDataSubset[i].cultivar}'`;
            } else {
              treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> x <i>${treeDataSubset[i].hybrid}</i> '${treeDataSubset[i].cultivar}'`;
            }
          } else {
            if (treeDataSubset[i].species !== "") {
              treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> '${treeDataSubset[i].cultivar}'`;
            } else {
              treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> '${treeDataSubset[i].cultivar}'`;
            }
          }
        } else if (treeDataSubset[i].form !== "") {
          treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> f. <i>${treeDataSubset[i].form}</i>`;
        } else if (treeDataSubset[i].variety !== "") {
          treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> var. <i>${treeDataSubset[i].variety}</i>`;
        } else if (treeDataSubset[i].subspecies !== "") {
          treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i> subsp. <i>${treeDataSubset[i].subspecies}</i>`;
        } else if (treeDataSubset[i].hybrid !== "") {
          if (treeDataSubset[i].hybrid.search(" x ") !== -1) {
            let text = treeDataSubset[i].hybrid.split(" x ");
            let newText = text.join("</i> x <i>");
            treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${newText}</i>`;
          } else {
            treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> x <i>${treeDataSubset[i].hybrid}</i>`;
          }
        } else {
          treeTitle.innerHTML = `<i>${treeDataSubset[i].genus}</i> <i>${treeDataSubset[i].species}</i>`;
        }

        treeSubtitle.textContent = `${treeDataSubset[i].commonName}`;
        titleContainer.appendChild(treeTitle);
        titleContainer.appendChild(treeSubtitle);

        let treeImage = document.createElement("img");

        treeImage.src = `https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=150/https://files.leafland.co.nz/${treeDataSubset[i].mainImage}`;
        treeImage.width = "150";
        treeImage.height = "150";
        treeImage.loading = "lazy";
        treeImage.alt = treeDataSubset[i].url.replace(/-/g, " ");

        treeUrl.appendChild(treeImage);

        treeUrl.appendChild(titleContainer);

        treeWrapper.appendChild(treeUrl);
      }
    }
  }
}

function resetStartEnd() {
  treeFinderStart = 0;
  treeFinderEnd = 23;
}

loadMoreButton.addEventListener("click", () => {
  treeFinderStart += 24;
  treeFinderEnd += 24;

  (async function () {
    await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
  })();
});

returnToTopButton.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
  });
});

document.querySelectorAll(".options-group-option").forEach((option) => {
  option.addEventListener("click", () => {
    if (option.querySelector(".filter-input").checked === true) {
      option.querySelector(".filter-input").checked = false;
      option.classList.remove("option-selected");
    } else {
      option.querySelector(".filter-input").checked = true;
      option.classList.add("option-selected");
    }
  });
});

document.body.querySelector("#open-filter").addEventListener("click", () => {
  document.body.classList.add("filter-open");
});
document.body.querySelector("#close-filter").addEventListener("click", () => {
  filteredData = [];
  treeFilter = [];
  heightsArray = [];
  widthsArray = [];
  resetStartEnd();
  filterSettings = {
    empty: true,
    uses: [],
    tolerates: [],
    types: [],
    winterFoliage: [],
    origin: [],
    soilType: [],
    sunAndShade: [],
    height: [],
    width: [],
    fruitingSeason: [],
    floweringSeason: [],
    flowerColour: [],
    autumnColour: [],
    foliageColour: [],
  };

  document.querySelector("#clear-filter-buttons").innerHTML = "";

  inputsArray.forEach((filterInput) => {
    if (filterInput.checked === true) {
      treeFilter.push(filterInput.value);

      if (
        !filterSettings[`${filterInput.dataset.category}`].includes(
          filterInput.value
        )
      ) {
        filterSettings[`${filterInput.dataset.category}`].push(
          filterInput.value
        );
        filterSettings.empty = false;
      }

      if (filterInput.value.search("-h") !== -1) {
        heightsArray.push(filterInput.value);
      } else if (filterInput.value.search("-w") !== -1) {
        widthsArray.push(filterInput.value);
      }

      createClearButton(filterInput);
    }
  });

  treeWrapper.innerHTML = "";

  sessionStorage.setItem("filterSettings", JSON.stringify(filterSettings));
  (async function () {
    await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);

    if (treeFilter.length > 0) {
      let clearAll = document.createElement("button");
      clearAll.id = "clear-all";
      clearAll.innerHTML =
        "<span class='clear-text'>Clear All Filters</span> <span class='clear-button'></span>";

      clearAll.addEventListener("click", () => {
        document.querySelector("#clear-filter-buttons").innerHTML = "";

        filteredData = [];
        treeFilter = [];
        heightsArray = [];
        widthsArray = [];
        inputsArray.forEach((filterInput) => {
          if (filterInput.checked === true) {
            filterInput.checked = false;
            filterInput.parentNode.classList.remove("option-selected");
          }
        });

        filterSettings = {
          empty: true,
          uses: [],
          tolerates: [],
          types: [],
          winterFoliage: [],
          origin: [],
          soilType: [],
          sunAndShade: [],
          height: [],
          width: [],
          fruitingSeason: [],
          floweringSeason: [],
          flowerColour: [],
          autumnColour: [],
          foliageColour: [],
        };
        sessionStorage.setItem(
          "filterSettings",
          JSON.stringify(filterSettings)
        );
        resetStartEnd();
        treeWrapper.innerHTML = "";
        (async function () {
          await populatePage(
            treeFinderStart,
            treeFinderEnd,
            treeData,
            treeFilter
          );
        })();
      });

      document.querySelector("#clear-filter-buttons").appendChild(clearAll);
    }
  })();

  document.body.classList.remove("filter-open");
});
