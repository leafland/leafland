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
let comingOn = document.querySelector("#coming-on");

let imageLeftButton = document.querySelector("#image-left-button");
let imageRightButton = document.querySelector("#image-right-button");
let imagePosition = 0;
let thumbImages = document.querySelectorAll(".thumb-image");

let productImage = "";
let maximumQuantityReached = false;

let quantityField = document.querySelector("#quantity-field");
let wholesalePriceField = document.querySelector("#wholesale-price");
let retailPriceField = document.querySelector("#retail-price");
let comingOnField = document.querySelector("#coming-on-field");

let showInfoTableButton = document.querySelector(
  "#show-tree-information-table"
);

let productTrees = JSON.parse(localStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];

window.addEventListener("loginUpdated", () => {
  (async function init() {
    addEventListeners();

    await createTreeImages();

    await getProductStockData();
    await createStockValues();
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
      .trim()
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
    }?tr=w-1000,q-75,pr-true,f-auto' height="1000" width="1000" alt="${
      mainImg.alt
    }" srcset="${
      mainImg.src.split("?")[0]
    }?tr=w-300,q-75,pr-true,f-auto 300w, ${
      mainImg.src.split("?")[0]
    }?tr=w-500,q-75,pr-true,f-auto 500w, ${
      mainImg.src.split("?")[0]
    }?tr=w-700w,q-75,pr-true,f-auto 700w" sizes="1000px">`;
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
          }?tr=w-500,q-75,pr-true,f-auto" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");
        }, 500);

        mainImage.addEventListener("click", () => {
          imageLightboxInner.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?tr=w-1000,q-75,pr-true,f-auto" height="1000" width="1000" alt="${
            thumbImage.alt
          }" srcset="${
            thumbImage.src.split("?")[0]
          }?tr=w-300,q-75,pr-true,f-auto 300w, ${
            thumbImage.src.split("?")[0]
          }?tr=w-500,q-75,pr-true,f-auto 500w, ${
            thumbImage.src.split("?")[0]
          }?tr=w-700w,q-75,pr-true,f-auto 700w" sizes="1000px">`;
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
          }?tr=w-500,q-75,pr-true,f-auto" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?tr=w-1000,q-75,pr-true,f-auto" height="1000" width="1000" alt="${
              thumbImage.alt
            }" srcset="${
              thumbImage.src.split("?")[0]
            }?tr=w-300,q-75,pr-true,f-auto 300w, ${
              thumbImage.src.split("?")[0]
            }?tr=w-500,q-75,pr-true,f-auto 500w, ${
              thumbImage.src.split("?")[0]
            }?tr=w-700w,q-75,pr-true,f-auto 700w" sizes="1000px">`;
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
          }?tr=w-500,q-75,pr-true,f-auto" height="500" width="500" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?tr=w-1000,q-75,pr-true,f-auto" height="1000" width="1000" alt="${
              thumbImage.alt
            }" srcset="${
              thumbImage.src.split("?")[0]
            }?tr=w-300,q-75,pr-true,f-auto 300w, ${
              thumbImage.src.split("?")[0]
            }?tr=w-500,q-75,pr-true,f-auto 500w, ${
              thumbImage.src.split("?")[0]
            }?tr=w-700w,q-75,pr-true,f-auto 700w" sizes="1000px">`;
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
      let selectValue = document.createElement("option");
      selectValue.value = grade.grade;

      selectValue.textContent = grade.grade;

      gradeSizeSelect.appendChild(selectValue);

      if (parseInt(grade.comingOn) !== 0 && !Number.isNaN(grade.comingOn)) {
        comingOnField.style.setProperty("display", "none");
        comingOn.innerHTML += `<span class="info-pill">${grade.grade} - ${grade.comingOn} total</span>`;
      }
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
    document
      .querySelector("#grade-sizes-heading")
      .style.setProperty("display", "none");
    document
      .querySelector("#success-message")
      .style.setProperty("display", "none");
    stockValuesDiv.style.setProperty("display", "none");
    document.querySelector("#coming-on").style.setProperty("display", "none");
  }
}

function addTreeToLocalStorage() {
  productTrees = JSON.parse(localStorage.getItem("trees"));
  let totalRetailCost = 0;
  let totalWholesaleCost = 0;

  if (productTrees.length === 0) {
    productTrees.push({
      botanicalName: treeBotanicalName.textContent,
      commonName: treeCommonName.textContent,
      url: window.location.pathname,
      mainImage: productImage,
      grade: gradeSizeSelect.value,
      averageHeight: heightSelect.value,
      quantity: parseInt(treeQuantity.value, 10),
      maxQuantity: treeQuantity.max,
      standardHeight: standardHeightSelect.value.split("?q=")[0],
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
          botanicalName: treeBotanicalName.textContent,
          commonName: treeCommonName.textContent,
          url: window.location.pathname,
          mainImage: productImage,
          grade: gradeSizeSelect.value,
          averageHeight: heightSelect.value,
          quantity: parseInt(treeQuantity.value, 10),
          maxQuantity: treeQuantity.max,
          standardHeight: standardHeightSelect.value.split("?q=")[0],
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
        if (productTrees[i].botanicalName === treeBotanicalName.textContent) {
          if (productTrees[i].grade === gradeSizeSelect.value) {
            if (productTrees[i].averageHeight === heightSelect.value) {
              if (
                productTrees[i].standardHeight ===
                standardHeightSelect.value.split("?q=")[0]
              ) {
                productTrees[i].quantity += parseInt(treeQuantity.value, 10);
                if (productTrees[i].quantity > productTrees[i].maxQuantity) {
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

function createStandardHeights(event = 0) {
  treeQuantity.value = 1;

  let parameters;

  if (event === 0) {
    parameters = standardHeightSelect[0].value.split("?")[1];
  } else {
    parameters = event.target.value.split("?")[1];
  }

  // let standardHeight = event.target.value.split("?")[0];
  // let parameters = event.target.value.split("?")[1];
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

function createHeights(event = 0) {
  standardHeightSelect.innerHTML = "";
  treeQuantity.value = 1;

  addToOrderButton.disabled = true;
  treeQuantity.disabled = true;
  standardHeightSelect.disabled = false;
  standardHeightSelect.innerHTML = `<option selected disabled hidden>Select height</option>`;

  let standardHeightValue, noneRetailPrice, noneWholesalePrice;

  let compareHeight;

  if (event === 0) {
    compareHeight = heightSelect.value;
  } else {
    compareHeight = event.target.value;
  }

  for (let i = 0; i < grades.length; i++) {
    if (grades[i].grade === gradeSizeSelect.value) {
      let noStandardHeightQuantity = 0;
      for (let j = 0; j < grades[i].heights.length; j++) {
        if (grades[i].heights[j].averageHeight === compareHeight) {
          let noneExists = false;
          for (
            let k = 0;
            k < grades[i].heights[j].standardHeights.length;
            k++
          ) {
            let standardHeightValue = document.createElement("option");
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
              standardHeightValue.value = `${grades[i].heights[j].standardHeights[k].standardHeight}?q=${grades[i].heights[j].standardHeights[k].quantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

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

              standardHeightSelect.appendChild(standardHeightValue);
            } else if (
              grades[i].heights[j].standardHeights[k].standardHeight
                .toLowerCase()
                .trim() !== "column"
            ) {
              noneExists = true;
              standardHeightValue = document.createElement("option");

              standardHeightValue.textContent = "None";

              noStandardHeightQuantity +=
                grades[i].heights[j].standardHeights[k].quantity;

              standardHeightValue.value = `None?q=${noStandardHeightQuantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

              standardHeightSelect.appendChild(standardHeightValue);

              noneRetailPrice =
                grades[i].heights[j].standardHeights[k].retailPrice;
              noneWholesalePrice =
                grades[i].heights[j].standardHeights[k].wholesalePrice;
            }
          }

          for (let i = 0; i < standardHeightSelect.length; i++) {
            if (
              standardHeightSelect.options[i].value.search("None") !== -1 &&
              standardHeightSelect.length === 2
            ) {
              standardHeightSelect.remove(0);

              quantityField.textContent = `${noStandardHeightQuantity}`;
              wholesalePriceField.textContent = `${noneWholesalePrice}.00+GST (Wholesale)`;
              retailPriceField.textContent = `${noneRetailPrice}.00+GST (Retail)`;

              if (noStandardHeightQuantity === 0) {
                addToOrderButton.disabled = true;
                treeQuantity.disabled = true;
                treeQuantity.value = 1;
              } else {
                addToOrderButton.disabled = false;
                treeQuantity.disabled = false;
                treeQuantity.max = noStandardHeightQuantity;
                treeQuantity.onchange = function () {
                  if (this.value < 1) {
                    this.value = 1;
                  } else if (this.value > noStandardHeightQuantity) {
                    this.value = noStandardHeightQuantity;
                  }
                };
              }
              break;
            } else if (standardHeightSelect.length === 2) {
              let standardValue = standardHeightSelect.options[1].value;

              let standard = standardValue.split("?")[0];
              let parameters = standardValue.split("?")[1];
              let standardQuantity = parameters.split("&")[0];
              let wholesalePrice = parameters.split("&")[1];
              let retailPrice = parameters.split("&")[2];

              standardHeightSelect.remove(0);

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
                  } else if (
                    this.value > parseInt(standardQuantity.split("q=")[1])
                  ) {
                    this.value = parseInt(standardQuantity.split("q=")[1]);
                  }
                };
              }
              break;
            } else {
              quantityField.textContent = `0`;
              wholesalePriceField.textContent = `$0.00+GST (Wholesale)`;
              retailPriceField.textContent = `$0.00+GST (Retail)`;
            }
          }
          break;
        }
      }
      break;
    }
  }
}

function addEventListeners() {
  showInfoTableButton.addEventListener("click", () => {
    if (
      document.querySelector("#tree-information-table").style.display === "none"
    ) {
      document.querySelector("#tree-information-table").style.display = "grid";
      showInfoTableButton.textContent = "Hide information table";
    } else {
      document.querySelector("#tree-information-table").style.display = "none";
      showInfoTableButton.textContent = "Show information table";
    }
  });

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
      }<span class="lowercase">x</span> ${gradeSizeSelect.value} ${
        treeBotanicalName.textContent
      } ${
        treeCommonName.textContent !== ""
          ? '(<span class="accent-color">' +
            treeCommonName.textContent +
            "</span>)"
          : ""
      } added to order.`;
    }

    successMessage.style.setProperty("opacity", "1");
    successMessage.style.setProperty("visibility", "visible");
    successMessage.style.setProperty("z-index", "10");

    setTimeout(() => {
      successMessage.style.setProperty("opacity", "0");
      successMessage.style.setProperty("visibility", "hidden");
      successMessage.style.setProperty("z-index", "-1");
    }, 4000);
  });

  gradeSizeSelect.addEventListener("change", (event) => {
    heightSelect.innerHTML = "";
    standardHeightSelect.innerHTML = "";
    treeQuantity.value = 1;

    addToOrderButton.disabled = true;
    treeQuantity.disabled = true;
    standardHeightSelect.disabled = true;
    heightSelect.disabled = false;

    heightSelect.innerHTML = `<option selected disabled hidden>Select height</option>`;
    standardHeightSelect.innerHTML = `<option selected disabled hidden>Select height</option>`;

    for (let i = 0; i < grades.length; i++) {
      if (grades[i].grade === event.target.value.split("-0")[0]) {
        for (let j = 0; j < grades[i].heights.length; j++) {
          let heightValue = document.createElement("option");
          if (grades[i].heights[j].averageHeight !== "") {
            heightValue.value = grades[i].heights[j].averageHeight;
            heightValue.textContent = `${
              grades[i].heights[j].averageHeight.toLowerCase() === "n/a"
                ? grades[i].heights[j].averageHeight
                : grades[i].heights[j].averageHeight + "m"
            }`;
          } else {
            heightValue.value = "N/A";
            heightValue.textContent = "N/A";
          }
          heightSelect.appendChild(heightValue);
        }

        quantityField.textContent = "0";
        wholesalePriceField.textContent = "$0.00+GST (Wholesale)";
        retailPriceField.textContent = "$0.00+GST (Retail)";

        break;
      }
    }

    if (heightSelect.length === 2) {
      heightSelect.remove(0);
      createHeights();

      if (standardHeightSelect.length < 2) {
        createStandardHeights();
      }
    } else if (heightSelect.length === 1) {
      createHeights();
      if (standardHeightSelect.length < 2) {
        createStandardHeights();
      }
    }
  });

  heightSelect.addEventListener("change", (event) => {
    createHeights(event);
  });

  standardHeightSelect.addEventListener("change", (event) => {
    createStandardHeights(event);
  });
}
