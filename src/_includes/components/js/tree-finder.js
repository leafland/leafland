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

      document.querySelector(
        `#${inputsArray[i].dataset.category}`
      ).textContent =
        parseInt(
          document.querySelector(`#${inputsArray[i].dataset.category}`)
            .textContent
        ) + 1;
    } else {
      inputsArray[i].checked = false;
    }
  }
} else {
  clearCheckboxFilter.disabled = true;
  clearSelectFilter.disabled = true;
}

let treeFinderData = [];

let buttonDiv = document.querySelector("#button-div");
let loadMoreButton = document.querySelector("#load-more");
let returnToTopButton = document.querySelector("#return-to-top");

let filteredData = [];

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector("summary");
    // Store the <div class="content"> element
    this.content = el.querySelector(".options-group");

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 300,
        easing: "ease-out",
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight + 20
    }px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 300,
        easing: "ease-out",
      }
    );
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = "";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".checkbox-group").forEach((element) => {
    new Accordion(element);
  });
});

(async function () {
  await getTreeFinderData();
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
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter,
      true
    );
  }
})();

async function getTreeFinderData() {
  treeFinderData = await fetch(`/public/trees.json`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function populatePage(
  treeFinderStart,
  treeFinderEnd,
  trees,
  treeFilter = [],
  firstLoad = true
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
      // if (
      //   tree.filterFlowerColor !== "" &&
      //   tree.filterFlowerColor !== undefined
      // ) {
      //   let compareArray = tree.filterFlowerColor.split(", ");
      //   compareArray.forEach((value) => {
      //     compareValue += `${value}-fc`;
      //   });
      // }
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

        treeImage.src = `https://leafland.imgix.net/images/trees/${treeDataSubset[i].mainImage}?auto=format&w=500&q=75`;
        treeImage.width = "500";
        treeImage.height = "500";
        treeImage.alt = treeDataSubset[i].url.replace(/-/g, " ");

        // if (i === 0 || i === 1 || i === 2 || i === 3) {
        //   treeImage.loading = "eager";
        // } else {
        //   treeImage.loading = "lazy";
        // }

        imageDiv.appendChild(treeImage);
        treeItem.appendChild(imageDiv);

        treeItem.appendChild(container);

        if (firstLoad === false) {
          treeItem.style.setProperty("--animation-order", `${i % 12}`);
          treeItem.classList.add("tree-item-loaded");
        } else {
          treeItem.style.setProperty("visibility", "visible");
          treeItem.style.setProperty("opacity", "1");
        }

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
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter,
      false
    );
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

    document.querySelector("#uses").textContent = "0";
    document.querySelector("#tolerates").textContent = "0";
    document.querySelector("#types").textContent = "0";
    document.querySelector("#winterFoliage").textContent = "0";
    document.querySelector("#origin").textContent = "0";
    document.querySelector("#soilType").textContent = "0";
    document.querySelector("#sunAndShade").textContent = "0";
    document.querySelector("#height").textContent = "0";
    document.querySelector("#width").textContent = "0";
    document.querySelector("#fruitingSeason").textContent = "0";
    document.querySelector("#floweringSeason").textContent = "0";
    document.querySelector("#flowerColour").textContent = "0";
    document.querySelector("#autumnColour").textContent = "0";
    document.querySelector("#foliageColour").textContent = "0";

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

        document.querySelector(`#${filterInput.dataset.category}`).textContent =
          parseInt(
            document.querySelector(`#${filterInput.dataset.category}`)
              .textContent
          ) + 1;
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
      await populatePage(
        treeFinderStart,
        treeFinderEnd,
        treeFinderData,
        treeFilter,
        false
      );
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

  document.querySelector("#uses").textContent = "0";
  document.querySelector("#tolerates").textContent = "0";
  document.querySelector("#types").textContent = "0";
  document.querySelector("#winterFoliage").textContent = "0";
  document.querySelector("#origin").textContent = "0";
  document.querySelector("#soilType").textContent = "0";
  document.querySelector("#sunAndShade").textContent = "0";
  document.querySelector("#height").textContent = "0";
  document.querySelector("#width").textContent = "0";
  document.querySelector("#fruitingSeason").textContent = "0";
  document.querySelector("#floweringSeason").textContent = "0";
  document.querySelector("#flowerColour").textContent = "0";
  document.querySelector("#autumnColour").textContent = "0";
  document.querySelector("#foliageColour").textContent = "0";

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
      treeFinderData,
      treeFilter,
      false
    );
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
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter,
      false
    );
  })();

  treeWrapper.style.setProperty("opacity", "1");
});

loadMoreButton.addEventListener("click", () => {
  treeFinderStart += 12;
  treeFinderEnd += 12;

  (async function () {
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter,
      false
    );
  })();
});

returnToTopButton.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
  });
});
