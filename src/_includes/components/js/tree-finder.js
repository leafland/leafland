let treeWrapper = document.querySelector("#tree-wrapper");
let content = document.querySelector("#content");

let clearCheckboxFilter = document.querySelector("#clear-checkbox-filter");
let clearSelectFilter = document.querySelector("#clear-select-filter");
let treeFinderStart = 0;
let treeFinderEnd = 11;

let imageDataSubset = [];
let inputsArray = document.querySelectorAll(".filter-input");
let optionsArray = document.querySelectorAll(".input-option");
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
  clearCheckboxFilter.disabled = false;
  clearSelectFilter.disabled = false;

  for (let i = 0; i < optionsArray.length; i++) {
    if (
      filterSettings[`${optionsArray[i].dataset.category}`].includes(
        optionsArray[i].value
      )
    ) {
      optionsArray[i].selected = true;
    } else {
      optionsArray[i].selected = false;
    }
  }

  for (let i = 0; i < inputsArray.length; i++) {
    if (
      filterSettings[`${inputsArray[i].dataset.category}`].includes(
        inputsArray[i].value
      )
    ) {
      inputsArray[i].checked = true;

      if (
        document.querySelector(`#${inputsArray[i].dataset.category}`)
          .textContent === ""
      ) {
        document.querySelector(
          `#${inputsArray[i].dataset.category}`
        ).textContent = "1";
      } else {
        document.querySelector(
          `#${inputsArray[i].dataset.category}`
        ).textContent =
          parseInt(
            document.querySelector(`#${inputsArray[i].dataset.category}`)
              .textContent
          ) + 1;
      }
    } else {
      inputsArray[i].checked = false;
    }
  }
} else {
  clearCheckboxFilter.disabled = true;
  clearSelectFilter.disabled = true;
}

let buttonDiv = document.querySelector("#button-div");
let loadMoreButton = document.querySelector("#load-more");
let returnToTopButton = document.querySelector("#return-to-top");

let filteredData = [];

(async function () {
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

  if (treeFilter.length > 0) {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    treeWrapper.innerHTML = "";
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
    if (trees.length !== 0) {
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
        let treeItem = document.createElement("div");
        treeItem.classList.add("tree-item");

        let treeUrl = document.createElement("a");
        treeUrl.href = `/trees/${treeDataSubset[i].url}/`;
        treeUrl.textContent = "View Tree";
        treeUrl.classList.add("tree-link");
        treeUrl.classList.add("button");

        let treeTitle = document.createElement("h2");
        let treeSubtitle = document.createElement("h3");

        let container = document.createElement("div");
        container.classList.add("title-link-box");

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

        container.appendChild(titleContainer);
        container.appendChild(treeUrl);

        let imageDiv = document.createElement("div");
        imageDiv.classList.add("tree-image");

        let treeImage = document.createElement("img");

        treeImage.src = `https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=700/https://files.leafland.co.nz/${treeDataSubset[i].mainImage}`;
        treeImage.width = "700";
        treeImage.height = "700";
        treeImage.alt = treeDataSubset[i].url.replace(/-/g, " ");

        imageDiv.appendChild(treeImage);
        treeItem.appendChild(imageDiv);

        treeItem.appendChild(container);

        treeWrapper.appendChild(treeItem);
      }
    }
  }
}

function resetStartEnd() {
  treeFinderStart = 0;
  treeFinderEnd = 11;
}

document.querySelector("select").addEventListener("input", (event) => {
  treeWrapper.style.setProperty("opacity", "0");
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
  let selectData = Array.from(event.target.selectedOptions).reduce(
    (data, opt) => {
      data.push(opt.value);

      if (!filterSettings[`${opt.dataset.category}`].includes(opt.value)) {
        filterSettings[`${opt.dataset.category}`].push(opt.value);
        filterSettings.empty = false;
      }

      if (opt.value.search("-h") !== -1) {
        heightsArray.push(opt.value);
      } else if (opt.value.search("-w") !== -1) {
        widthsArray.push(opt.value);
      }
      return data;
    },
    []
  );

  if (selectData.length > 0) {
    if (clearSelectFilter.disabled === true) {
      clearSelectFilter.disabled = false;
    }
  } else {
    clearSelectFilter.disabled = true;
  }

  let filterValue = selectData.join(",");
  treeFilter = filterValue.split(",");
  treeWrapper.innerHTML = "";

  sessionStorage.setItem("filterSettings", JSON.stringify(filterSettings));

  (async function () {
    await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
  })();

  treeWrapper.style.setProperty("opacity", "1");
});

inputsArray.forEach((input) => {
  input.addEventListener("input", () => {
    treeWrapper.style.setProperty("opacity", "0");
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

    document.querySelector("#uses").textContent = "";
    document.querySelector("#tolerates").textContent = "";
    document.querySelector("#types").textContent = "";
    document.querySelector("#winterFoliage").textContent = "";
    document.querySelector("#origin").textContent = "";
    document.querySelector("#soilType").textContent = "";
    document.querySelector("#sunAndShade").textContent = "";
    document.querySelector("#height").textContent = "";
    document.querySelector("#width").textContent = "";
    document.querySelector("#fruitingSeason").textContent = "";
    document.querySelector("#floweringSeason").textContent = "";
    document.querySelector("#flowerColour").textContent = "";
    document.querySelector("#autumnColour").textContent = "";
    document.querySelector("#foliageColour").textContent = "";

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

        if (
          document.querySelector(`#${filterInput.dataset.category}`)
            .textContent === ""
        ) {
          document.querySelector(
            `#${filterInput.dataset.category}`
          ).textContent = "1";
        } else {
          document.querySelector(
            `#${filterInput.dataset.category}`
          ).textContent =
            parseInt(
              document.querySelector(`#${filterInput.dataset.category}`)
                .textContent
            ) + 1;
        }
      }
    });

    if (treeFilter.length > 0) {
      if (clearCheckboxFilter.disabled === true) {
        clearCheckboxFilter.disabled = false;
      }
    } else {
      clearCheckboxFilter.disabled = true;
    }

    treeWrapper.innerHTML = "";

    sessionStorage.setItem("filterSettings", JSON.stringify(filterSettings));
    (async function () {
      await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
    })();

    treeWrapper.style.setProperty("opacity", "1");
  });
});

clearCheckboxFilter.addEventListener("click", () => {
  treeWrapper.style.setProperty("opacity", "0");
  filteredData = [];
  treeFilter = [];
  heightsArray = [];
  widthsArray = [];
  inputsArray.forEach((filterInput) => {
    if (filterInput.checked === true) {
      filterInput.checked = false;
    }
  });

  clearCheckboxFilter.disabled = true;

  document.querySelector("#uses").textContent = "";
  document.querySelector("#tolerates").textContent = "";
  document.querySelector("#types").textContent = "";
  document.querySelector("#winterFoliage").textContent = "";
  document.querySelector("#origin").textContent = "";
  document.querySelector("#soilType").textContent = "";
  document.querySelector("#sunAndShade").textContent = "";
  document.querySelector("#height").textContent = "";
  document.querySelector("#width").textContent = "";
  document.querySelector("#fruitingSeason").textContent = "";
  document.querySelector("#floweringSeason").textContent = "";
  document.querySelector("#flowerColour").textContent = "";
  document.querySelector("#autumnColour").textContent = "";
  document.querySelector("#foliageColour").textContent = "";

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
    await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
  })();

  treeWrapper.style.setProperty("opacity", "1");
});

clearSelectFilter.addEventListener("click", () => {
  treeWrapper.style.setProperty("opacity", "0");
  filteredData = [];
  treeFilter = [];
  heightsArray = [];
  widthsArray = [];
  let options = document.querySelectorAll("select");
  for (let i = 0; i < options.length; i++) {
    options[i].selected = false;
    options[i].value = "";
  }

  clearSelectFilter.disabled = true;

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
    await populatePage(treeFinderStart, treeFinderEnd, treeData, treeFilter);
  })();

  treeWrapper.style.setProperty("opacity", "1");
});

loadMoreButton.addEventListener("click", () => {
  treeFinderStart += 12;
  treeFinderEnd += 12;

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
