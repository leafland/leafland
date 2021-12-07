let treeWrapper = document.querySelector("#tree-wrapper");
let content = document.querySelector("#content");

let clearCheckboxFilter = document.querySelector("#clear-checkbox-filter");
let clearSelectFilter = document.querySelector("#clear-select-filter");
let treeFinderStart = 0;
let treeFinderEnd = 11;

let imageDataSubset = [];
let inputsArray = document.querySelectorAll("input");
let treeFilter = [];
let heightsArray = [];
let widthsArray = [];

let treeFinderData = [];
let treeFinderImages = [];

let buttonDiv = document.querySelector("#button-div");
let loadMoreButton = document.querySelector("#load-more");
let returnToTopButton = document.querySelector("#return-to-top");

let filteredData = [];

(async function () {
  await getTreeFinderData();

  await getTreeFinderImages();

  if (treeFinderData.length !== 0) {
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter
    );
    buttonDiv.style.setProperty("opacity", "1");
    document.body.classList.add("page-loaded");
  } else {
  }
})();

async function getTreeFinderData() {
  treeFinderData = await fetch(
    `https://api.leafland.co.nz/default/get-product-data?type=tree-finder`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function getTreeFinderImages() {
  treeFinderImages = await fetch(
    `https://api.leafland.co.nz/default/get-image-data`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

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

      if (tree.uses !== "") {
        let compareArray = tree.uses.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}`;
        });
      }
      if (tree.tolerates !== "") {
        let compareArray = tree.tolerates.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}`;
        });
      }
      if (tree.winterFoliage !== "") {
        let compareArray = tree.winterFoliage.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}`;
        });
      }
      if (tree.origin !== "") {
        let compareArray = tree.origin.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}`;
        });
      }
      if (tree.types !== "") {
        let compareArray = tree.types.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}`;
        });
      }
      if (tree.height !== "") {
        let compareArray = tree.height.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-h`;
        });
      }
      if (tree.width !== "") {
        let compareArray = tree.width.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-w`;
        });
      }
      if (tree.floweringSeason !== "") {
        let compareArray = tree.floweringSeason.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-fls`;
        });
      }
      if (tree.flowerColor !== "") {
        let compareArray = tree.flowerColor.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-fc`;
        });
      }
      if (tree.autumnColor !== "") {
        let compareArray = tree.autumnColor.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-ac`;
        });
      }
      if (tree.foliageColor !== "") {
        let compareArray = tree.foliageColor.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-flc`;
        });
      }
      if (tree.fruitingSeason !== "") {
        let compareArray = tree.fruitingSeason.split(", ");
        compareArray.forEach((value) => {
          compareValue += `${value}-fs`;
        });
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
    let noProducts = document.createElement("h2");
    noProducts.id = "no-products";

    treeWrapper.innerHTML = "";
    noProducts.textContent = "No trees found. Try a different filter query.";
    treeWrapper.insertAdjacentElement("afterbegin", noProducts);

    loadMoreButton.disabled = true;
    returnToTopButton.disabled = true;
  } else {
    returnToTopButton.disabled = false;

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

        treeTitle.textContent = treeDataSubset[i].botanicalName;

        if (!(treeDataSubset[i].commonName === "")) {
          treeSubtitle.textContent = `${treeDataSubset[i].commonName}`;
          titleContainer.appendChild(treeTitle);
          titleContainer.appendChild(treeSubtitle);
        } else {
          titleContainer.appendChild(treeTitle);
        }

        container.appendChild(titleContainer);
        container.appendChild(treeUrl);

        let imageDiv = document.createElement("div");
        imageDiv.classList.add("tree-image");

        if (treeFinderImages.length > 0) {
          imageDataSubset = [];

          for (let j = 0; j < treeFinderImages.length; j++) {
            if (
              treeFinderImages[j].split("/", 4)[3] ===
                `${treeDataSubset[i].url}.jpg` ||
              treeFinderImages[j].split("/", 4)[3] ===
                `${treeDataSubset[i].url}.jpeg`
            ) {
              imageDataSubset.push(treeFinderImages[j]);
              break;
            }
          }

          if (imageDataSubset.length > 0) {
            let treeImage = document.createElement("img");

            treeImage.src = `https://ik.imagekit.io/leafland/${
              imageDataSubset[imageDataSubset.length - 1]
            }?tr=w-500,q-75,pr-true,f-auto`;
            treeImage.width = "500";
            treeImage.height = "500";
            treeImage.alt = imageDataSubset[imageDataSubset.length - 1]
              .substring(
                imageDataSubset[imageDataSubset.length - 1].lastIndexOf("/") +
                  1,
                imageDataSubset[imageDataSubset.length - 1].lastIndexOf(".")
              )
              .replace(/-/g, " ");
            treeImage.loading = "lazy";

            imageDiv.appendChild(treeImage);
            treeItem.appendChild(imageDiv);
          }
        }

        treeItem.appendChild(container);
        treeItem.style.setProperty("--animation-order", `${i % 12}`);
        treeItem.classList.add("tree-item-loaded");
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
  let selectData = Array.from(event.target.selectedOptions).reduce(
    (data, opt) => {
      data.push(opt.value);
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

  (async function () {
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter
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
    inputsArray.forEach((filterInput) => {
      if (filterInput.checked === true) {
        treeFilter.push(filterInput.value);
        if (filterInput.value.search("-h") !== -1) {
          heightsArray.push(filterInput.value);
        } else if (filterInput.value.search("-w") !== -1) {
          widthsArray.push(filterInput.value);
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
    (async function () {
      await populatePage(
        treeFinderStart,
        treeFinderEnd,
        treeFinderData,
        treeFilter
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

  resetStartEnd();
  treeWrapper.innerHTML = "";
  (async function () {
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter
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

  resetStartEnd();
  treeWrapper.innerHTML = "";
  (async function () {
    await populatePage(
      treeFinderStart,
      treeFinderEnd,
      treeFinderData,
      treeFilter
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
      treeFilter
    );
  })();
});

returnToTopButton.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
  });
});
