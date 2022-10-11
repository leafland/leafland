let treeWrapper = document.querySelector("#tree-wrapper");
let content = document.querySelector("#content");

let treeFinderStart = 0;
let treeFinderEnd = 23;

let imageDataSubset = [];
let inputsArray = document.querySelectorAll(".filter-input");
let treeFilter = [];
let heightsArray = [];
let widthsArray = [];

let assistantQuestions = document.querySelector("#assistant-questions");
let assistantResults = document.querySelector("#assistant-results");

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

// if (sessionStorage.getItem("filterSettings")) {
//   filterSettings = JSON.parse(sessionStorage.getItem("filterSettings"));
// }

document.querySelector("#start-assistant").addEventListener("click", () => {
  document
    .querySelector("#assistant-start-buttons")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>Would you like a native or exotic tree?</h2>`;

  document
    .querySelector("#assistant-origin")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#origin-next").addEventListener("click", () => {
  addFilterInputs("origin");

  document
    .querySelector("#assistant-origin")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>Would type of winter foliage should your tree have?</h2>`;

  document
    .querySelector("#assistant-winterFoliage")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#winterFoliage-next").addEventListener("click", () => {
  addFilterInputs("winterFoliage");

  document
    .querySelector("#assistant-winterFoliage")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What climate condition(s) does the planting site have?</h2>`;

  document
    .querySelector("#assistant-tolerates")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#tolerates-next").addEventListener("click", () => {
  addFilterInputs("tolerates");

  document
    .querySelector("#assistant-tolerates")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What soil type(s) does the planting site have?</h2>`;

  document
    .querySelector("#assistant-soilType")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#soilType-next").addEventListener("click", () => {
  addFilterInputs("soilType");

  document
    .querySelector("#assistant-soilType")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>How tall do you want the tree to grow?</h2><p>You can select multiple heights to see more tree options if you don't need the tree to grow to an exact height.</p>`;

  document
    .querySelector("#assistant-height")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#height-next").addEventListener("click", () => {
  addFilterInputs("height");

  document
    .querySelector("#assistant-height")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>How wide do you want the tree to grow?</h2><p>You can select multiple widths to see more tree options if you don't need the tree to grow to an exact width.</p>`;

  document
    .querySelector("#assistant-width")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#width-next").addEventListener("click", () => {
  addFilterInputs("width");

  document
    .querySelector("#assistant-width")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What specific uses do you have for the tree?</h2>`;

  document
    .querySelector("#assistant-uses")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#uses-next").addEventListener("click", () => {
  addFilterInputs("uses");

  document
    .querySelector("#assistant-uses")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What types?</h2>`;

  document
    .querySelector("#assistant-types")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#types-next").addEventListener("click", () => {
  addFilterInputs("types");

  document
    .querySelector("#assistant-types")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>How much sun does the planting site get?</h2>`;

  document
    .querySelector("#assistant-sunAndShade")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#sunAndShade-next").addEventListener("click", () => {
  addFilterInputs("sunAndShade");

  document
    .querySelector("#assistant-sunAndShade")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>When do you want the tree to fruit?</h2>`;

  document
    .querySelector("#assistant-fruitingSeason")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#fruitingSeason-next").addEventListener("click", () => {
  addFilterInputs("fruitingSeason");

  document
    .querySelector("#assistant-fruitingSeason")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>When do you want the tree to flower?</h2>`;

  document
    .querySelector("#assistant-floweringSeason")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document
  .querySelector("#floweringSeason-next")
  .addEventListener("click", () => {
    addFilterInputs("floweringSeason");

    document
      .querySelector("#assistant-floweringSeason")
      .style.setProperty("display", "none");

    assistantQuestions.innerHTML = `<h2>What colour flowers do you want the tree to have?</h2>`;

    document
      .querySelector("#assistant-flowerColour")
      .style.setProperty("display", "grid");

    optionsCheckedDisplay();
  });

document.querySelector("#flowerColour-next").addEventListener("click", () => {
  addFilterInputs("flowerColour");

  document
    .querySelector("#assistant-flowerColour")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What autumn foliage colour do you want the tree to have?</h2>`;

  document
    .querySelector("#assistant-autumnColour")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#autumnColour-next").addEventListener("click", () => {
  addFilterInputs("autumnColour");

  document
    .querySelector("#assistant-autumnColour")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>What foliage colour do you want the tree to have?</h2>`;

  document
    .querySelector("#assistant-foliageColour")
    .style.setProperty("display", "grid");

  optionsCheckedDisplay();
});

document.querySelector("#foliageColour-next").addEventListener("click", () => {
  addFilterInputs("foliageColour");

  document
    .querySelector("#assistant-foliageColour")
    .style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>Here are tree options that could work for you.</h2>`;

  let filteredTrees = treeData.filter((tree) => {
    let usesAdd = false;
    if (filterSettings.uses.length !== 0) {
      for (let i = 0; i < filterSettings.uses.length; i++) {
        if (filterSettings.uses[i] === "any") {
          usesAdd = true;
          break;
        } else {
          if (tree.uses.includes(filterSettings.uses[i])) {
            usesAdd = true;
          } else {
            usesAdd = false;
          }
        }
      }
    } else {
      usesAdd = true;
    }

    let toleratesAdd = false;
    if (filterSettings.tolerates.length !== 0) {
      for (let i = 0; i < filterSettings.tolerates.length; i++) {
        if (filterSettings.tolerates[i] === "any") {
          toleratesAdd = true;
          break;
        } else {
          if (tree.tolerates.includes(filterSettings.tolerates[i])) {
            toleratesAdd = true;
          } else {
            toleratesAdd = false;
          }
        }
      }
    } else {
      toleratesAdd = true;
    }

    let typesAdd = false;
    if (filterSettings.types.length !== 0) {
      for (let i = 0; i < filterSettings.types.length; i++) {
        if (filterSettings.types[i] === "any") {
          typesAdd = true;
          break;
        } else {
          if (tree.types.includes(filterSettings.types[i])) {
            typesAdd = true;
          } else {
            typesAdd = false;
          }
        }
      }
    } else {
      typesAdd = true;
    }

    let winterFoliageAdd = false;
    if (filterSettings.winterFoliage.length !== 0) {
      for (let i = 0; i < filterSettings.winterFoliage.length; i++) {
        if (filterSettings.winterFoliage[i] === "any") {
          winterFoliageAdd = true;
          break;
        } else {
          if (tree.winterFoliage.includes(filterSettings.winterFoliage[i])) {
            winterFoliageAdd = true;
          } else {
            winterFoliageAdd = false;
          }
        }
      }
    } else {
      winterFoliageAdd = true;
    }

    let originAdd = false;
    if (filterSettings.origin.length !== 0) {
      for (let i = 0; i < filterSettings.origin.length; i++) {
        if (filterSettings.origin[i] === "any") {
          originAdd = true;
          break;
        } else {
          if (tree.origin.includes(filterSettings.origin[i])) {
            originAdd = true;
          } else {
            originAdd = false;
          }
        }
      }
    } else {
      originAdd = true;
    }

    let soilTypeAdd = false;
    if (filterSettings.soilType.length !== 0) {
      for (let i = 0; i < filterSettings.soilType.length; i++) {
        if (filterSettings.soilType[i] === "any") {
          soilTypeAdd = true;
          break;
        } else {
          if (tree.soilType.includes(filterSettings.soilType[i])) {
            soilTypeAdd = true;
          } else {
            soilTypeAdd = false;
          }
        }
      }
    } else {
      soilTypeAdd = true;
    }

    let sunAndShadeAdd = false;
    if (filterSettings.sunAndShade.length !== 0) {
      for (let i = 0; i < filterSettings.sunAndShade.length; i++) {
        if (filterSettings.sunAndShade[i] === "any") {
          sunAndShadeAdd = true;
          break;
        } else {
          if (tree.sunShade.includes(filterSettings.sunAndShade[i])) {
            sunAndShadeAdd = true;
          } else {
            sunAndShadeAdd = false;
          }
        }
      }
    } else {
      sunAndShadeAdd = true;
    }

    let heightAdd = false;
    if (filterSettings.height.length !== 0) {
      for (let i = 0; i < filterSettings.height.length; i++) {
        if (filterSettings.height[i] === "any") {
          heightAdd = true;
          break;
        } else {
          if (tree.height.includes(filterSettings.height[i])) {
            heightAdd = true;
            break;
          } else {
            heightAdd = false;
          }
        }
      }
    } else {
      heightAdd = true;
    }

    let widthAdd = false;
    if (filterSettings.width.length !== 0) {
      for (let i = 0; i < filterSettings.width.length; i++) {
        if (filterSettings.width[i] === "any") {
          widthAdd = true;
          break;
        } else {
          if (tree.width.includes(filterSettings.width[i])) {
            widthAdd = true;
            break;
          } else {
            widthAdd = false;
          }
        }
      }
    } else {
      widthAdd = true;
    }

    let fruitingSeasonAdd = false;
    if (filterSettings.fruitingSeason.length !== 0) {
      for (let i = 0; i < filterSettings.fruitingSeason.length; i++) {
        if (filterSettings.fruitingSeason[i] === "any") {
          fruitingSeasonAdd = true;
          break;
        } else {
          if (tree.fruit[filterSettings.fruitingSeason[i]] !== "") {
            fruitingSeasonAdd = true;
          } else {
            fruitingSeasonAdd = false;
          }
        }
      }
    } else {
      fruitingSeasonAdd = true;
    }

    let floweringSeasonAdd = false;
    if (filterSettings.floweringSeason.length !== 0) {
      for (let i = 0; i < filterSettings.floweringSeason.length; i++) {
        if (filterSettings.floweringSeason[i] === "any") {
          floweringSeasonAdd = true;
          break;
        } else {
          if (tree.flowers[filterSettings.floweringSeason[i]] !== "") {
            floweringSeasonAdd = true;
          } else {
            floweringSeasonAdd = false;
          }
        }
      }
    } else {
      floweringSeasonAdd = true;
    }

    let flowerColourAdd = false;
    if (filterSettings.flowerColour.length !== 0) {
      for (let i = 0; i < filterSettings.flowerColour.length; i++) {
        if (filterSettings.flowerColour[i] === "any") {
          flowerColourAdd = true;
          break;
        } else {
          if (
            tree.flowers.summer.includes(filterSettings.flowerColour[i]) ||
            tree.flowers.autumn.includes(filterSettings.flowerColour[i]) ||
            tree.flowers.winter.includes(filterSettings.flowerColour[i]) ||
            tree.flowers.spring.includes(filterSettings.flowerColour[i])
          ) {
            flowerColourAdd = true;
          } else {
            flowerColourAdd = false;
          }
        }
      }
    } else {
      flowerColourAdd = true;
    }

    let autumnColourAdd = false;
    if (filterSettings.autumnColour.length !== 0) {
      for (let i = 0; i < filterSettings.autumnColour.length; i++) {
        if (filterSettings.autumnColour[i] === "any") {
          autumnColourAdd = true;
          break;
        } else {
          if (tree.foliage.autumn.includes(filterSettings.autumnColour[i])) {
            autumnColourAdd = true;
          } else {
            autumnColourAdd = false;
          }
        }
      }
    } else {
      autumnColourAdd = true;
    }

    let foliageColourAdd = false;
    if (filterSettings.foliageColour.length !== 0) {
      for (let i = 0; i < filterSettings.foliageColour.length; i++) {
        if (filterSettings.foliageColour[i] === "any") {
          foliageColourAdd = true;
          break;
        } else {
          if (
            tree.foliage.summer.includes(filterSettings.foliageColour[i]) ||
            tree.foliage.winter.includes(filterSettings.foliageColour[i]) ||
            tree.foliage.spring.includes(filterSettings.foliageColour[i])
          ) {
            foliageColourAdd = true;
          } else {
            foliageColourAdd = false;
          }
        }
      }
    } else {
      foliageColourAdd = true;
    }

    return (
      usesAdd &&
      toleratesAdd &&
      typesAdd &&
      winterFoliageAdd &&
      originAdd &&
      soilTypeAdd &&
      sunAndShadeAdd &&
      heightAdd &&
      widthAdd & fruitingSeasonAdd &&
      floweringSeasonAdd &&
      flowerColourAdd &&
      autumnColourAdd &&
      foliageColourAdd
    );
  });

  assistantResults.style.setProperty("display", "grid");

  for (let i = 0; i < filteredTrees.length; i++) {
    if (!(filteredTrees[i] === undefined || filteredTrees[i] === null)) {
      let treeUrl = document.createElement("a");
      treeUrl.href = `/trees/${filteredTrees[i].url}/`;
      treeUrl.classList.add("tree-item");

      let treeTitle = document.createElement("h2");
      let treeSubtitle = document.createElement("h3");

      let titleContainer = document.createElement("div");
      titleContainer.classList.add("title-container");

      treeTitle.innerHTML = `${filteredTrees[i].fullName}`;

      treeSubtitle.textContent = `${filteredTrees[i].commonName}`;
      titleContainer.appendChild(treeTitle);
      titleContainer.appendChild(treeSubtitle);

      let treeImage = document.createElement("img");

      treeImage.src = `https://leafland.co.nz/cdn-cgi/image/format=auto,metadata=none,quality=75,width=150/https://files.leafland.co.nz/${filteredTrees[i].mainImage}`;
      treeImage.width = "150";
      treeImage.height = "150";
      treeImage.loading = "lazy";
      treeImage.alt = filteredTrees[i].url.replace(/-/g, " ");

      treeUrl.appendChild(treeImage);

      treeUrl.appendChild(titleContainer);

      assistantResults.appendChild(treeUrl);
    }
  }
});

function optionsCheckedDisplay() {
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
}

function addFilterInputs(groupName) {
  document
    .querySelector(`#${groupName}-options-group`)
    .querySelectorAll(".filter-input")
    .forEach((input) => {
      if (input.checked === true) {
        filterSettings[groupName].push(input.value);
        filterSettings.empty = false;
      }
    });
}
