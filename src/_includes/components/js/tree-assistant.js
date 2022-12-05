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

let filteredTrees = [];
let treeOptionCount = document.querySelector("#tree-option-count");

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

optionsCheckedDisplay();
// if (sessionStorage.getItem("filterSettings")) {
//   filterSettings = JSON.parse(sessionStorage.getItem("filterSettings"));
// }

document.querySelector("#start-assistant").addEventListener("click", () => {
  document.querySelector("#assistant-start-buttons").style.setProperty("display", "none");
  assistantQuestions.style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-counter").style.setProperty("display", "grid");

  document.querySelector("#assistant-origin").style.setProperty("display", "grid");
});

document.querySelector("#origin-next").addEventListener("click", () => {
  addFilterInputs("origin");

  document.querySelector("#assistant-origin").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-winterFoliage").style.setProperty("display", "grid");
});

document.querySelector("#winterFoliage-back").addEventListener("click", () => {
  addFilterInputs("winterFoliage");

  document.querySelector("#assistant-winterFoliage").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-origin").style.setProperty("display", "grid");
});

document.querySelector("#winterFoliage-next").addEventListener("click", () => {
  addFilterInputs("winterFoliage");

  document.querySelector("#assistant-winterFoliage").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-tolerates").style.setProperty("display", "grid");
});

document.querySelector("#tolerates-back").addEventListener("click", () => {
  addFilterInputs("tolerates");

  document.querySelector("#assistant-tolerates").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-winterFoliage").style.setProperty("display", "grid");
});

document.querySelector("#tolerates-next").addEventListener("click", () => {
  addFilterInputs("tolerates");

  document.querySelector("#assistant-tolerates").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-soilType").style.setProperty("display", "grid");
});

document.querySelector("#soilType-back").addEventListener("click", () => {
  addFilterInputs("soilType");

  document.querySelector("#assistant-soilType").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-tolerates").style.setProperty("display", "grid");
});

document.querySelector("#soilType-next").addEventListener("click", () => {
  addFilterInputs("soilType");

  document.querySelector("#assistant-soilType").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-height").style.setProperty("display", "grid");
});

document.querySelector("#height-back").addEventListener("click", () => {
  addFilterInputs("height");

  document.querySelector("#assistant-height").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-soilType").style.setProperty("display", "grid");
});

document.querySelector("#height-next").addEventListener("click", () => {
  addFilterInputs("height");

  document.querySelector("#assistant-height").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-width").style.setProperty("display", "grid");
});

document.querySelector("#width-back").addEventListener("click", () => {
  addFilterInputs("width");

  document.querySelector("#assistant-width").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-height").style.setProperty("display", "grid");
});

document.querySelector("#width-next").addEventListener("click", () => {
  addFilterInputs("width");

  document.querySelector("#assistant-width").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-uses").style.setProperty("display", "grid");
});

document.querySelector("#uses-back").addEventListener("click", () => {
  addFilterInputs("uses");

  document.querySelector("#assistant-uses").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-width").style.setProperty("display", "grid");
});

document.querySelector("#uses-next").addEventListener("click", () => {
  addFilterInputs("uses");

  document.querySelector("#assistant-uses").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-types").style.setProperty("display", "grid");
});

document.querySelector("#types-back").addEventListener("click", () => {
  addFilterInputs("types");

  document.querySelector("#assistant-types").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  assistantQuestions.innerHTML = ``;

  document.querySelector("#assistant-uses").style.setProperty("display", "grid");
});

document.querySelector("#types-next").addEventListener("click", () => {
  addFilterInputs("types");

  document.querySelector("#assistant-types").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  assistantQuestions.innerHTML = ``;

  document.querySelector("#assistant-sunAndShade").style.setProperty("display", "grid");
});

document.querySelector("#sunAndShade-back").addEventListener("click", () => {
  addFilterInputs("sunAndShade");

  document.querySelector("#assistant-sunAndShade").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-types").style.setProperty("display", "grid");
});

document.querySelector("#sunAndShade-next").addEventListener("click", () => {
  addFilterInputs("sunAndShade");

  document.querySelector("#assistant-sunAndShade").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-fruitingSeason").style.setProperty("display", "grid");
});

document.querySelector("#fruitingSeason-back").addEventListener("click", () => {
  addFilterInputs("fruitingSeason");

  document.querySelector("#assistant-fruitingSeason").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-sunAndShade").style.setProperty("display", "grid");
});

document.querySelector("#fruitingSeason-next").addEventListener("click", () => {
  addFilterInputs("fruitingSeason");

  document.querySelector("#assistant-fruitingSeason").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-floweringSeason").style.setProperty("display", "grid");
});

document.querySelector("#floweringSeason-back").addEventListener("click", () => {
  addFilterInputs("floweringSeason");

  document.querySelector("#assistant-floweringSeason").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-fruitingSeason").style.setProperty("display", "grid");
});

document.querySelector("#floweringSeason-next").addEventListener("click", () => {
  addFilterInputs("floweringSeason");

  document.querySelector("#assistant-floweringSeason").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-flowerColour").style.setProperty("display", "grid");
});

document.querySelector("#flowerColour-back").addEventListener("click", () => {
  addFilterInputs("flowerColour");

  document.querySelector("#assistant-flowerColour").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-floweringSeason").style.setProperty("display", "grid");
});

document.querySelector("#flowerColour-next").addEventListener("click", () => {
  addFilterInputs("flowerColour");

  document.querySelector("#assistant-flowerColour").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-autumnColour").style.setProperty("display", "grid");
});

document.querySelector("#autumnColour-back").addEventListener("click", () => {
  addFilterInputs("autumnColour");

  document.querySelector("#assistant-autumnColour").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-flowerColour").style.setProperty("display", "grid");
});

document.querySelector("#autumnColour-next").addEventListener("click", () => {
  addFilterInputs("autumnColour");

  document.querySelector("#assistant-autumnColour").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-foliageColour").style.setProperty("display", "grid");
});

document.querySelector("#foliageColour-back").addEventListener("click", () => {
  addFilterInputs("foliageColour");

  document.querySelector("#assistant-foliageColour").style.setProperty("display", "none");

  filterTreeData();
  treeOptionCount.textContent = filteredTrees.length;

  document.querySelector("#assistant-autumnColour").style.setProperty("display", "grid");
});

document.querySelector("#foliageColour-next").addEventListener("click", () => {
  addFilterInputs("foliageColour");

  document.querySelector("#assistant-foliageColour").style.setProperty("display", "none");

  filterTreeData();

  document.querySelector("#assistant-counter").style.setProperty("display", "none");

  assistantQuestions.innerHTML = `<h2>Here are the tree options that could work for you.</h2><button id="start-again">Start Again</button>`;

  document.querySelector("#start-again").addEventListener("click", () => {
    document.querySelectorAll(".options-group-option").forEach((option) => {
      if (option.querySelector(".filter-input").checked === true) {
        option.querySelector(".filter-input").checked = false;
        option.classList.remove("option-selected");
      }
      addFilterInputs(option.dataset.group);
    });

    filterTreeData();
    treeOptionCount.textContent = filteredTrees.length;

    assistantQuestions.style.setProperty("display", "none");

    assistantResults.style.setProperty("display", "none");

    document.querySelector("#assistant-counter").style.setProperty("display", "grid");

    document.querySelector("#assistant-origin").style.setProperty("display", "grid");
  });

  assistantQuestions.style.setProperty("display", "grid");

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

      treeImage.src = `https://img.imageboss.me/leafland/width/150/quality:75/${
        filteredTrees[i].images[0].split("&")[0]
      }`;
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

      addFilterInputs(option.dataset.group);

      filterTreeData();
      treeOptionCount.textContent = filteredTrees.length;
    });
  });
}

function addFilterInputs(groupName) {
  filterSettings[groupName] = [];

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

function filterTreeData() {
  filteredTrees = treeData.filter((tree) => {
    let originAdd = false;
    let originString = "";
    if (filterSettings.origin.length !== 0) {
      for (let i = 0; i < filterSettings.origin.length; i++) {
        if (i === filterSettings.origin.length - 1) {
          originString += filterSettings.origin[i];
        } else {
          originString += filterSettings.origin[i] + ", ";
        }
      }

      if (tree.origin.includes(originString)) {
        originAdd = true;
      } else {
        originAdd = false;
      }
    } else {
      originAdd = true;
    }

    let winterFoliageAdd = false;
    let winterFoliageString = "";
    if (filterSettings.winterFoliage.length !== 0) {
      for (let i = 0; i < filterSettings.winterFoliage.length; i++) {
        if (i === filterSettings.winterFoliage.length - 1) {
          winterFoliageString += filterSettings.winterFoliage[i];
        } else {
          winterFoliageString += filterSettings.winterFoliage[i] + ", ";
        }
      }

      if (tree.winterFoliage.includes(winterFoliageString)) {
        winterFoliageAdd = true;
      } else {
        winterFoliageAdd = false;
      }
    } else {
      winterFoliageAdd = true;
    }

    let toleratesAdd = false;
    let toleratesString = "";
    if (filterSettings.tolerates.length !== 0) {
      for (let i = 0; i < filterSettings.tolerates.length; i++) {
        if (i === filterSettings.tolerates.length - 1) {
          toleratesString += filterSettings.tolerates[i];
        } else {
          toleratesString += filterSettings.tolerates[i] + ", ";
        }
      }

      if (tree.tolerates.includes(toleratesString)) {
        toleratesAdd = true;
      } else {
        toleratesAdd = false;
      }
    } else {
      toleratesAdd = true;
    }

    let soilTypeAdd = false;
    let soilTypeString = "";
    if (filterSettings.soilType.length !== 0) {
      for (let i = 0; i < filterSettings.soilType.length; i++) {
        if (i === filterSettings.soilType.length - 1) {
          soilTypeString += filterSettings.soilType[i];
        } else {
          soilTypeString += filterSettings.soilType[i] + ", ";
        }
      }

      if (tree.soilType.includes(soilTypeString)) {
        soilTypeAdd = true;
      } else {
        soilTypeAdd = false;
      }
    } else {
      soilTypeAdd = true;
    }

    let heightAdd = false;
    if (filterSettings.height.length !== 0) {
      for (let i = 0; i < filterSettings.height.length; i++) {
        if (tree.height.includes(filterSettings.height[i])) {
          heightAdd = true;
          break;
        } else {
          heightAdd = false;
        }
      }
    } else {
      heightAdd = true;
    }

    let widthAdd = false;
    if (filterSettings.width.length !== 0) {
      for (let i = 0; i < filterSettings.width.length; i++) {
        if (tree.width.includes(filterSettings.width[i])) {
          widthAdd = true;
          break;
        } else {
          widthAdd = false;
        }
      }
    } else {
      widthAdd = true;
    }

    let usesAdd = false;
    let usesString = "";
    if (filterSettings.uses.length !== 0) {
      for (let i = 0; i < filterSettings.uses.length; i++) {
        if (i === filterSettings.uses.length - 1) {
          usesString += filterSettings.uses[i];
        } else {
          usesString += filterSettings.uses[i] + ", ";
        }
      }

      if (tree.uses.includes(usesString)) {
        usesAdd = true;
      } else {
        usesAdd = false;
      }
    } else {
      usesAdd = true;
    }

    let typesAdd = false;
    let typesString = "";
    if (filterSettings.types.length !== 0) {
      for (let i = 0; i < filterSettings.types.length; i++) {
        if (i === filterSettings.types.length - 1) {
          typesString += filterSettings.types[i];
        } else {
          typesString += filterSettings.types[i] + ", ";
        }
      }

      if (tree.types.includes(typesString)) {
        typesAdd = true;
      } else {
        typesAdd = false;
      }
    } else {
      typesAdd = true;
    }

    let sunAndShadeAdd = false;
    let sunAndShadeString = "";
    if (filterSettings.sunAndShade.length !== 0) {
      for (let i = 0; i < filterSettings.sunAndShade.length; i++) {
        if (i === filterSettings.sunAndShade.length - 1) {
          sunAndShadeString += filterSettings.sunAndShade[i];
        } else {
          sunAndShadeString += filterSettings.sunAndShade[i] + ", ";
        }
      }

      if (tree.sunShade.includes(sunAndShadeString)) {
        sunAndShadeAdd = true;
      } else {
        sunAndShadeAdd = false;
      }
    } else {
      sunAndShadeAdd = true;
    }

    let fruitingSeasonAdd = false;
    let fruitCount = 0;
    if (filterSettings.fruitingSeason.length !== 0) {
      for (let i = 0; i < filterSettings.fruitingSeason.length; i++) {
        if (tree.fruit[filterSettings.fruitingSeason[i]] !== "") {
          fruitCount++;
        } else {
          fruitCount--;
        }
      }

      if (fruitCount === filterSettings.fruitingSeason.length) {
        fruitingSeasonAdd = true;
      } else {
        fruitingSeasonAdd = false;
      }
    } else {
      fruitingSeasonAdd = true;
    }

    let floweringSeasonAdd = false;
    let flowerCount = 0;
    if (filterSettings.floweringSeason.length !== 0) {
      for (let i = 0; i < filterSettings.floweringSeason.length; i++) {
        if (tree.flowers[filterSettings.floweringSeason[i]] !== "") {
          flowerCount++;
        } else {
          flowerCount--;
        }
      }

      if (flowerCount === filterSettings.floweringSeason.length) {
        floweringSeasonAdd = true;
      } else {
        floweringSeasonAdd = false;
      }
    } else {
      floweringSeasonAdd = true;
    }

    let flowerColourAdd = false;
    let flowerColourCount = 0;
    if (filterSettings.flowerColour.length !== 0) {
      for (let i = 0; i < filterSettings.flowerColour.length; i++) {
        if (
          tree.flowers.summer.includes(filterSettings.flowerColour[i]) ||
          tree.flowers.autumn.includes(filterSettings.flowerColour[i]) ||
          tree.flowers.winter.includes(filterSettings.flowerColour[i]) ||
          tree.flowers.spring.includes(filterSettings.flowerColour[i])
        ) {
          flowerColourCount++;
        } else {
          flowerColourCount--;
        }
      }

      if (flowerColourCount === filterSettings.flowerColour.length) {
        flowerColourAdd = true;
      } else {
        flowerColourAdd = false;
      }
    } else {
      flowerColourAdd = true;
    }

    let autumnColourAdd = false;
    let autumnColourCount = 0;
    if (filterSettings.autumnColour.length !== 0) {
      for (let i = 0; i < filterSettings.autumnColour.length; i++) {
        if (tree.foliage.autumn.includes(filterSettings.autumnColour[i])) {
          autumnColourCount++;
        } else {
          autumnColourCount--;
        }
      }

      if (autumnColourCount === filterSettings.autumnColour.length) {
        autumnColourAdd = true;
      } else {
        autumnColourAdd = false;
      }
    } else {
      autumnColourAdd = true;
    }

    let foliageColourAdd = false;
    let foliageColourCount = 0;
    if (filterSettings.foliageColour.length !== 0) {
      for (let i = 0; i < filterSettings.foliageColour.length; i++) {
        if (
          tree.foliage.summer.includes(filterSettings.foliageColour[i]) ||
          tree.foliage.winter.includes(filterSettings.foliageColour[i]) ||
          tree.foliage.spring.includes(filterSettings.foliageColour[i])
        ) {
          foliageColourCount++;
        } else {
          foliageColourCount--;
        }
      }

      if (foliageColourCount === filterSettings.foliageColour.length) {
        foliageColourAdd = true;
      } else {
        foliageColourAdd = false;
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
}
