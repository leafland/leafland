let colorSection = document.querySelector("#color-section");
let relatedTreesSection = document.querySelector("#related-trees");
let relateTreesHeading = document.querySelector("#related-trees-heading");
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

let productTreeData = [];
let productImageData = [];
let productStockData = [];
let gradeImages = [];

let maximumQuantityReached = false;

let productTrees = JSON.parse(localStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];

if (treeCommonName.textContent === "") {
  treeCommonName.style.setProperty("display", "none");
}

window.addEventListener("loginUpdated", () => {
  (async function init() {
    addEventListeners();

    await getProductTreeData();

    if (productTreeData.length > 0) {
      await populateTreeAttributes(productTreeData);

      await getProductImages();
      await createTreeImages(productImageData);

      await getProductStockData();
      await createStockValues(grades);

      await createRelatedTrees(productTreeData);

      document.body.classList.add("page-loaded");
    } else {
    }
  })();
});

async function getProductImages() {
  let url = window.location.pathname;
  url = url.slice(0, url.length - 1);
  url = url.split(/\/trees\//)[1];

  productImageData = await fetch(
    `https://api.leafland.co.nz/default/get-single-product-images?prefix=${url}`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});

  for (let i = 0; i < productImageData.length; i++) {
    if (productImageData[i].Key.search("grades") !== -1) {
      gradeImages.push(productImageData[i].Key);
      productImageData.splice(i, 1);
      i--;
    }

    // Remove images that have similar prefixes e.g. apple-gala and apple-galaxy
    if (productImageData[i].Key.split("/", 3)[2] !== url) {
      productImageData.splice(i, 1);
      i--;
    } else if (
      productImageData[i].Key.search("jpg") === -1 &&
      productImageData[i].Key.search("jpeg") === -1
    ) {
      productImageData.splice(i, 1);
      i--;
    }
  }
}

async function getProductTreeData() {
  let url = window.location.pathname;
  url = url.slice(0, url.length - 1);
  url = url.split(/\/trees\//)[1];

  productTreeData = await fetch(
    `https://api.leafland.co.nz/default/get-product-data?type=product&url=${url}`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

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

async function createTreeImages(productImageData) {
  imagePosition = productImageData.length - 1;

  imageLightBoxClose.addEventListener("click", () => {
    document.body.classList.remove("lightbox-open");
  });

  for (let i = productImageData.length - 1; i >= 0; i--) {
    if (
      !productImageData[i].Key.includes("grades") &&
      (productImageData[i].Key.search("jpg") !== -1 ||
        productImageData[i].Key.search("jpeg") !== -1)
    ) {
      let image = document.createElement("img");
      image.src = `https://ik.imagekit.io/leafland/${productImageData[i].Key}?tr=w-150,q-75,pr-true,f-auto`;
      image.width = "150";
      image.height = "150";
      image.alt = productImageData[i].Key.substring(
        productImageData[i].Key.lastIndexOf("/") + 1,
        productImageData[i].Key.lastIndexOf(".")
      ).replace(/-/g, " ");
      image.loading = "lazy";

      let div = document.createElement("div");
      div.classList.add("image");
      images.appendChild(div);

      div.appendChild(image);

      let fullImage = document.createElement("img");
      fullImage.onload = () => {
        fullImage.style.setProperty("opacity", "1");
      };
      fullImage.src = `https://ik.imagekit.io/leafland/${productImageData[i].Key}?tr=w-1000,q-75,pr-true,f-auto`;
      fullImage.height = "1000";
      fullImage.width = "1000";
      fullImage.alt = productImageData[i].Key.substring(
        productImageData[i].Key.lastIndexOf("/") + 1,
        productImageData[i].Key.lastIndexOf(".")
      ).replace(/-/g, " ");
      fullImage.loading = "lazy";
      fullImage.classList.add("main-img");

      fullImage.addEventListener("click", () => {
        imageLightboxInner.innerHTML = `<img src='https://ik.imagekit.io/leafland/${productImageData[i].Key}?tr=w-1000,q-75,pr-true,f-auto'>`;
        document.body.classList.add("lightbox-open");
      });

      if (i === productImageData.length - 1) {
        mainImage.appendChild(fullImage);
        fullImage.style.setProperty("opacity", "1");
        fullImage.loading = "eager";
      }

      image.addEventListener("click", (e) => {
        let mainImg = document.querySelector(".main-img");
        imagePosition = i;
        e.preventDefault();

        if (mainImg.alt !== image.alt) {
          mainImage.style.setProperty("opacity", "0");
          mainImage.style.setProperty("visibility", "hidden");
          setTimeout(() => {
            mainImage.innerHTML = ``;
            mainImage.appendChild(fullImage);
            mainImage.style.setProperty("opacity", "1");
            mainImage.style.setProperty("visibility", "visible");
          }, 500);
        }
      });
    }
  }

  imageLeftButton.addEventListener("click", () => {
    if (
      productImageData[imagePosition].Key.includes("grades") ||
      (productImageData[imagePosition].Key.search("jpg") === -1 &&
        productImageData[imagePosition].Key.search("jpeg") === -1)
    ) {
      imagePosition += 2;
    } else {
      imagePosition++;
    }

    if (imagePosition > productImageData.length - 1) {
      imagePosition = 0;
    }

    let newImage = document.createElement("img");
    newImage.onload = () => {
      newImage.style.setProperty("opacity", "1");
    };
    newImage.src = `https://ik.imagekit.io/leafland/${productImageData[imagePosition].Key}?tr=w-1000,q-75,pr-true,f-auto`;
    newImage.height = "1000";
    newImage.width = "1000";
    newImage.alt = productImageData[imagePosition].Key.substring(
      productImageData[imagePosition].Key.lastIndexOf("/") + 1,
      productImageData[imagePosition].Key.lastIndexOf(".")
    ).replace(/-/g, " ");
    newImage.loading = "lazy";
    newImage.classList.add("main-img");

    newImage.addEventListener("click", () => {
      imageLightboxInner.innerHTML = `<img src='https://ik.imagekit.io/leafland/${productImageData[imagePosition].Key}?tr=w-1000,q-75,pr-true,f-auto'>`;
      document.body.classList.add("lightbox-open");
    });

    mainImage.style.setProperty("opacity", "0");
    mainImage.style.setProperty("visibility", "hidden");
    setTimeout(() => {
      mainImage.innerHTML = ``;
      mainImage.appendChild(newImage);
      mainImage.style.setProperty("opacity", "1");
      mainImage.style.setProperty("visibility", "visible");
    }, 500);
  });

  imageRightButton.addEventListener("click", () => {
    if (
      productImageData[imagePosition].Key.includes("grades") ||
      (productImageData[imagePosition].Key.search("jpg") === -1 &&
        productImageData[imagePosition].Key.search("jpeg") === -1)
    ) {
      imagePosition -= 2;
    } else {
      imagePosition--;
    }

    if (imagePosition < 0) {
      imagePosition = productImageData.length - 1;
    }

    let newImage = document.createElement("img");
    newImage.onload = () => {
      newImage.style.setProperty("opacity", "1");
    };
    newImage.src = `https://ik.imagekit.io/leafland/${productImageData[imagePosition].Key}?tr=w-1000,q-75,pr-true,f-auto`;
    newImage.height = "1000";
    newImage.width = "1000";
    newImage.alt = productImageData[imagePosition].Key.substring(
      productImageData[imagePosition].Key.lastIndexOf("/") + 1,
      productImageData[imagePosition].Key.lastIndexOf(".")
    ).replace(/-/g, " ");
    newImage.loading = "lazy";
    newImage.classList.add("main-img");

    newImage.addEventListener("click", () => {
      imageLightboxInner.innerHTML = `<img src='https://ik.imagekit.io/leafland/${productImageData[imagePosition].Key}?tr=w-1000,q-75,pr-true,f-auto'>`;
      document.body.classList.add("lightbox-open");
    });

    mainImage.style.setProperty("opacity", "0");
    mainImage.style.setProperty("visibility", "hidden");
    setTimeout(() => {
      mainImage.innerHTML = ``;
      mainImage.appendChild(newImage);
      mainImage.style.setProperty("opacity", "1");
      mainImage.style.setProperty("visibility", "visible");
    }, 500);
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

      if (parseInt(grade.comingOn) !== 0) {
        if (comingOn.textContent.length === 17) {
          comingOn.innerHTML += ` ${grade.grade} (<span class="accent-color">${grade.comingOn}</span>)`;
        } else {
          comingOn.innerHTML += `, ${grade.grade} (<span class="accent-color">${grade.comingOn}</span>)`;
        }
      }
    });

    if (comingOn.textContent.length === 17) {
      comingOn.innerHTML += ' <span class="accent-color">none</span>';
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
    quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="quantity accent-color">${grades[0].heights[0].standardHeights[0].quantity}</span>`;

    let stockPrice = document.createElement("p");
    stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="accent-color">${grades[0].heights[0].standardHeights[0].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="accent-color">${grades[0].heights[0].standardHeights[0].retailPrice}.00+GST (Retail)</span>`;

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
    let message = document.createElement("h2");
    message.textContent = "Currently out of stock.";
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

function checkColors(colorData, spanNode) {
  switch (colorData) {
    case "blue":
      spanNode.classList.add("blue");
      break;
    case "grey":
      spanNode.classList.add("grey");
      break;
    case "red":
      spanNode.classList.add("red");
      break;
    case "orange":
      spanNode.classList.add("orange");
      break;
    case "yellow":
      spanNode.classList.add("yellow");
      break;
    case "purple":
      spanNode.classList.add("purple");
      break;
    case "pink":
      spanNode.classList.add("pink");
      break;
    case "green":
      spanNode.classList.add("green");
      break;
    case "white":
      spanNode.classList.add("white");
      break;
    case "brown":
      spanNode.classList.add("brown");
      break;
    default:
      break;
  }
}

function createFoliageAttributes(productTreeData) {
  // if (productTreeData[0].winterFoliage.length !== 0) {
  //   let icon = document.createElement("span");

  //   icon.classList.add("tree-icon");

  //   switch (productTreeData[0].winterFoliage) {
  //     case "deciduous":
  //       icon.classList.add("deciduous");
  //       break;
  //     case "evergreen":
  //       icon.classList.add("evergreen");
  //       break;
  //     case "semi-evergreen":
  //       icon.classList.add("semi-evergreen");
  //       break;
  //     default:
  //       break;
  //   }

  //   treeAttributes.appendChild(icon);
  // }

  if (productTreeData[0].foliageColor.length !== 0) {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("color-div");

    let foliageColorHeading = document.createElement("p");
    foliageColorHeading.textContent = "Foliage Colour";

    let colorDiv = document.createElement("div");
    colorDiv.classList.add("color-spans");

    productTreeData[0].foliageColor.split(", ").forEach((color) => {
      let innerColor = document.createElement("span");
      innerColor.classList.add("tree-color");

      checkColors(color, innerColor);

      colorDiv.appendChild(innerColor);
    });

    mainDiv.appendChild(foliageColorHeading);
    mainDiv.appendChild(colorDiv);
    colorSection.appendChild(mainDiv);
  }

  if (productTreeData[0].autumnColor.length !== 0) {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("color-div");

    let autumnColorHeading = document.createElement("p");
    autumnColorHeading.textContent = "Autumn Colour";

    let colorDiv = document.createElement("div");
    colorDiv.classList.add("color-spans");

    productTreeData[0].autumnColor.split(", ").forEach((color) => {
      let innerColor = document.createElement("span");
      innerColor.classList.add("tree-color");

      checkColors(color, innerColor);

      colorDiv.appendChild(innerColor);
    });

    mainDiv.appendChild(autumnColorHeading);
    mainDiv.appendChild(colorDiv);
    colorSection.appendChild(mainDiv);
  }
}

function createFlowerAttributes(productTreeData) {
  if (productTreeData[0].flowerColor.length !== 0) {
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("color-div");

    let flowerColorHeading = document.createElement("p");
    flowerColorHeading.textContent = "Flower Colour";

    let colorDiv = document.createElement("div");
    colorDiv.classList.add("color-spans");

    productTreeData[0].flowerColor.split(", ").forEach((color) => {
      let innerColor = document.createElement("span");
      innerColor.classList.add("tree-color");

      checkColors(color, innerColor);

      colorDiv.appendChild(innerColor);
    });

    mainDiv.appendChild(flowerColorHeading);
    mainDiv.appendChild(colorDiv);
    colorSection.appendChild(mainDiv);
  }

  // let flowersHeading = document.createElement("h2");
  // flowersHeading.textContent = "Flowers";

  // let flowers = document.createElement("div");
  // flowers.id = "tree-flowers";
  // flowers.classList.add("attribute-grid");

  // if (productTreeData[0].floweringSeason.length !== 0) {
  //   let floweringSeasonDiv = document.createElement("div");
  //   floweringSeasonDiv.classList.add("attribute-sub-grid");

  //   let floweringSeasonHeading = document.createElement("p");
  //   floweringSeasonHeading.textContent = `Flowering Season`;
  //   floweringSeasonHeading.classList.add("attribute-sub-grid-heading");

  //   let floweringSeasonValue = document.createElement("p");

  //   let floweringSeasonArray = productTreeData[0].floweringSeason.split(", ");
  //   floweringSeasonArray.forEach((season) => {
  //     if (
  //       floweringSeasonArray.indexOf(season) ===
  //       floweringSeasonArray.length - 1
  //     ) {
  //       floweringSeasonValue.textContent += season
  //         .toLowerCase()
  //         .replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
  //     } else {
  //       floweringSeasonValue.textContent +=
  //         season
  //           .toLowerCase()
  //           .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()) + ", ";
  //     }
  //   });

  //   floweringSeasonDiv.appendChild(floweringSeasonHeading);
  //   floweringSeasonDiv.appendChild(floweringSeasonValue);
  //   flowers.appendChild(floweringSeasonDiv);

  //   if (!treeAttributes.contains(flowersHeading)) {
  //     treeAttributes.appendChild(flowersHeading);
  //   }
  //   if (!treeAttributes.contains(flowers)) {
  //     treeAttributes.appendChild(flowers);
  //   }
  // }

  // if (productTreeData[0].flowerColor.length !== 0) {
  //   let flowerColorDiv = document.createElement("div");
  //   flowerColorDiv.classList.add("attribute-sub-grid");

  //   let flowerColorHeading = document.createElement("p");
  //   flowerColorHeading.classList.add("attribute-sub-grid-heading");
  //   flowerColorHeading.textContent = "Flower Colour";

  //   let colorDiv = document.createElement("div");

  //   productTreeData[0].flowerColor.split(", ").forEach((color) => {
  //     let innerColor = document.createElement("span");
  //     innerColor.classList.add("tree-color");

  //     checkColors(color, innerColor);

  //     colorDiv.appendChild(innerColor);
  //   });

  //   flowerColorDiv.appendChild(colorDiv);
  //   flowerColorDiv.appendChild(flowerColorHeading);
  //   flowers.appendChild(flowerColorDiv);

  //   if (!treeAttributes.contains(flowerColorHeading)) {
  //     treeAttributes.appendChild(flowerColorHeading);
  //   }
  //   if (!treeAttributes.contains(flowers)) {
  //     treeAttributes.appendChild(flowers);
  //   }
  // }
}

function createFruitAttributes(productTreeData) {
  let fruitHeading = document.createElement("h2");
  fruitHeading.textContent = "Fruit";

  let fruit = document.createElement("div");
  fruit.id = "tree-fruit";
  fruit.classList.add("attribute-grid");

  if (productTreeData[0].fruitingSeason.length !== 0) {
    let fruitingSeasonDiv = document.createElement("div");
    fruitingSeasonDiv.classList.add("attribute-sub-grid");

    let fruitingSeasonHeading = document.createElement("p");
    fruitingSeasonHeading.classList.add("attribute-sub-grid-heading");
    fruitingSeasonHeading.textContent = `Fruiting Season`;

    let fruitingSeasonValue = document.createElement("p");

    let fruitingSeasonArray = productTreeData[0].fruitingSeason.split(", ");
    fruitingSeasonArray.forEach((season) => {
      if (
        fruitingSeasonArray.indexOf(season) ===
        fruitingSeasonArray.length - 1
      ) {
        fruitingSeasonValue.textContent += season
          .toLowerCase()
          .replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
      } else {
        fruitingSeasonValue.textContent +=
          season
            .toLowerCase()
            .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()) + ", ";
      }
    });

    fruitingSeasonDiv.appendChild(fruitingSeasonHeading);
    fruitingSeasonDiv.appendChild(fruitingSeasonValue);
    fruit.appendChild(fruitingSeasonDiv);

    if (!treeAttributes.contains(fruitHeading)) {
      treeAttributes.appendChild(fruitHeading);
    }
    if (!treeAttributes.contains(fruit)) {
      treeAttributes.appendChild(fruit);
    }
  }
}

function createUsesAttributes(productTreeData) {
  let usesHeading = document.createElement("h2");
  usesHeading.textContent = "Uses";

  let uses = document.createElement("div");
  uses.id = "tree-uses";
  uses.classList.add("attribute-grid");

  if (productTreeData[0].uses.length !== 0) {
    productTreeData[0].uses.split(", ").forEach((type) => {
      let usesItemDiv = document.createElement("div");
      usesItemDiv.classList.add("attribute-sub-grid");

      let usesItemValue = document.createElement("p");
      usesItemValue.classList.add("attribute-sub-grid-heading");

      let icon = document.createElement("span");
      icon.classList.add("tree-icon");

      switch (type) {
        case "attracts-birds":
          icon.classList.add("attracts-birds");
          usesItemValue.textContent = `Attracts Birds`;
          break;
        case "attracts-bees":
          icon.classList.add("attracts-bees");
          usesItemValue.textContent = `Attracts Bees`;
          break;
        case "driveways-avenues":
          icon.classList.add("avenue");
          usesItemValue.textContent = `Driveways/Avenues`;
          break;
        case "hedging-screening":
          icon.classList.add("hedge");
          usesItemValue.textContent = `Hedging/Screening`;
          break;
        case "paddocks-shade":
          icon.classList.add("paddock");
          usesItemValue.textContent = `Paddocks/Shade`;
          break;
        case "pleaching":
          icon.classList.add("pleaching");
          usesItemValue.textContent = `Pleaching`;
          break;
        case "small-garden":
          icon.classList.add("garden");
          usesItemValue.textContent = `Small Gardens`;
          break;
        case "street":
          icon.classList.add("street");
          usesItemValue.textContent = `Street`;
          break;
        case "topiary":
          icon.classList.add("topiary");
          usesItemValue.textContent = `Topiary`;
          break;
        case "narrow-spaces":
          icon.classList.add("narrow-spaces");
          usesItemValue.textContent = `Narrow Spaces`;
          break;
        default:
          break;
      }

      usesItemDiv.appendChild(icon);
      usesItemDiv.appendChild(usesItemValue);
      uses.appendChild(usesItemDiv);
    });

    if (!treeAttributes.contains(usesHeading)) {
      treeAttributes.appendChild(usesHeading);
    }
    if (!treeAttributes.contains(uses)) {
      treeAttributes.appendChild(uses);
    }
  }
}

function createTypesAttributes(productTreeData) {
  let typesHeading = document.createElement("h2");
  typesHeading.textContent = "Types";

  let types = document.createElement("div");
  types.id = "tree-types";
  types.classList.add("attribute-grid");

  if (productTreeData[0].types.length !== 0) {
    productTreeData[0].types.split(", ").forEach((type) => {
      let typesItemDiv = document.createElement("div");
      typesItemDiv.classList.add("attribute-sub-grid");

      let typesItemValue = document.createElement("p");
      typesItemValue.classList.add("attribute-sub-grid-heading");

      let icon = document.createElement("span");
      icon.classList.add("tree-icon");

      switch (type) {
        case "conifer":
          icon.classList.add("conifer");
          typesItemValue.textContent = `Conifer`;
          break;
        case "edible":
          icon.classList.add("edible");
          typesItemValue.textContent = `Edible`;
          break;
        case "weeping":
          icon.classList.add("weeping");
          typesItemValue.textContent = `Weeping`;
          break;
        default:
          break;
      }

      typesItemDiv.appendChild(icon);
      typesItemDiv.appendChild(typesItemValue);
      types.appendChild(typesItemDiv);
    });

    if (!treeAttributes.contains(typesHeading)) {
      treeAttributes.appendChild(typesHeading);
    }
    if (!treeAttributes.contains(types)) {
      treeAttributes.appendChild(types);
    }
  }
}

function createToleratesAttributes(productTreeData) {
  if (productTreeData[0].tolerates.length !== 0) {
    productTreeData[0].tolerates.split(", ").forEach((type) => {
      let iconDiv = document.createElement("div");
      iconDiv.classList.add("icon-div");

      let icon = document.createElement("img");
      icon.classList.add("tree-icon");
      let tooltip = document.createElement("span");
      tooltip.classList.add("tooltip");
      switch (type) {
        case "clay":
          icon.src =
            "https://files.leafland.co.nz/images/icons/tree-attributes/clay.svg";
          icon.classList.add("clay");
          tooltip.classList.add("clay-tooltip");
          tooltip.textContent = "Tolerates clay soils";
          break;
        // case "coastal":
        //   icon.classList.add("coastal");
        //   toleratesItemValue.textContent = `Coastal Sites`;
        //   break;
        case "dry":
          icon.src =
            "https://files.leafland.co.nz/images/icons/tree-attributes/dry.svg";
          icon.classList.add("dry");
          tooltip.classList.add("dry-tooltip");
          tooltip.textContent = "Tolerates dry sites";
          break;
        case "wet":
          icon.src =
            "https://files.leafland.co.nz/images/icons/tree-attributes/wet.svg";
          icon.classList.add("wet");
          tooltip.classList.add("wet-tooltip");
          tooltip.textContent = "Tolerates wet sites";
          break;
        case "windy":
          icon.src =
            "https://files.leafland.co.nz/images/icons/tree-attributes/windy.svg";
          icon.classList.add("windy");
          tooltip.classList.add("windy-tooltip");
          tooltip.textContent = "Tolerates windy sites";
          break;
        default:
          break;
      }

      iconDiv.appendChild(icon);
      iconDiv.appendChild(tooltip);
      treeAttributes.appendChild(iconDiv);
    });
  }
}

function createOtherAttributes(productTreeData) {
  let otherHeading = document.createElement("h2");
  otherHeading.textContent = "Other";

  let other = document.createElement("div");
  other.id = "tree-other";
  other.classList.add("attribute-grid");

  if (productTreeData[0].origin.length !== 0) {
    let originDiv = document.createElement("div");
    originDiv.classList.add("attribute-sub-grid");

    let originHeading = document.createElement("p");
    originHeading.textContent = "Origin";
    originHeading.classList.add("attribute-sub-grid-heading");

    let originValue = document.createElement("p");
    let icon = document.createElement("span");
    icon.classList.add("tree-icon");

    switch (productTreeData[0].origin) {
      case "exotic":
        originValue.textContent = "Exotic";
        icon.classList.add("exotic");
        break;
      case "native":
        originValue.textContent = "Native";
        icon.classList.add("native");
        break;
      default:
        break;
    }

    originDiv.appendChild(icon);
    originDiv.appendChild(originHeading);
    originDiv.appendChild(originValue);
    other.appendChild(originDiv);

    if (!treeAttributes.contains(otherHeading)) {
      treeAttributes.appendChild(otherHeading);
    }
    if (!treeAttributes.contains(other)) {
      treeAttributes.appendChild(other);
    }
  }
}

// function createTreeShape(productTreeData) {
//   let treeShapeDiv = document.querySelector("#tree-shape");

//   let treeShapeImage = document.createElement("img");
//   treeShapeImage.id = "tree-shape-image";
//   switch (productTreeData[0].treeShape) {
//     case "abies-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/abies/abies-general.svg";
//       break;

//     case "acacia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acacia/acacia-general.svg";
//       break;
//     case "acacia-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acacia/acacia-weeping.svg";
//       break;
//     case "acacia-large":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acacia/acacia-large.svg";
//       break;

//     case "acer-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer/acer-general.svg";
//       break;
//     case "acer-large":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer/acer-large.svg";
//       break;

//     case "acer-negundo-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-negundo/acer-negundo-general.svg";
//       break;

//     case "acer-pseudoplatanus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-pseudoplatanus/acer-pseudoplatanus-general.svg";
//       break;

//     case "acer-palmatum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-palmatum/acer-palmatum-general.svg";
//       break;
//     case "acer-palmatum-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-palmatum/acer-palmatum-weeping.svg";
//       break;
//     case "acer-palmatum-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-palmatum/acer-palmatum-upright.svg";
//       break;

//     case "acer-platanoides-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-platanoides/acer-platanoides-general.svg";
//       break;
//     case "acer-platanoides-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-platanoides/acer-platanoides-upright.svg";
//       break;
//     case "acer-platanoides-topiary":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-platanoides/acer-platanoides-topiary.svg";
//       break;

//     case "acer-rubrum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-rubrum/acer-rubrum-general.svg";
//       break;
//     case "acer-rubrum-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/acer-rubrum/acer-rubrum-upright.svg";
//       break;

//     case "aesculus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/aesculus/aesculus-general.svg";
//       break;

//     case "afrocarpus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/afrocarpus/afrocarpus-general.svg";
//       break;

//     case "agathis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/agathis/agathis-general.svg";
//       break;

//     case "agonis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/agonis/agonis-general.svg";
//       break;

//     case "albizia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/albizia/albizia-general.svg";
//       break;

//     case "alectryon-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/alectryon/alectryon-general.svg";
//       break;

//     case "almond-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/almond/almond-general.svg";
//       break;

//     case "alnus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/alnus/alnus-general.svg";
//       break;

//     case "amelanchier-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/amelanchier/amelanchier-general.svg";
//       break;

//     case "apple-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/apple/apple-general.svg";
//       break;
//     case "apple-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/apple/apple-weeping.svg";
//       break;

//     case "apricot-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/apricot/apricot-general.svg";
//       break;

//     case "araucaria-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/araucaria/araucaria-general.svg";
//       break;

//     case "arbutus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/arbutus/arbutus-general.svg";
//       break;

//     case "astelia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/astelia/astelia-general.svg";
//       break;

//     case "avocado-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/avocado/avocado-general.svg";
//       break;

//     case "azara-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/azara/azara-general.svg";
//       break;

//     case "banksia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/banksia/banksia-general.svg";
//       break;

//     case "beilschmiedia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/beilschmiedia/beilschmiedia-general.svg";
//       break;

//     case "berberis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/berberis/berberis-general.svg";
//       break;

//     case "betula-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/betula/betula-general.svg";
//       break;
//     case "betula-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/betula/betula-weeping.svg";
//       break;
//     case "betula-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/betula/betula-upright.svg";
//       break;

//     case "brachychiton-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/brachychiton/brachychiton-general.svg";
//       break;
//     case "brachychiton-large":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/brachychiton/brachychiton-large.svg";
//       break;

//     case "buxus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/buxus/buxus-general.svg";
//       break;

//     case "callistemon-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/callistemon/callistemon-general.svg";
//       break;
//     case "callistemon-large":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/callistemon/callistemon-large.svg";
//       break;
//     case "callistemon-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/callistemon/callistemon-weeping.svg";
//       break;

//     case "camellia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/camellia/camellia-general.svg";
//       break;

//     case "carpinus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/carpinus/carpinus-general.svg";
//       break;
//     case "carpinus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/carpinus/carpinus-upright.svg";
//       break;

//     case "carpodetus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/carpodetus/carpodetus-general.svg";
//       break;

//     case "castanea-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/castanea/castanea-general.svg";
//       break;

//     case "catalpa-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/catalpa/catalpa-general.svg";
//       break;

//     case "cedrela-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cedrela/cedrela-general.svg";
//       break;

//     case "cedrus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cedrus/cedrus-general.svg";
//       break;
//     case "cedrus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cedrus/cedrus-weeping.svg";
//       break;

//     case "celtis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/celtis/celtis-general.svg";
//       break;

//     case "cercidiphyllum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cercidiphyllum/cercidiphyllum-general.svg";
//       break;
//     case "cercidiphyllum-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cercidiphyllum/cercidiphyllum-weeping.svg";
//       break;

//     case "cercis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cercis/cercis-general.svg";
//       break;
//     case "cercis-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cercis/cercis-weeping.svg";
//       break;

//     case "chamaecyparis-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/chamaecyparis/chamaecyparis-general.svg";
//       break;

//     case "cherry-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cherry/cherry-general.svg";
//       break;

//     case "chimonanthus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/chimonanthus/chimonanthus-general.svg";
//       break;

//     case "choisya-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/choisya/choisya-general.svg";
//       break;

//     case "cinnamomum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cinnamomum/cinnamomum-general.svg";
//       break;

//     case "citrus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/citrus/citrus-general.svg";
//       break;

//     case "coprosma-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/coprosma/coprosma-general.svg";
//       break;
//     case "coprosma-low-growing":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/coprosma/coprosma-low-growing.svg";
//       break;
//     case "coprosma-small":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/coprosma/coprosma-small.svg";
//       break;

//     case "cordyline-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cordyline/cordyline-general.svg";
//       break;

//     case "cornus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cornus/cornus-general.svg";
//       break;
//     case "cornus-shrub":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cornus/cornus-shrub.svg";
//       break;
//     case "cornus-tiered":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cornus/cornus-tiered.svg";
//       break;
//     case "cornus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cornus/cornus-weeping.svg";
//       break;

//     case "corokia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/corokia/corokia-general.svg";
//       break;

//     case "corylus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/corylus/corylus-general.svg";
//       break;

//     case "corymbia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/corymbia/corymbia-general.svg";
//       break;

//     case "corynocarpus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/corynocarpus/corynocarpus-general.svg";
//       break;

//     case "cotinus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cotinus/cotinus-general.svg";
//       break;

//     case "crataegus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/crataegus/crataegus-general.svg";
//       break;

//     case "cryptomeria-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cryptomeria/cryptomeria-general.svg";
//       break;

//     case "cunonia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cunonia/cunonia-general.svg";
//       break;

//     case "cupressus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cupressus/cupressus-general.svg";
//       break;
//     case "cupressus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cupressus/cupressus-upright.svg";
//       break;

//     case "cyathea-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/cyathea/cyathea-general.svg";
//       break;

//     case "dicksonia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/dicksonia/dicksonia-general.svg";
//       break;

//     case "eucalyptus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/eucalyptus/eucalyptus-general.svg";
//       break;

//     case "fagus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fagus/fagus-general.svg";
//       break;
//     case "fagus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fagus/fagus-upright.svg";
//       break;
//     case "fagus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fagus/fagus-weeping.svg";
//       break;

//     case "feijoa-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/feijoa/feijoa-general.svg";
//       break;

//     case "fig-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fig/fig-general.svg";
//       break;

//     case "fraxinus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fraxinus/fraxinus-general.svg";
//       break;
//     case "fraxinus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fraxinus/fraxinus-upright.svg";
//       break;
//     case "fraxinus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fraxinus/fraxinus-weeping.svg";
//       break;
//     case "fraxinus-bushy":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fraxinus/fraxinus-bushy.svg";
//       break;

//     case "fuscospora-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/fuscospora/fuscospora-general.svg";
//       break;

//     case "ginkgo-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ginkgo/ginkgo-general.svg";
//       break;
//     case "ginkgo-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ginkgo/ginkgo-upright.svg";
//       break;
//     case "ginkgo-small":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ginkgo/ginkgo-small.svg";
//       break;
//     case "ginkgo-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ginkgo/ginkgo-weeping.svg";
//       break;

//     case "gleditsia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/gleditsia/gleditsia-general.svg";
//       break;
//     case "gleditsia-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/gleditsia/gleditsia-weeping.svg";
//       break;

//     case "griselinia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/griselinia/griselinia-general.svg";
//       break;

//     case "hoheria-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/hoheria/hoheria-general.svg";
//       break;

//     case "lagerstroemia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/lagerstroemia/lagerstroemia-general.svg";
//       break;

//     case "leptospermum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/leptospermum/leptospermum-general.svg";
//       break;

//     case "liquidambar-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/liquidambar/liquidambar-general.svg";
//       break;
//     case "liquidambar-topiary":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/liquidambar/liquidambar-topiary.svg";
//       break;

//     case "liriodendron-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/liriodendron/liriodendron-general.svg";
//       break;
//     case "liriodendron-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/liriodendron/liriodendron-upright.svg";
//       break;

//     case "lophozonia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/lophozonia/lophozonia-general.svg";
//       break;

//     case "magnolia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/magnolia/magnolia-general.svg";
//       break;
//     case "magnolia-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/magnolia/magnolia-upright.svg";
//       break;

//     case "malus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/malus/malus-general.svg";
//       break;
//     case "malus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/malus/malus-upright.svg";
//       break;
//     case "malus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/malus/malus-weeping.svg";
//       break;

//     case "metrosideros-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/metrosideros/metrosideros-general.svg";
//       break;

//     case "michelia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/michelia/michelia-general.svg";
//       break;

//     case "nectarine-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/nectarine/nectarine-general.svg";
//       break;

//     case "nyssa-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/nyssa/nyssa-general.svg";
//       break;
//     case "nyssa-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/nyssa/nyssa-weeping.svg";
//       break;

//     case "olearia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/olearia/olearia-general.svg";
//       break;

//     case "olive-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/olive/olive-general.svg";
//       break;

//     case "peach-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/peach/peach-general.svg";
//       break;

//     case "pear-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pear/pear-general.svg";
//       break;

//     case "photinia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/photinia/photinia-general.svg";
//       break;

//     case "picea-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/picea/picea-general.svg";
//       break;
//     case "picea-tall":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/picea/picea-tall.svg";
//       break;

//     case "pittosporum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pittosporum/pittosporum-general.svg";
//       break;
//     case "pittosporum-low-growing":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pittosporum/pittosporum-low-growing.svg";
//       break;

//     case "platanus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/platanus/platanus-general.svg";
//       break;
//     case "platanus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/platanus/platanus-upright.svg";
//       break;

//     case "plum-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/plum/plum-general.svg";
//       break;

//     case "podocarpus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/podocarpus/podocarpus-general.svg";
//       break;

//     case "prunus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/prunus/prunus-general.svg";
//       break;
//     case "prunus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/prunus/prunus-weeping.svg";
//       break;
//     case "prunus-bushy":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/prunus/prunus-bushy.svg";
//       break;
//     case "prunus-pillar":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/prunus/prunus-pillar.svg";
//       break;

//     case "pseudopanax-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pseudopanax/pseudopanax-general.svg";
//       break;
//     case "pseudopanax-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pseudopanax/pseudopanax-upright.svg";
//       break;

//     case "pyrus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pyrus/pyrus-general.svg";
//       break;
//     case "pyrus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pyrus/pyrus-weeping.svg";
//       break;
//     case "pyrus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/pyrus/pyrus-upright.svg";
//       break;

//     case "quercus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/quercus/quercus-general.svg";
//       break;
//     case "quercus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/quercus/quercus-upright.svg";
//       break;

//     case "quince-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/quince/quince-general.svg";
//       break;

//     case "robinia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/robinia/robinia-general.svg";
//       break;
//     case "robinia-topiary":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/robinia/robinia-topiary.svg";
//       break;

//     case "salix-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/salix/salix-general.svg";
//       break;
//     case "salix-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/salix/salix-weeping.svg";
//       break;

//     case "sequoia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/sequoia/sequoia-general.svg";
//       break;

//     case "sophora-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/sophora/sophora-general.svg";
//       break;
//     case "sophora-bushy":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/sophora/sophora-bushy.svg";
//       break;
//     case "sophora-low-bushy":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/sophora/sophora-low-bushy.svg";
//       break;

//     case "tilia-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/tilia/tilia-general.svg";
//       break;
//     case "tilia-tall-graceful":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/tilia/tilia-tall-graceful.svg";
//       break;

//     case "ulmus-general":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-general.svg";
//       break;
//     case "ulmus-horizontal":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-horizontal.svg";
//       break;
//     case "ulmus-weeping":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-weeping.svg";
//       break;
//     case "ulmus-small":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-small.svg";
//       break;
//     case "ulmus-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-upright.svg";
//       break;
//     case "ulmus-semi-upright":
//       treeShapeImage.src =
//         "https://files.leafland.co.nz/images/icons/tree-shapes/ulmus/ulmus-semi-upright.svg";
//       break;

//     default:
//       break;
//   }

//   let heightDiv = document.createElement("div");
//   heightDiv.id = "height-div";
//   let heightSpan = document.createElement("span");
//   heightSpan.id = "height-span";
//   heightSpan.textContent = productTreeData[0].height;

//   let heightUpArrow = document.createElement("span");
//   heightUpArrow.textContent = "↑";
//   heightUpArrow.classList.add("arrow");
//   heightUpArrow.id = "arrow-up";

//   let heightDownArrow = document.createElement("span");
//   heightDownArrow.textContent = "↓";
//   heightDownArrow.classList.add("arrow");
//   heightDownArrow.id = "arrow-down";

//   heightDiv.appendChild(heightUpArrow);
//   heightDiv.appendChild(heightSpan);
//   heightDiv.appendChild(heightDownArrow);

//   let widthDiv = document.createElement("div");
//   widthDiv.id = "width-div";
//   let widthSpan = document.createElement("span");
//   widthSpan.id = "width-span";
//   widthSpan.textContent = productTreeData[0].width;

//   let widthLeftArrow = document.createElement("span");
//   widthLeftArrow.textContent = "←";
//   widthLeftArrow.classList.add("arrow");
//   widthLeftArrow.id = "arrow-left";

//   let widthRightArrow = document.createElement("span");
//   widthRightArrow.textContent = "→";
//   widthRightArrow.classList.add("arrow");
//   widthRightArrow.id = "arrow-right";

//   widthDiv.appendChild(widthLeftArrow);
//   widthDiv.appendChild(widthSpan);
//   widthDiv.appendChild(widthRightArrow);

//   treeShapeDiv.appendChild(treeShapeImage);
//   treeShapeDiv.appendChild(heightDiv);
//   treeShapeDiv.appendChild(widthDiv);
// }

async function populateTreeAttributes(productTreeData) {
  // createTreeShape(productTreeData);
  createFoliageAttributes(productTreeData);
  createFlowerAttributes(productTreeData);
  // createFruitAttributes(productTreeData);
  // createUsesAttributes(productTreeData);
  // createTypesAttributes(productTreeData);
  createToleratesAttributes(productTreeData);
  // createOtherAttributes(productTreeData);
}

async function createRelatedTrees(productTreeData) {
  let relatedTreesKeywords = [
    "uses",
    "tolerates",
    "winterFoliage",
    "origin",
    "types",
    "floweringSeason",
    "flowerColor",
    "autumnColor",
    "foliageColor",
    "fruitingSeason",
  ];

  let relatedTreesData = await fetch(
    `https://api.leafland.co.nz/default/get-product-data?type=tree-finder`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});

  let relatedTreesImages = await fetch(
    `https://api.leafland.co.nz/default/get-image-data`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});

  if (relatedTreesKeywords.length > 0) {
    let relatedTrees = [];

    for (let i = 0; i < relatedTreesData.length; i++) {
      if (relatedTrees.length > 11) {
        break;
      }

      if (
        relatedTreesData[i].botanicalName !== productTreeData[0].botanicalName
      ) {
        let add = false;

        for (let j = 0; j < relatedTreesKeywords.length; j++) {
          if (
            productTreeData[0][relatedTreesKeywords[j]] ===
            relatedTreesData[i][relatedTreesKeywords[j]]
          ) {
            add = true;
          } else {
            add = false;
            break;
          }
        }

        if (add) {
          relatedTrees.push(relatedTreesData[i]);
        }
      }
    }

    if (relatedTrees.length === 0) {
      let compareName = "";
      for (i = 0; i < relatedTreesData.length; i++) {
        if (relatedTrees.length > 11) {
          break;
        }

        if (
          relatedTreesData[i].botanicalName !== productTreeData[0].botanicalName
        ) {
          if (
            productTreeData[0].botanicalName.split(" ")[1].search("'") === -1 &&
            productTreeData[0].botanicalName.split(" ")[1] !== "x"
          ) {
            compareName = `${productTreeData[0].botanicalName.split(" ")[0]} ${
              productTreeData[0].botanicalName.split(" ")[1]
            }`;
            if (
              compareName.search(
                relatedTreesData[i].botanicalName.split(" ")[0]
              ) !== -1 &&
              compareName.search(
                relatedTreesData[i].botanicalName.split(" ")[1]
              ) !== -1
            ) {
              relatedTrees.push(relatedTreesData[i]);
            }
          } else {
            compareName = `${productTreeData[0].botanicalName.split(" ")[0]}`;
            if (
              compareName.search(
                relatedTreesData[i].botanicalName.split(" ")[0]
              ) !== -1
            ) {
              relatedTrees.push(relatedTreesData[i]);
            }
          }
        }
      }
    }

    if (relatedTrees.length > 0) {
      for (let i = 0; i < relatedTrees.length; i++) {
        let imagesSubset = [];

        for (let j = 0; j < relatedTreesImages.length; j++) {
          if (
            relatedTreesImages[j].split("/", 4)[3] ===
              `${relatedTrees[i].url}.jpg` ||
            relatedTreesImages[j].split("/", 4)[3] ===
              `${relatedTrees[i].url}.jpeg`
          ) {
            imagesSubset.push(relatedTreesImages[j]);
            break;
          }
        }

        if (relatedTrees.length > 0 && imagesSubset.length > 0) {
          let treeDiv = document.createElement("div");
          treeDiv.classList.add("related-tree");

          let imageDiv = document.createElement("div");
          imageDiv.classList.add("tree-image");

          let contentDiv = document.createElement("div");
          contentDiv.classList.add("tree-content");

          let titleDiv = document.createElement("div");

          let botanicalName = document.createElement("h2");
          let commonName = document.createElement("h3");

          botanicalName.textContent = relatedTrees[i].botanicalName;
          titleDiv.appendChild(botanicalName);

          if (relatedTrees[i].commonName !== "") {
            commonName.textContent = relatedTrees[i].commonName;
            titleDiv.appendChild(commonName);
          }

          let treeImage = document.createElement("img");
          treeImage.src = `https://ik.imagekit.io/leafland/${imagesSubset[0]}?tr=w-500,q-75,pr-true,f-auto`;

          let linkButton = document.createElement("a");
          linkButton.textContent = "View Tree";
          linkButton.classList.add("button");
          linkButton.classList.add("tree-link");
          linkButton.href = `/trees/${relatedTrees[i].url}`;

          contentDiv.appendChild(titleDiv);
          contentDiv.appendChild(linkButton);

          imageDiv.appendChild(treeImage);

          treeDiv.appendChild(imageDiv);
          treeDiv.appendChild(contentDiv);
          treeDiv.style.setProperty(
            "--animation-order",
            `${i % relatedTrees.length}`
          );
          treeDiv.classList.add("related-tree-loaded");
          relatedTreesSection.appendChild(treeDiv);
        }
      }
      relatedTreesSection.style.setProperty("display", "grid");
      relateTreesHeading.style.setProperty("display", "inline-block");
    } else {
      relateTreesHeading.style.setProperty("display", "none");
      relatedTreesSection.style.setProperty("display", "none");
    }
  } else {
    relateTreesHeading.style.setProperty("display", "none");
    relatedTreesSection.style.setProperty("display", "none");
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
    treeQuantity.value = 1;

    for (let i = 0; i < grades.length; i++) {
      if (grades[i].grade === event.target.value.split("-0")[0]) {
        heightSelect.innerHTML = "";
        standardHeightSelect.innerHTML = "";
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

        let standardQuantity = 0;
        if (firstValueNone) {
          standardQuantity = noStandardHeightQuantity;
        } else {
          standardQuantity = grades[i].heights[0].standardHeights[0].quantity;
        }

        let quantity = document.createElement("p");
        quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="quantity accent-color">${standardQuantity}</span>`;

        let stockPrice = document.createElement("p");
        stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="accent-color">${grades[i].heights[0].standardHeights[0].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="accent-color">${grades[i].heights[0].standardHeights[0].retailPrice}.00+GST (Retail)</span>`;

        stockValuesDiv.appendChild(quantity);
        stockValuesDiv.appendChild(stockPrice);

        if (standardQuantity === 0) {
          addToOrderButton.disabled = true;
          treeQuantity.disabled = true;
          treeQuantity.value = 1;
        } else {
          addToOrderButton.disabled = false;
          treeQuantity.disabled = false;
          treeQuantity.max = standardQuantity;
          treeQuantity.onchange = function () {
            if (this.value < 1) {
              this.value = 1;
            } else if (this.value > standardQuantity) {
              this.value = standardQuantity;
            }
          };
        }
        break;
      }
    }
  });

  heightSelect.addEventListener("change", (event) => {
    stockValuesDiv.innerHTML = ``;
    standardHeightSelect.innerHTML = "";
    treeQuantity.value = 1;
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

            let standardQuantity = 0;
            if (firstValueNone) {
              standardQuantity = noStandardHeightQuantity;
            } else {
              standardQuantity =
                grades[i].heights[j].standardHeights[0].quantity;
            }

            let quantity = document.createElement("p");
            quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="quantity accent-color">${standardQuantity}</span>`;

            let stockPrice = document.createElement("p");
            stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="accent-color">${grades[i].heights[j].standardHeights[0].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="accent-color">${grades[i].heights[j].standardHeights[0].retailPrice}.00+GST (Retail)</span>`;

            stockValuesDiv.appendChild(quantity);
            stockValuesDiv.appendChild(stockPrice);

            if (standardQuantity === 0) {
              addToOrderButton.disabled = true;
              treeQuantity.disabled = true;
              treeQuantity.value = 1;
            } else {
              addToOrderButton.disabled = false;
              treeQuantity.disabled = false;
              treeQuantity.max = standardQuantity;
              treeQuantity.onchange = function () {
                if (this.value < 1) {
                  this.value = 1;
                } else if (this.value > standardQuantity) {
                  this.value = standardQuantity;
                }
              };
            }

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
                quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="quantity accent-color">${grades[i].heights[j].standardHeights[k].quantity}</span>`;

                let stockPrice = document.createElement("p");
                stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="accent-color">${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="accent-color">${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;

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
                quantity.innerHTML = `<span class="stock-value-title">Quantity in stock:</span> <span class="quantity accent-color">${
                  event.target.value.split("?q=")[1]
                }</span>`;

                let stockPrice = document.createElement("p");
                stockPrice.innerHTML = `<span class="stock-value-title">Price per tree:</span> <span id="wholesale-price" class="accent-color">${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span> <span id="retail-price" class="accent-color">${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;

                stockValuesDiv.appendChild(quantity);
                stockValuesDiv.appendChild(stockPrice);

                if (parseInt(event.target.value.split("?q=")[1]) === 0) {
                  addToOrderButton.disabled = true;
                  treeQuantity.disabled = true;
                  treeQuantity.value = 1;
                } else {
                  addToOrderButton.disabled = false;
                  treeQuantity.disabled = false;
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
