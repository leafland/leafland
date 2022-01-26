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

let productStockData = [];
let productImage = "";
let maximumQuantityReached = false;

let productTrees = JSON.parse(localStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];

window.addEventListener("loginUpdated", () => {
  (async function init() {
    addEventListeners();

    await createTreeImages();

    await getProductStockData();
    await createStockValues(grades);
  })();
});

async function getProductStockData() {
  productStockData = await fetch(
    `https://api.leafland.co.nz/default/get-stock-data-file`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});

  for (let i = 0; i < productStockData.length; i++) {
    if (treeCommonName.textContent.toLowerCase() === "serrula interstem") {
      if (
        `${treeBotanicalName.textContent} serrula interstem`
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/ var. /g, " ")
          .replace(/ x /g, " ")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .toLowerCase()
          .trim() !==
        productStockData[i][0]
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/ var. /g, " ")
          .replace(/ x /g, " ")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .toLowerCase()
          .trim()
      ) {
        productStockData.splice(i, 1);
        i--;
      }
    } else {
      if (
        treeBotanicalName.textContent
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/ var. /g, " ")
          .replace(/ x /g, " ")
          .toLowerCase()
          .trim() !==
        productStockData[i][0]
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/ var. /g, " ")
          .replace(/ x /g, " ")
          .toLowerCase()
          .trim()
      ) {
        productStockData.splice(i, 1);
        i--;
      }
    }
  }
}

async function createTreeImages() {
  imageLightBoxClose.addEventListener("click", () => {
    document.body.classList.remove("lightbox-open");
  });

  let mainImg = document.querySelector(".main-img");
  productImage = mainImg.src.split("images/trees/")[1].split("?")[0];
  mainImg.addEventListener("click", () => {
    imageLightboxInner.innerHTML = `<img src='${mainImg.src}'>`;
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
          }" class="main-img" style="opacity: 1;" srcset="${
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
            }" class="main-img" style="opacity: 1;" srcset="${
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
            }" class="main-img" style="opacity: 1;" srcset="${
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
  if (productStockData.length !== 0) {
    for (let i = 0; i < productStockData.length; i++) {
      if (grades.length === 0) {
        grades.push({
          grade: productStockData[i][2],
          heights: [
            {
              averageHeight:
                productStockData[i][6] === "" ? "N/A" : productStockData[i][6],
              standardHeights: [
                {
                  quantity: parseInt(productStockData[i][8], 10),
                  standardHeight: productStockData[i][7],
                  retailPrice: productStockData[i][3].replace(/,/g, ""),
                  wholesalePrice: productStockData[i][5].replace(/,/g, ""),
                },
              ],
            },
          ],
          comingOn: parseInt(productStockData[i][9]),
        });
      } else {
        for (let j = 0; j < grades.length + 1; j++) {
          if (j === grades.length) {
            grades.push({
              grade: productStockData[i][2],
              heights: [
                {
                  averageHeight:
                    productStockData[i][6] === ""
                      ? "N/A"
                      : productStockData[i][6],
                  standardHeights: [
                    {
                      quantity: parseInt(productStockData[i][8], 10),
                      standardHeight: productStockData[i][7],
                      retailPrice: productStockData[i][3].replace(/,/g, ""),
                      wholesalePrice: productStockData[i][5].replace(/,/g, ""),
                    },
                  ],
                },
              ],
              comingOn: parseInt(productStockData[i][9]),
            });

            break;
          } else {
            if (
              grades[j].grade.toLowerCase() ===
              productStockData[i][2].toLowerCase()
            ) {
              grades[j].comingOn += parseInt(productStockData[i][9]);

              for (let k = 0; k < grades[j].heights.length + 1; k++) {
                if (k === grades[j].heights.length) {
                  grades[j].heights.push({
                    averageHeight:
                      productStockData[i][6] === ""
                        ? "N/A"
                        : productStockData[i][6],
                    standardHeights: [
                      {
                        quantity: parseInt(productStockData[i][8], 10),
                        standardHeight: productStockData[i][7],
                        retailPrice: productStockData[i][3].replace(/,/g, ""),
                        wholesalePrice: productStockData[i][5].replace(
                          /,/g,
                          ""
                        ),
                      },
                    ],
                  });
                  break;
                } else {
                  if (
                    grades[j].heights[k].averageHeight ===
                      productStockData[i][6] ||
                    (grades[j].heights[k].averageHeight === "N/A" &&
                      productStockData[i][6] === "")
                  ) {
                    for (
                      let l = 0;
                      l < grades[j].heights[k].standardHeights.length + 1;
                      l++
                    ) {
                      if (l === grades[j].heights[k].standardHeights.length) {
                        grades[j].heights[k].standardHeights.push({
                          quantity: parseInt(productStockData[i][8], 10),
                          standardHeight: productStockData[i][7],
                          retailPrice: productStockData[i][3].replace(/,/g, ""),
                          wholesalePrice: productStockData[i][5].replace(
                            /,/g,
                            ""
                          ),
                        });
                        break;
                      } else {
                        if (
                          grades[j].heights[k].standardHeights[l]
                            .standardHeight === productStockData[i][7]
                        ) {
                          grades[j].heights[k].standardHeights[l].quantity =
                            parseInt(
                              grades[j].heights[k].standardHeights[l].quantity,
                              10
                            );
                          grades[j].heights[k].standardHeights[l].quantity +=
                            parseInt(productStockData[i][8], 10);
                          break;
                        }
                      }
                    }

                    break;
                  }
                }
              }

              break;
            }
          }
        }
      }
    }

    grades.forEach((grade) => {
      let selectValue = document.createElement("option");
      selectValue.value = grade.grade;

      selectValue.textContent = grade.grade;

      gradeSizeSelect.appendChild(selectValue);

      if (parseInt(grade.comingOn) !== 0 && !Number.isNaN(grade.comingOn)) {
        comingOn.innerHTML += `<span class="info-pill">${grade.grade} - ${grade.comingOn} total</span>`;
      }
    });

    if (comingOn.textContent.length === 17) {
      comingOn.innerHTML += ' <span class="info-pill">none</span>';
    }

    let noStandardHeightQuantity = 0;

    grades[0].heights.forEach((height) => {
      let heightValue = document.createElement("option");
      if (height.averageHeight !== "") {
        heightValue.value = height.averageHeight;
        heightValue.textContent = `${
          height.averageHeight.toLowerCase() === "n/a"
            ? height.averageHeight
            : height.averageHeight + "m"
        }`;
      } else {
        heightValue.value = "N/A";
        heightValue.textContent = "N/A";
      }

      heightSelect.appendChild(heightValue);

      grades[0].heights[0].standardHeights.forEach((standardHeight) => {
        let standardHeightValue = document.createElement("option");
        if (
          standardHeight.standardHeight.trim() !== "" &&
          standardHeight.standardHeight.toLowerCase().trim() !== "bushy" &&
          standardHeight.standardHeight.toLowerCase().trim() !== "l/w" &&
          standardHeight.standardHeight.toLowerCase().trim() !== "lw" &&
          standardHeight.standardHeight.toLowerCase().trim() !== "ct"
        ) {
          standardHeightValue.value = `${standardHeight.standardHeight}?q=${standardHeight.quantity}`;
          if (standardHeight.standardHeight.match(/\d+/g) !== null) {
            standardHeightValue.textContent =
              standardHeight.standardHeight + "m";
          } else {
            standardHeightValue.textContent = standardHeight.standardHeight;
          }
          standardHeightSelect.appendChild(standardHeightValue);
        } else if (
          standardHeight.standardHeight.toLowerCase().trim() !== "column"
        ) {
          noStandardHeightQuantity += standardHeight.quantity;
        }
      });
    });

    let standardHeightValue = document.createElement("option");
    standardHeightValue.value = `None?q=${noStandardHeightQuantity}`;
    standardHeightValue.textContent = "None";
    standardHeightSelect.appendChild(standardHeightValue);

    let quantity = document.createElement("p");
    quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">0</span>`;

    let stockPrice = document.createElement("p");
    stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">$0.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">$0.00+GST (Retail)</span>`;

    stockValuesDiv.appendChild(quantity);
    stockValuesDiv.appendChild(stockPrice);

    if (grades[0].heights[0].standardHeights[0].quantity === 0) {
      addToOrderButton.disabled = true;
      treeQuantity.disabled = true;
      treeQuantity.value = 1;
    } else {
      addToOrderButton.disabled = false;
      treeQuantity.disabled = false;
      treeQuantity.max = grades[0].heights[0].standardHeights[0].quantity;
      treeQuantity.onchange = function () {
        if (this.value < 1) {
          this.value = 1;
        } else if (
          this.value > grades[0].heights[0].standardHeights[0].quantity
        ) {
          this.value = grades[0].heights[0].standardHeights[0].quantity;
        }
      };
    }
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
      .querySelector("#stock-information")
      .style.setProperty("display", "none");
    document
      .querySelector("#success-message")
      .style.setProperty("display", "none");
    stockValuesDiv.style.setProperty("display", "none");
    document
      .querySelector(".product-disclaimer")
      .style.setProperty("display", "none");
    document.querySelector("#coming-on").style.setProperty("display", "none");
  }
}

function addTreeToLocalStorage() {
  productTrees = JSON.parse(localStorage.getItem("trees"));
  let totalRetailCost = 0;
  let totalWholesaleCost = 0;

  for (let i = 0; i < grades.length; i++) {
    if (grades[i].grade === gradeSizeSelect.value) {
      for (let j = 0; j < grades[i].heights.length; j++) {
        if (grades[i].heights[j].averageHeight === heightSelect.value) {
          for (
            let k = 0;
            k < grades[i].heights[j].standardHeights.length;
            k++
          ) {
            if (
              grades[i].heights[j].standardHeights[k] ===
              standardHeightSelect.value
            ) {
              retailPrice = `${grades[i].heights[j].standardHeights[k].retailPrice}.00`;
              wholesalePrice = `${grades[i].heights[j].standardHeights[k].wholesalePrice}.00`;
            }
          }
        }
      }
    }
  }

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
      }<span class="lowercase">x</span> ${treeBotanicalName.textContent} ${
        treeCommonName.textContent !== ""
          ? '(<span class="accent-color">' +
            treeCommonName.textContent +
            "</span>)"
          : ""
      } ${gradeSizeSelect.value} added to order.`;
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
    stockValuesDiv.innerHTML = ``;
    heightSelect.innerHTML = "";
    standardHeightSelect.innerHTML = "";
    treeQuantity.value = 1;

    standardHeightSelect.disabled = true;
    heightSelect.disabled = false;

    heightSelect.innerHTML = `<option selected disabled hidden>-Select a height-</option>`;
    standardHeightSelect.innerHTML = `<option selected disabled hidden>-Select a height-</option>`;

    for (let i = 0; i < grades.length; i++) {
      if (grades[i].grade === event.target.value.split("-0")[0]) {
        let noStandardHeightQuantity = 0;

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

        let firstValueNone = false;
        for (let j = 0; j < grades[i].heights[0].standardHeights.length; j++) {
          let standardHeightValue = document.createElement("option");
          if (
            grades[i].heights[0].standardHeights[j].standardHeight.trim() !==
              "" &&
            grades[i].heights[0].standardHeights[j].standardHeight
              .toLowerCase()
              .trim() !== "bushy" &&
            grades[i].heights[0].standardHeights[j].standardHeight
              .toLowerCase()
              .trim() !== "l/w" &&
            grades[i].heights[0].standardHeights[j].standardHeight
              .toLowerCase()
              .trim() !== "lw" &&
            grades[i].heights[0].standardHeights[j].standardHeight
              .toLowerCase()
              .trim() !== "ct"
          ) {
            standardHeightValue.value = `${grades[i].heights[0].standardHeights[j].standardHeight}?q=${grades[i].heights[0].standardHeights[j].quantity}`;

            if (
              grades[i].heights[0].standardHeights[j].standardHeight.match(
                /\d+/g
              ) !== null
            ) {
              standardHeightValue.textContent =
                grades[i].heights[0].standardHeights[j].standardHeight + "m";
            } else {
              standardHeightValue.textContent =
                grades[i].heights[0].standardHeights[j].standardHeight;
            }

            standardHeightSelect.appendChild(standardHeightValue);
          } else if (
            grades[i].heights[0].standardHeights[j].standardHeight
              .toLowerCase()
              .trim() !== "column"
          ) {
            if (j === 0) {
              firstValueNone = true;
            }
            noStandardHeightQuantity +=
              grades[i].heights[0].standardHeights[j].quantity;
          }
        }

        let standardHeightValue = document.createElement("option");
        standardHeightValue.value = `None?q=${noStandardHeightQuantity}`;
        standardHeightValue.textContent = "None";
        standardHeightSelect.appendChild(standardHeightValue);

        let quantity = document.createElement("p");
        quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">0</span>`;

        let stockPrice = document.createElement("p");
        stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">$0.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">$0.00+GST (Retail)</span>`;

        stockValuesDiv.appendChild(quantity);
        stockValuesDiv.appendChild(stockPrice);

        // let standardQuantity = 0;
        // if (firstValueNone) {
        //   standardQuantity = noStandardHeightQuantity;
        // } else {
        //   standardQuantity = grades[i].heights[0].standardHeights[0].quantity;
        // }

        // if (standardQuantity === 0) {
        //   addToOrderButton.disabled = true;
        //   treeQuantity.disabled = true;
        //   treeQuantity.value = 1;
        // } else {
        //   addToOrderButton.disabled = false;
        //   treeQuantity.disabled = false;
        //   treeQuantity.max = standardQuantity;
        //   treeQuantity.onchange = function () {
        //     if (this.value < 1) {
        //       this.value = 1;
        //     } else if (this.value > standardQuantity) {
        //       this.value = standardQuantity;
        //     }
        //   };
        // }
        break;
      }
    }
  });

  heightSelect.addEventListener("change", (event) => {
    stockValuesDiv.innerHTML = ``;
    standardHeightSelect.innerHTML = "";
    treeQuantity.value = 1;

    standardHeightSelect.disabled = false;
    standardHeightSelect.innerHTML = `<option selected disabled hidden>-Select a height-</option>`;

    let standardHeightValue;

    for (let i = 0; i < grades.length; i++) {
      if (grades[i].grade === gradeSizeSelect.value) {
        let noStandardHeightQuantity = 0;
        for (let j = 0; j < grades[i].heights.length; j++) {
          if (grades[i].heights[j].averageHeight === event.target.value) {
            let firstValueNone = false;
            for (
              let k = 0;
              k < grades[i].heights[j].standardHeights.length;
              k++
            ) {
              let standardHeightValue = document.createElement("option");
              if (
                grades[i].heights[j].standardHeights[
                  k
                ].standardHeight.trim() !== "" &&
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
                standardHeightValue.value = `${grades[i].heights[j].standardHeights[k].standardHeight}?q=${grades[i].heights[j].standardHeights[k].quantity}`;

                if (
                  grades[i].heights[j].standardHeights[k].standardHeight.match(
                    /\d+/g
                  ) !== null
                ) {
                  standardHeightValue.textContent =
                    grades[i].heights[j].standardHeights[k].standardHeight +
                    "m";
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
                if (k === 0) {
                  firstValueNone = true;
                  standardHeightValue = document.createElement("option");
                  standardHeightSelect.appendChild(standardHeightValue);
                  standardHeightValue.textContent = "None";
                }
                noStandardHeightQuantity +=
                  grades[i].heights[j].standardHeights[k].quantity;

                standardHeightValue.value = `None?q=${noStandardHeightQuantity}`;
              }
            }

            let quantity = document.createElement("p");
            quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">0</span>`;

            let stockPrice = document.createElement("p");
            stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">$0.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">$0.00+GST (Retail)</span>`;

            stockValuesDiv.appendChild(quantity);
            stockValuesDiv.appendChild(stockPrice);

            // let standardQuantity = 0;
            // if (firstValueNone) {
            //   standardQuantity = noStandardHeightQuantity;
            // } else {
            //   standardQuantity =
            //     grades[i].heights[j].standardHeights[0].quantity;
            // }

            // let quantity = document.createElement("p");
            // quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">${standardQuantity}</span>`;

            // let stockPrice = document.createElement("p");
            // stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">${grades[i].heights[j].standardHeights[0].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">${grades[i].heights[j].standardHeights[0].retailPrice}.00+GST (Retail)</span>`;

            // if (standardQuantity === 0) {
            //   addToOrderButton.disabled = true;
            //   treeQuantity.disabled = true;
            //   treeQuantity.value = 1;
            // } else {
            //   addToOrderButton.disabled = false;
            //   treeQuantity.disabled = false;
            //   treeQuantity.max = standardQuantity;
            //   treeQuantity.onchange = function () {
            //     if (this.value < 1) {
            //       this.value = 1;
            //     } else if (this.value > standardQuantity) {
            //       this.value = standardQuantity;
            //     }
            //   };
            // }

            break;
          }
        }
        break;
      }
    }
  });

  standardHeightSelect.addEventListener("change", (event) => {
    stockValuesDiv.innerHTML = ``;
    treeQuantity.value = 1;
    for (let i = 0; i < grades.length; i++) {
      if (grades[i].grade === gradeSizeSelect.value) {
        for (let j = 0; j < grades[i].heights.length; j++) {
          if (grades[i].heights[j].averageHeight === heightSelect.value) {
            for (
              let k = 0;
              k < grades[i].heights[j].standardHeights.length + 1;
              k++
            ) {
              if (
                grades[i].heights[j].standardHeights[k].standardHeight ===
                event.target.value.split("?q=")[0]
              ) {
                let quantity = document.createElement("p");
                quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">${grades[i].heights[j].standardHeights[k].quantity}</span>`;

                let stockPrice = document.createElement("p");
                stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;

                stockValuesDiv.appendChild(quantity);
                stockValuesDiv.appendChild(stockPrice);

                if (grades[i].heights[j].standardHeights[k].quantity === 0) {
                  addToOrderButton.disabled = true;
                  treeQuantity.disabled = true;
                  treeQuantity.value = 1;
                } else {
                  addToOrderButton.disabled = false;
                  treeQuantity.disabled = false;
                  treeQuantity.max =
                    grades[i].heights[j].standardHeights[k].quantity;
                  treeQuantity.onchange = function () {
                    if (this.value < 1) {
                      this.value = 1;
                    } else if (
                      this.value >
                      grades[i].heights[j].standardHeights[k].quantity
                    ) {
                      this.value =
                        grades[i].heights[j].standardHeights[k].quantity;
                    }
                  };
                }

                break;
              } else if (event.target.value.split("?q=")[0] === "None") {
                let quantity = document.createElement("p");
                quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="info-pill">${
                  event.target.value.split("?q=")[1]
                }</span>`;

                let stockPrice = document.createElement("p");
                stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="info-pill">${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="info-pill">${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;

                stockValuesDiv.appendChild(quantity);
                stockValuesDiv.appendChild(stockPrice);

                if (parseInt(event.target.value.split("?q=")[1]) === 0) {
                  addToOrderButton.disabled = true;
                  treeQuantity.disabled = true;
                  treeQuantity.value = 1;
                } else {
                  addToOrderButton.disabled = false;
                  treeQuantity.disabled = false;
                  treeQuantity.max =
                    grades[i].heights[j].standardHeights[k].quantity;
                  treeQuantity.onchange = function () {
                    if (this.value < 1) {
                      this.value = 1;
                    } else if (
                      this.value >
                      grades[i].heights[j].standardHeights[k].quantity
                    ) {
                      this.value =
                        grades[i].heights[j].standardHeights[k].quantity;
                    }
                  };
                }

                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  });
}
