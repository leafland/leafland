let colorSection = document.querySelector("#color-section");
let successMessage = document.querySelector("#success-message");
let gradeSizeSelect = document.querySelector("#grade-size-select");
let heightSelect = document.querySelector("#height-select");
let standardHeightSelect = document.querySelector("#standard-height-select");
let gradeSizesDiv = document.querySelector("#grade-sizes");
let stockValuesDiv = document.querySelector("#stock-values");
let treeQuantity = document.querySelector("#quantity");
let treeBotanicalName = document.querySelector(".tree-botanical-name");
let treeCommonName = document.querySelector(".tree-common-name");
let images = document.querySelector(".images");
let mainImage = document.querySelector("#main-image-inner");
let addToOrderButton = document.querySelector("#add-product");
let treeAttributes = document.querySelector("#tree-attributes");
let imageLightbox = document.querySelector("#image-lightbox");
let imageLightboxInner = document.querySelector("#image-lightbox-div");
let imageLightBoxClose = document.querySelector("#image-lightbox-close");
// let comingOn = document.querySelector("#coming-on");

let imageLeftButton = document.querySelector("#image-left-button");
let imageRightButton = document.querySelector("#image-right-button");
let imagePosition = 0;
let thumbImages = document.querySelectorAll(".thumb-image");

let productImage = "";
let maximumQuantityReached = false;

let quantityField = document.querySelector("#quantity-field");
let wholesalePriceField = document.querySelector("#wholesale-price");
let retailPriceField = document.querySelector("#retail-price");
// let comingOnField = document.querySelector("#coming-on-field");

let stockTableDiv = document.querySelector("#stock-table-div");

let heightValues = 0;
let standardHeightValues = 0;

let productTrees = JSON.parse(localStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];
let stockData = [];
let newData = [];

window.addEventListener("loginUpdated", () => {
  (async function init() {
    addEventListeners();

    await createTreeImages();

    await getProductStockData();

    let inStock = 0;

    gradeLoop: for (let i = 0; i < grades.length; i++) {
      heightLoop: for (let j = 0; j < grades[i].heights.length; j++) {
        standardLoop: for (
          let k = 0;
          k < grades[i].heights[j].standardHeights.length;
          k++
        ) {
          if (
            parseInt(grades[i].heights[j].standardHeights[k].quantity, 10) !== 0
          ) {
            inStock++;
            // if (grades[i].heights[j].standardHeights.length > 1) {
            //   if (k === grades[i].heights[j].standardHeights.length - 1) {
            //     inStock++;
            //   }
            // }
          } else {
            grades[i].heights[j].standardHeights.splice(k, 1);
            k--;
          }
        }

        if (grades[i].heights[j].standardHeights.length < 1) {
          grades[i].heights.splice(j, 1);
          j--;
        }
      }

      if (grades[i].heights.length < 1) {
        grades.splice(i, 1);
        i--;
      }
    }

    if (inStock === 0) {
      gradeSizesDiv.innerHTML = ``;
      let message = document.createElement("p");
      message.textContent = "Currently out of stock.";
      message.classList.add("bold-up");
      gradeSizesDiv.appendChild(message);
      gradeSizesDiv.style.setProperty("grid-template-columns", "1fr");
      gradeSizesDiv.style.setProperty("margin-top", "0");

      stockValuesDiv.style.setProperty("display", "none");
    } else {
      await createStockValues();
    }

    stockData = await fetch(
      "https://api.leafland.co.nz/default/get-stock-data-file?type=list"
    )
      .then((response) => response.json())
      .catch((error) => {});

    if (treeCommonName.textContent !== "") {
      document.querySelector(
        "#tree-name-content"
      ).textContent = `${treeBotanicalName.textContent} (${treeCommonName.textContent})`;
    } else {
      document.querySelector(
        "#tree-name-content"
      ).textContent = `${treeBotanicalName.textContent}`;
    }
    await createStockTable();
  })();
});

async function getProductStockData() {
  let treeName;
  if (treeCommonName.textContent.search("serrula") !== -1) {
    treeName = treeBotanicalName.textContent + " serrula interstem";
  } else {
    treeName = treeBotanicalName.textContent;
  }
  grades = await fetch(
    `https://api.leafland.co.nz/default/get-tree-stock-data?treeName=${treeName
      .replace("Prunus dulcis", "Almond")
      .replace("Malus domestica", "Apple")
      .replace("Prunus armeniaca", "Apricot")
      .replace("Persea americana", "Avocado")
      .replace("Prunus avium", "Cherry")
      .replace("Citrus x paradisi", "Citrus grapefruit")
      .replace("Citrus x limon", "Citrus lemon")
      .replace("Citrus x meyeri", "Citrus lemon Meyer")
      .replace("Citrus limon x reticulata", "Citrus Lemonade")
      .replace("Citrus x latifolia", "Citrus lime")
      .replace("Citrus reticulata", "Citrus mandarin")
      .replace("Citrus x sinensis", "Citrus orange")
      .replace("Feijoa sellowiana", "Feijoa")
      .replace("Ficus carica", "Fig")
      .replace("Alectryon excelsus var. excelsus", "Alectryon excelsus")
      .replace("Psidium cattleyanum var. cattleyanum", "Guava Red Cherry")
      .replace("Corylus avellana", "Hazelnut")
      .trim()
      .replace(/ã/g, "a")
      .replace(/é/g, "e")
      .replace(/ā/g, "a")
      .replace(/ē/g, "e")
      .replace(/ī/g, "i")
      .replace(/ō/g, "o")
      .replace(/ū/g, "u")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .replace(/\./g, "")
      .replace(/ var /g, " ")
      .replace(/ x /g, " ")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\\/g, " ")
      .replace(/\//g, " ")
      .replace(/ /g, "-")
      .toLowerCase()}`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function createTreeImages() {
  imageLightBoxClose.addEventListener("click", () => {
    document.body.classList.remove("lightbox-open");
  });

  let mainImg = document.querySelector(".main-img");
  productImage = mainImg.src.split("images/trees/")[1].split("?")[0];
  mainImg.addEventListener("click", () => {
    imageLightboxInner.innerHTML = `<img src='${
      mainImg.src.split("?")[0]
    }?auto=format&w=1000&q=75' height="1000" width="1000" alt="${
      mainImg.alt
    }" srcset="${mainImg.src.split("?")[0]}?auto=format&w=300&q=75 300w, ${
      mainImg.src.split("?")[0]
    }?auto=format&w=500&q=75 500w, ${
      mainImg.src.split("?")[0]
    }?auto=format&w=700&q=75 700w" sizes="1000px">`;
    document.body.classList.add("lightbox-open");
  });

  thumbImages.forEach((thumbImage) => {
    thumbImage.addEventListener("click", (e) => {
      imagePosition = parseInt(thumbImage.dataset.position);
      e.preventDefault();

      mainImg = document.querySelector(".main-img");

      if (mainImg.alt !== thumbImage.alt) {
        mainImage.style.setProperty("opacity", "0");
        mainImage.style.setProperty("visibility", "hidden");
        setTimeout(() => {
          mainImage.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=500&q=75" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");
        }, 500);

        mainImage.addEventListener("click", () => {
          imageLightboxInner.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=1000&q=75" height="1000" width="1000" alt="${
            thumbImage.alt
          }" srcset="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=300&q=75 300w, ${
            thumbImage.src.split("?")[0]
          }?auto=format&w=500&q=75 500w, ${
            thumbImage.src.split("?")[0]
          }?auto=format&w=700&q=75 700w" sizes="1000px">`;
          document.body.classList.add("lightbox-open");
        });
      }
    });
  });

  imageLeftButton.addEventListener("click", () => {
    if (imagePosition <= 0) {
      imagePosition = parseInt(thumbImages.length) - 1;
    } else {
      imagePosition--;
    }

    thumbImages.forEach((thumbImage) => {
      if (parseInt(thumbImage.dataset.position) === imagePosition) {
        mainImage.style.setProperty("opacity", "0");
        mainImage.style.setProperty("visibility", "hidden");

        setTimeout(() => {
          mainImage.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=500&q=75" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=1000&q=75" height="1000" width="1000" alt="${
              thumbImage.alt
            }" srcset="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=300&q=75 300w, ${
              thumbImage.src.split("?")[0]
            }?auto=format&w=500&q=75 500w, ${
              thumbImage.src.split("?")[0]
            }?auto=format&w=700&q=75 700w" sizes="1000px">`;
            document.body.classList.add("lightbox-open");
          });
        }, 500);
      }
    });
  });

  imageRightButton.addEventListener("click", () => {
    if (imagePosition >= thumbImages.length - 1) {
      imagePosition = 0;
    } else {
      imagePosition++;
    }

    thumbImages.forEach((thumbImage) => {
      if (parseInt(thumbImage.dataset.position) === imagePosition) {
        mainImage.style.setProperty("opacity", "0");
        mainImage.style.setProperty("visibility", "hidden");

        setTimeout(() => {
          mainImage.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=500&q=75" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=1000&q=75" height="1000" width="1000" alt="${
              thumbImage.alt
            }" srcset="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=300&q=75 300w, ${
              thumbImage.src.split("?")[0]
            }?auto=format&w=500&q=75 500w, ${
              thumbImage.src.split("?")[0]
            }?auto=format&w=700&q=75 700w" sizes="1000px">`;
            document.body.classList.add("lightbox-open");
          });
        }, 500);
      }
    });
  });
}

async function createStockValues() {
  if (grades.length !== 0) {
    grades.forEach((grade) => {
      let gradeSizeValue = document.createElement("span");
      gradeSizeValue.classList.add("selection-box");
      gradeSizeValue.textContent = grade.grade;
      gradeSizeValue.dataset.value = grade.grade;

      document
        .querySelector("#grade-size-selection")
        .appendChild(gradeSizeValue);

      gradeSizeValue.addEventListener("click", () => {
        heightValues = 0;
        standardHeightValues = 0;
        document.querySelector("#average-height-selection").innerHTML = "";

        document.querySelector(
          "#standard-height-selection"
        ).innerHTML = `<span class="selection-box-disabled">None</span>`;

        document
          .querySelectorAll(".grade-selection-value-active")
          .forEach((child) => {
            child.classList.remove("grade-selection-value-active");
          });
        gradeSizeValue.classList.add("grade-selection-value-active");

        treeQuantity.value = 1;

        addToOrderButton.disabled = true;
        treeQuantity.disabled = true;

        for (let i = 0; i < grades.length; i++) {
          if (grades[i].grade === gradeSizeValue.dataset.value) {
            for (let j = 0; j < grades[i].heights.length; j++) {
              let heightValue = document.createElement("span");
              if (grades[i].heights[j].averageHeight !== "") {
                heightValue.dataset.value = grades[i].heights[j].averageHeight;
                heightValue.textContent = `${
                  grades[i].heights[j].averageHeight.toLowerCase() === "n/a"
                    ? grades[i].heights[j].averageHeight
                    : grades[i].heights[j].averageHeight + "m"
                }`;
              } else {
                heightValue.value = "N/A";
                heightValue.textContent = "N/A";
              }

              heightValue.classList.add("selection-box");

              document
                .querySelector("#average-height-selection")
                .appendChild(heightValue);

              heightValues += 1;

              heightValue.addEventListener("click", () => {
                standardHeightValues = 0;
                quantityField.textContent = "0";
                wholesalePriceField.textContent = "$0.00+GST (Wholesale)";
                retailPriceField.textContent = "$0.00+GST (Retail)";

                document.querySelector("#standard-height-selection").innerHTML =
                  "";
                document
                  .querySelectorAll(".height-selection-value-active")
                  .forEach((child) => {
                    child.classList.remove("height-selection-value-active");
                  });
                heightValue.classList.add("height-selection-value-active");

                createHeights(
                  gradeSizeValue.dataset.value,
                  heightValue.dataset.value
                );
              });
            }

            quantityField.textContent = "0";
            wholesalePriceField.textContent = "$0.00+GST (Wholesale)";
            retailPriceField.textContent = "$0.00+GST (Retail)";

            break;
          }
        }

        if (heightValues === 1) {
          document.querySelector("#standard-height-selection").innerHTML = "";
          let heightChildren = document.querySelector(
            "#average-height-selection"
          ).children;
          heightChildren[0].classList.add("height-selection-value-active");
          createHeights(
            gradeSizeValue.dataset.value,
            heightChildren[0].dataset.value
          );
        }
      });

      // if (parseInt(grade.comingOn) !== 0 && !Number.isNaN(grade.comingOn)) {
      //   comingOnField.style.setProperty("display", "none");
      //   comingOn.innerHTML += `<span class="info-pill">${grade.grade} - ${grade.comingOn} total</span>`;
      // }
    });

    quantityField.textContent = "0";
    wholesalePriceField.textContent = "$0.00+GST (Wholesale)";
    retailPriceField.textContent = "$0.00+GST (Retail)";
  } else {
    gradeSizesDiv.innerHTML = ``;
    let message = document.createElement("p");
    message.textContent = "Currently out of stock.";
    message.classList.add("bold-up");
    gradeSizesDiv.appendChild(message);
    gradeSizesDiv.style.setProperty("grid-template-columns", "1fr");
    gradeSizesDiv.style.setProperty("margin-top", "0");

    stockValuesDiv.style.setProperty("display", "none");
    // document.querySelector("#coming-on").style.setProperty("display", "none");
  }
}

function addTreeToLocalStorage() {
  productTrees = JSON.parse(localStorage.getItem("trees"));
  let totalRetailCost = 0;
  let totalWholesaleCost = 0;

  if (productTrees.length === 0) {
    productTrees.push({
      botanicalName: treeBotanicalName.innerHTML,
      commonName: treeCommonName.textContent,
      url: window.location.pathname,
      mainImage: productImage,
      grade: document.querySelector(".grade-selection-value-active").dataset
        .value,
      averageHeight: document.querySelector(".height-selection-value-active")
        .dataset.value,
      quantity: parseInt(treeQuantity.value, 10),
      maxQuantity: parseInt(treeQuantity.max),
      standardHeight: document
        .querySelector(".standard-selection-value-active")
        .dataset.value.split("?q=")[0],
      retailPrice: document
        .querySelector("#retail-price")
        .textContent.split(".00+GST")[0],
      wholesalePrice: document
        .querySelector("#wholesale-price")
        .textContent.split(".00+GST")[0],
    });
  } else {
    for (let i = 0; i < productTrees.length + 1; i++) {
      if (i === productTrees.length) {
        productTrees.push({
          botanicalName: treeBotanicalName.innerHTML,
          commonName: treeCommonName.textContent,
          url: window.location.pathname,
          mainImage: productImage,
          grade: document.querySelector(".grade-selection-value-active").dataset
            .value,
          averageHeight: document.querySelector(
            ".height-selection-value-active"
          ).dataset.value,
          quantity: parseInt(treeQuantity.value, 10),
          maxQuantity: parseInt(treeQuantity.max),
          standardHeight: document
            .querySelector(".standard-selection-value-active")
            .dataset.value.split("?q=")[0],
          retailPrice: document
            .querySelector("#retail-price")
            .textContent.split(".00+GST")[0],
          wholesalePrice: document
            .querySelector("#wholesale-price")
            .textContent.split(".00+GST")[0],
        });
        break;
      } else {
        productTrees[i].quantity = parseInt(productTrees[i].quantity, 10);
        if (productTrees[i].botanicalName === treeBotanicalName.innerHTML) {
          if (
            productTrees[i].grade ===
            document.querySelector(".grade-selection-value-active").dataset
              .value
          ) {
            if (
              productTrees[i].averageHeight ===
              document.querySelector(".height-selection-value-active").dataset
                .value
            ) {
              if (
                productTrees[i].standardHeight ===
                document
                  .querySelector(".standard-selection-value-active")
                  .dataset.value.split("?q=")[0]
              ) {
                productTrees[i].quantity += parseInt(treeQuantity.value, 10);
                if (productTrees[i].quantity >= productTrees[i].maxQuantity) {
                  productTrees[i].quantity = productTrees[i].maxQuantity;
                  maximumQuantityReached = true;
                }
                break;
              }
            }
          }
        }
      }
    }
  }

  productTrees.forEach((tree) => {
    totalRetailCost += tree.quantity * parseInt(tree.retailPrice.slice(1), 10);
    totalWholesaleCost +=
      tree.quantity * parseInt(tree.wholesalePrice.slice(1), 10);
  });

  localStorage.setItem("trees", JSON.stringify(productTrees));
  localStorage.setItem("totalRetailCost", JSON.stringify(totalRetailCost));
  localStorage.setItem(
    "totalWholesaleCost",
    JSON.stringify(totalWholesaleCost)
  );
}

function createHeights(grade, height) {
  treeQuantity.value = 1;

  addToOrderButton.disabled = true;
  treeQuantity.disabled = true;

  for (let i = 0; i < grades.length; i++) {
    if (grades[i].grade === grade) {
      let noStandardHeightQuantity = 0;
      for (let j = 0; j < grades[i].heights.length; j++) {
        if (grades[i].heights[j].averageHeight === height) {
          for (
            let k = 0;
            k < grades[i].heights[j].standardHeights.length;
            k++
          ) {
            let standardHeightValue = document.createElement("span");
            if (
              grades[i].heights[j].standardHeights[k].standardHeight.trim() !==
                "" &&
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "bushy" &&
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "l/w" &&
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "lw" &&
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "ct"
            ) {
              standardHeightValue.dataset.value = `${grades[i].heights[j].standardHeights[k].standardHeight}?q=${grades[i].heights[j].standardHeights[k].quantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

              if (
                grades[i].heights[j].standardHeights[k].standardHeight.match(
                  /\d+/g
                ) !== null
              ) {
                standardHeightValue.textContent =
                  grades[i].heights[j].standardHeights[k].standardHeight + "m";
              } else {
                standardHeightValue.textContent =
                  grades[i].heights[j].standardHeights[k].standardHeight;
              }

              standardHeightValue.classList.add("selection-box");

              document
                .querySelector("#standard-height-selection")
                .appendChild(standardHeightValue);

              standardHeightValues += 1;

              standardHeightValue.addEventListener("click", () => {
                standardHeightValues = 0;
                document
                  .querySelectorAll(".standard-selection-value-active")
                  .forEach((child) => {
                    child.classList.remove("standard-selection-value-active");
                  });
                standardHeightValue.classList.add(
                  "standard-selection-value-active"
                );

                let parameters =
                  standardHeightValue.dataset.value.split("?")[1];
                let standardQuantity = parameters.split("&")[0];
                let wholesalePrice = parameters.split("&")[1];
                let retailPrice = parameters.split("&")[2];

                quantityField.textContent = `${
                  standardQuantity.split("q=")[1]
                }`;
                wholesalePriceField.textContent = `${
                  wholesalePrice.split("wp=")[1]
                }.00+GST (Wholesale)`;
                retailPriceField.textContent = `${
                  retailPrice.split("rp=")[1]
                }.00+GST (Retail)`;

                if (parseInt(standardQuantity.split("q=")[1]) === 0) {
                  addToOrderButton.disabled = true;
                  treeQuantity.disabled = true;
                  treeQuantity.value = 1;
                } else {
                  addToOrderButton.disabled = false;
                  treeQuantity.disabled = false;
                  treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
                  treeQuantity.onchange = function () {
                    if (this.value < 1) {
                      this.value = 1;
                    } else if (
                      this.value > parseInt(standardQuantity.split("q=")[1])
                    ) {
                      this.value = parseInt(standardQuantity.split("q=")[1]);
                    }
                  };
                }
              });
            } else if (
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "column"
            ) {
              standardHeightValue = document.createElement("span");

              standardHeightValue.textContent = "None";

              noStandardHeightQuantity +=
                grades[i].heights[j].standardHeights[k].quantity;

              standardHeightValue.dataset.value = `None?q=${noStandardHeightQuantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

              standardHeightValue.classList.add("selection-box");

              document
                .querySelector("#standard-height-selection")
                .appendChild(standardHeightValue);

              standardHeightValues += 1;

              standardHeightValue.addEventListener("click", () => {
                standardHeightValues = 0;
                document
                  .querySelectorAll(".standard-selection-value-active")
                  .forEach((child) => {
                    child.classList.remove("standard-selection-value-active");
                  });
                standardHeightValue.classList.add(
                  "standard-selection-value-active"
                );

                let parameters =
                  standardHeightValue.dataset.value.split("?")[1];
                let standardQuantity = parameters.split("&")[0];
                let wholesalePrice = parameters.split("&")[1];
                let retailPrice = parameters.split("&")[2];

                quantityField.textContent = `${
                  standardQuantity.split("q=")[1]
                }`;
                wholesalePriceField.textContent = `${
                  wholesalePrice.split("wp=")[1]
                }.00+GST (Wholesale)`;
                retailPriceField.textContent = `${
                  retailPrice.split("rp=")[1]
                }.00+GST (Retail)`;

                if (parseInt(standardQuantity.split("q=")[1]) === 0) {
                  addToOrderButton.disabled = true;
                  treeQuantity.disabled = true;
                  treeQuantity.value = 1;
                } else {
                  addToOrderButton.disabled = false;
                  treeQuantity.disabled = false;
                  treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
                  treeQuantity.onchange = function () {
                    if (this.value < 1) {
                      this.value = 1;
                    } else if (
                      this.value > parseInt(standardQuantity.split("q=")[1])
                    ) {
                      this.value = parseInt(standardQuantity.split("q=")[1]);
                    }
                  };
                }
              });
            }
          }

          break;
        }
      }
      break;
    }
  }

  if (standardHeightValues === 1) {
    let standardChildren = document.querySelector(
      "#standard-height-selection"
    ).children;
    standardChildren[0].classList.add("standard-selection-value-active");

    let parameters = standardChildren[0].dataset.value.split("?")[1];
    let standardQuantity = parameters.split("&")[0];
    let wholesalePrice = parameters.split("&")[1];
    let retailPrice = parameters.split("&")[2];

    quantityField.textContent = `${standardQuantity.split("q=")[1]}`;
    wholesalePriceField.textContent = `${
      wholesalePrice.split("wp=")[1]
    }.00+GST (Wholesale)`;
    retailPriceField.textContent = `${
      retailPrice.split("rp=")[1]
    }.00+GST (Retail)`;

    if (parseInt(standardQuantity.split("q=")[1]) === 0) {
      addToOrderButton.disabled = true;
      treeQuantity.disabled = true;
      treeQuantity.value = 1;
    } else {
      addToOrderButton.disabled = false;
      treeQuantity.disabled = false;
      treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
      treeQuantity.onchange = function () {
        if (this.value < 1) {
          this.value = 1;
        } else if (this.value > parseInt(standardQuantity.split("q=")[1])) {
          this.value = parseInt(standardQuantity.split("q=")[1]);
        }
      };
    }
  }
}

async function createStockTable() {
  let heading = [];
  if (document.body.classList.contains("loggedIn")) {
    heading = [
      "GRADE",
      "$RETAIL",
      "$WHOLESALE",
      "HEIGHT (m)",
      "STANDARD HEIGHT (m)",
      "READY",
      "IN PRODUCTION",
    ];
  } else {
    heading = [
      "GRADE",
      "$RETAIL",
      "HEIGHT (m)",
      "STANDARD HEIGHT (m)",
      "READY",
      "IN PRODUCTION",
    ];
  }

  newData = stockData.filter((item) => {
    let testItem = item[0]
      .trim()
      .replace(/ã/g, "a")
      .replace(/é/g, "e")
      .replace(/ā/g, "a")
      .replace(/ē/g, "e")
      .replace(/ī/g, "i")
      .replace(/ō/g, "o")
      .replace(/ū/g, "u")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .replace(/\./g, "")
      .replace(/ var /g, " ")
      .replace(/ x /g, " ")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\\/g, " ")
      .replace(/\//g, " ")
      .replace(/ /g, "-")
      .toLowerCase();
    return (
      testItem ===
      treeBotanicalName.textContent
        .replace("Prunus dulcis", "Almond")
        .replace("Malus domestica", "Apple")
        .replace("Prunus armeniaca", "Apricot")
        .replace("Persea americana", "Avocado")
        .replace("Prunus avium", "Cherry")
        .replace("Citrus x paradisi", "Citrus grapefruit")
        .replace("Citrus x limon", "Citrus lemon")
        .replace("Citrus x meyeri", "Citrus lemon Meyer")
        .replace("Citrus limon x reticulata", "Citrus Lemonade")
        .replace("Citrus x latifolia", "Citrus lime")
        .replace("Citrus reticulata", "Citrus mandarin")
        .replace("Citrus x sinensis", "Citrus orange")
        .replace("Feijoa sellowiana", "Feijoa")
        .replace("Ficus carica", "Fig")
        .replace("Alectryon excelsus var. excelsus", "Alectryon excelsus")
        .replace("Psidium cattleyanum var. cattleyanum", "Guava Red Cherry")
        .replace("Corylus avellana", "Hazelnut")
        .trim()
        .replace(/ã/g, "a")
        .replace(/é/g, "e")
        .replace(/ā/g, "a")
        .replace(/ē/g, "e")
        .replace(/ī/g, "i")
        .replace(/ō/g, "o")
        .replace(/ū/g, "u")
        .replace(/'/g, "")
        .replace(/"/g, "")
        .replace(/\./g, "")
        .replace(/ var /g, " ")
        .replace(/ x /g, " ")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/\\/g, " ")
        .replace(/\//g, " ")
        .replace(/ /g, "-")
        .toLowerCase()
    );
  });

  let table = document.createElement("table");

  if (newData.length > 0) {
    for (let i = 0; i < newData.length; i++) {
      if (i === 0) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.append(cell);
        });
        table.append(row);
      }

      let row = document.createElement("tr");

      for (let j = 0; j < 10; j++) {
        if (document.body.classList.contains("loggedIn")) {
          if (j !== 0 && j !== 1 && j !== 4) {
            let cell = document.createElement("td");

            cell.textContent = newData[i][j];

            row.append(cell);
          }
        } else {
          if (j !== 0 && j !== 1 && j !== 4 && j !== 5) {
            let cell = document.createElement("td");

            cell.textContent = newData[i][j];

            row.append(cell);
          }
        }
      }

      table.append(row);
    }

    stockTableDiv.append(table);
  } else {
    stockTableDiv.innerHTML = `<p class="bold-up">Currently out of stock.</p>`;
    stockTableDiv.style.setProperty("border", "none");
  }
}

function addEventListeners() {
  window.addEventListener("storage", function (event) {
    if (event.key === "trees") {
      productTrees = JSON.parse(localStorage.getItem(event.key));
    }
  });

  addToOrderButton.addEventListener("click", () => {
    addTreeToLocalStorage();
    window.dispatchEvent(productAdded);

    if (maximumQuantityReached) {
      document.querySelector(
        "#success-message-text"
      ).innerHTML = `You tried adding more trees than we have in stock. Order quantity has been set to the maximum quantity.`;
      maximumQuantityReached = false;
    } else {
      document.querySelector("#success-message-text").innerHTML = `${
        quantity.value
      }<span class="lowercase">x</span> ${
        document.querySelector(".grade-selection-value-active").dataset.value
      } ${treeBotanicalName.innerHTML} ${
        treeCommonName.textContent !== ""
          ? '(<span class="accent-color">' +
            treeCommonName.textContent +
            "</span>)"
          : ""
      } added to order.`;
    }

    successMessage.style.setProperty("opacity", "1");
    successMessage.style.setProperty("visibility", "visible");

    setTimeout(() => {
      successMessage.style.setProperty("opacity", "0");
      successMessage.style.setProperty("visibility", "hidden");
    }, 4000);
  });

  document.querySelector("#open-stock-table").addEventListener("click", () => {
    document.body.classList.add("stock-table-open");
  });

  document.querySelector("#stock-table-close").addEventListener("click", () => {
    document.body.classList.remove("stock-table-open");
  });
}
