let colorSection = document.querySelector("#color-section");
let gradeSizeSelect = document.querySelector("#grade-size-select");
let heightSelect = document.querySelector("#height-select");
let standardHeightSelect = document.querySelector("#standard-height-select");
let gradeSizesDiv = document.querySelector("#grade-sizes");
// let stockValuesDiv = document.querySelector("#stock-values");
// let treeQuantity = document.querySelector("#quantity");
let treeBotanicalName = document.querySelector(".tree-botanical-name");
let treeCommonName = document.querySelector(".tree-common-name");
let images = document.querySelector(".images");
let mainImage = document.querySelector("#main-image-inner");
// let addToOrderButton = document.querySelector("#add-product");
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

// let quantityField = document.querySelector("#quantity-field");
// let wholesalePriceField = document.querySelector("#wholesale-price");
// let retailPriceField = document.querySelector("#retail-price");
// let comingOnField = document.querySelector("#coming-on-field");

let stockTableDiv = document.querySelector("#stock-table-div");

let heightValues = 0;
let standardHeightValues = 0;

let productTrees = JSON.parse(sessionStorage.getItem("trees"));

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

      // stockValuesDiv.style.setProperty("display", "none");
    } else {
      await createStockValues();
    }

    stockData = await fetch(
      "https://api.leafland.co.nz/default/get-stock-data-file?type=list"
    )
      .then((response) => response.json())
      .catch((error) => {});

    document.querySelector(
      "#tree-name-content"
    ).innerHTML = `${treeBotanicalName.innerHTML}`;

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
      .replace("Alectryon excelsus subsp. excelsus", "Alectryon excelsus")
      .replace("Psidium cattleyanum var. cattleyanum", "Guava Red Cherry")
      .replace("Corylus avellana", "Hazelnut")
      .replace("Juglans regia '", "Walnut '")
      .replace("Eriobotrya japonica 'Golden Orb'", "Loquat Golden Orb")
      .replace("Eriobotrya japonica", "Loquat japonica")
      .replace("Macadamia integrifolia x tetraphylla", "Macadamia")
      .replace("Prunus persica var. nectarina", "Nectarine")
      .replace("Olea europaea", "Olive")
      .replace("Prunus persica 'Healy's'", "Peacherine Healy's")
      .replace("Prunus persica", "Peach")
      .replace("Pyrus pyrifolia", "Pear")
      .replace("Pyrus communis", "Pear")
      .replace("Prunus salicina", "Plum")
      .replace("Prunus domestica", "Plum")
      .replace("Cydonia oblonga", "Quince")
      .replace("Metrosideros x sub-tomentosa", "Metrosideros")
      .replace("Metrosideros excelsa x umbellata", "Metrosideros")
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
    for (let i = 0; i < grades.length; i++) {
      for (let j = 0; j < grades[i].heights.length; j++) {
        for (let k = 0; k < grades[i].heights[j].standardHeights.length; k++) {
          let gradeDiv = document.createElement("div");
          gradeDiv.classList.add("selection-box");

          // if (i === 0 && j === 0 && k === 0) {
          //   gradeDiv.classList.add("selection-box-active");
          // }

          let gradeSizeValue = document.createElement("p");
          // gradeSizeValue.classList.add("selection-box");
          gradeSizeValue.innerHTML = `Grade Size: <span class='accent-color'>${grades[i].grade}</span>`;
          // gradeSizeValue.dataset.value = grades[i].grade;
          gradeSizeValue.classList.add("order-product-grade");

          let heightValue = document.createElement("p");
          heightValue.classList.add("order-product-height");

          let standardHeightValue = document.createElement("p");
          standardHeightValue.classList.add("order-product-standard-height");

          let quantityValue = document.createElement("p");
          quantityValue.classList.add("order-product-quantity");

          let wholesalePriceValue = document.createElement("p");
          wholesalePriceValue.classList.add("wholesale-price");
          wholesalePriceValue.classList.add("order-product-wholesale-price");

          let retailPriceValue = document.createElement("p");
          retailPriceValue.classList.add("retail-price");
          retailPriceValue.classList.add("order-product-retail-price");

          if (grades[i].heights[j].averageHeight !== "") {
            // heightValue.dataset.value = grades[i].heights[j].averageHeight;
            heightValue.innerHTML = `Height: <span class='accent-color'>${
              grades[i].heights[j].averageHeight.toLowerCase() === "n/a"
                ? grades[i].heights[j].averageHeight
                : grades[i].heights[j].averageHeight + "m"
            }</span>`;
          } else {
            heightValue.dataset.value = "N/A";
            heightValue.innerHTML =
              "Height: <span class='accent-color'>N/A</span>";
          }

          // heightValue.classList.add("selection-box");

          // if (
          //   grades[i].heights[j].standardHeights[k].standardHeight.trim() !==
          //     "" &&
          //   grades[i].heights[j].standardHeights[k].standardHeight
          //     .toLowerCase()
          //     .trim() !== "bushy" &&
          //   grades[i].heights[j].standardHeights[k].standardHeight
          //     .toLowerCase()
          //     .trim() !== "l/w" &&
          //   grades[i].heights[j].standardHeights[k].standardHeight
          //     .toLowerCase()
          //     .trim() !== "lw" &&
          //   grades[i].heights[j].standardHeights[k].standardHeight
          //     .toLowerCase()
          //     .trim() !== "ct"
          // ) {
          // standardHeightValue.dataset.value =
          //   grades[i].heights[j].standardHeights[k].standardHeight;

          if (
            grades[i].heights[j].standardHeights[k].standardHeight.match(
              /\d+/g
            ) !== null
          ) {
            standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].standardHeight}m</span>`;
          } else if (
            grades[i].heights[j].standardHeights[k].standardHeight !== ""
          ) {
            standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].standardHeight}</span>`;
          } else {
            standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>None</span>`;
          }

          quantityValue.innerHTML = `Quantity Ready: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].quantity}</span>`;
          // quantityValue.dataset.value =
          //   grades[i].heights[j].standardHeights[k].quantity;

          wholesalePriceValue.innerHTML = `Price per tree: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span>`;
          // wholesalePriceValue.dataset.value =
          //   grades[i].heights[j].standardHeights[k].wholesalePrice;

          retailPriceValue.innerHTML = `Price per tree: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;
          // retailPriceValue.dataset.value =
          //   grades[i].heights[j].standardHeights[k].retailPrice;

          gradeDiv.appendChild(gradeSizeValue);
          gradeDiv.appendChild(heightValue);
          gradeDiv.appendChild(standardHeightValue);
          gradeDiv.appendChild(quantityValue);
          gradeDiv.appendChild(retailPriceValue);
          gradeDiv.appendChild(wholesalePriceValue);

          let addToOrderDiv = document.createElement("div");
          addToOrderDiv.classList.add("add-to-order-div");

          let gradeInput = document.createElement("input");
          gradeInput.type = "number";
          gradeInput.name = "quantity";
          gradeInput.class = "quantity";
          gradeInput.value = 1;
          gradeInput.min = 1;
          gradeInput.max = parseInt(
            grades[i].heights[j].standardHeights[k].quantity
          );
          gradeInput.inputmode = "numeric";

          gradeInput.onchange = function () {
            if (this.value < 1) {
              this.value = 1;
            } else if (
              this.value >
              parseInt(grades[i].heights[j].standardHeights[k].quantity)
            ) {
              this.value = parseInt(
                grades[i].heights[j].standardHeights[k].quantity
              );
            }
          };

          let gradeButton = document.createElement("button");
          gradeButton.class = "add-product";
          gradeButton.textContent = "Add to order";

          gradeButton.dataset.grade = grades[i].grade;
          gradeButton.dataset.height = grades[i].heights[j].averageHeight;
          gradeButton.dataset.standardHeight =
            grades[i].heights[j].standardHeights[k].standardHeight === ""
              ? "None"
              : grades[i].heights[j].standardHeights[k].standardHeight;
          gradeButton.dataset.quantity =
            grades[i].heights[j].standardHeights[k].quantity;
          gradeButton.dataset.wholesalePrice =
            grades[i].heights[j].standardHeights[k].wholesalePrice;
          gradeButton.dataset.retailPrice =
            grades[i].heights[j].standardHeights[k].retailPrice;

          gradeButton.addEventListener("click", () => {
            addTreeToSessionStorage(
              gradeButton.dataset.grade,
              gradeButton.dataset.height,
              gradeInput.value,
              gradeInput.max,
              gradeButton.dataset.standardHeight,
              gradeButton.dataset.retailPrice,
              gradeButton.dataset.wholesalePrice
            );
            window.dispatchEvent(productAdded);

            if (maximumQuantityReached) {
              document.querySelector(
                "#top-bar-inner"
              ).innerHTML = `You tried adding more trees than we have in stock. Order quantity has been set to the maximum quantity.`;
              maximumQuantityReached = false;
            } else {
              document.querySelector(
                "#top-bar-inner"
              ).innerHTML = `${gradeInput.value}<span class="lowercase">x</span> ${gradeButton.dataset.grade} ${treeBotanicalName.innerHTML} added to order.`;
            }

            document
              .querySelector("#top-bar")
              .style.setProperty("display", "block");

            setTimeout(() => {
              document
                .querySelector("#top-bar")
                .style.setProperty("display", "none");
            }, 4000);
          });

          addToOrderDiv.appendChild(gradeInput);
          addToOrderDiv.appendChild(gradeButton);

          gradeDiv.appendChild(addToOrderDiv);

          document.querySelector("#grade-size-selection").appendChild(gradeDiv);
          // }
        }
      }
    }
  } else {
    gradeSizesDiv.innerHTML = ``;
    let message = document.createElement("p");
    message.textContent = "Currently out of stock.";
    message.classList.add("bold-up");
    gradeSizesDiv.appendChild(message);
    gradeSizesDiv.style.setProperty("grid-template-columns", "1fr");
    gradeSizesDiv.style.setProperty("margin-top", "0");

    // stockValuesDiv.style.setProperty("display", "none");
    // document.querySelector("#coming-on").style.setProperty("display", "none");
  }
}

function addTreeToSessionStorage(
  grade,
  averageHeight,
  quantity,
  maxQuantity,
  standardHeight,
  retailPrice,
  wholesalePrice
) {
  productTrees = JSON.parse(sessionStorage.getItem("trees"));
  let totalRetailCost = 0;
  let totalWholesaleCost = 0;

  if (productTrees.length === 0) {
    productTrees.push({
      botanicalName: treeBotanicalName.innerHTML,
      commonName: treeCommonName.textContent,
      url: window.location.pathname,
      mainImage: productImage,
      grade,
      averageHeight,
      quantity,
      maxQuantity,
      standardHeight,
      retailPrice,
      wholesalePrice,
    });
  } else {
    for (let i = 0; i < productTrees.length + 1; i++) {
      if (i === productTrees.length) {
        productTrees.push({
          botanicalName: treeBotanicalName.innerHTML,
          commonName: treeCommonName.textContent,
          url: window.location.pathname,
          mainImage: productImage,
          grade,
          averageHeight,
          quantity,
          maxQuantity,
          standardHeight,
          retailPrice,
          wholesalePrice,
        });
        break;
      } else {
        productTrees[i].quantity = parseInt(productTrees[i].quantity, 10);
        if (productTrees[i].botanicalName === treeBotanicalName.innerHTML) {
          if (productTrees[i].grade === grade) {
            if (productTrees[i].averageHeight === averageHeight) {
              if (productTrees[i].standardHeight === standardHeight) {
                productTrees[i].quantity += parseInt(quantity, 10);
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

  sessionStorage.setItem("trees", JSON.stringify(productTrees));
  sessionStorage.setItem("totalRetailCost", JSON.stringify(totalRetailCost));
  sessionStorage.setItem(
    "totalWholesaleCost",
    JSON.stringify(totalWholesaleCost)
  );
}

// function createHeights(grade, height) {
//   treeQuantity.value = 1;

//   addToOrderButton.disabled = true;
//   treeQuantity.disabled = true;

//   for (let i = 0; i < grades.length; i++) {
//     if (grades[i].grade === grade) {
//       let noStandardHeightQuantity = 0;
//       for (let j = 0; j < grades[i].heights.length; j++) {
//         if (grades[i].heights[j].averageHeight === height) {
//           for (
//             let k = 0;
//             k < grades[i].heights[j].standardHeights.length;
//             k++
//           ) {
//             let standardHeightValue = document.createElement("span");
//             if (
//               grades[i].heights[j].standardHeights[k].standardHeight.trim() !==
//                 "" &&
//               grades[i].heights[j].standardHeights[k].standardHeight
//                 .toLowerCase()
//                 .trim() !== "bushy" &&
//               grades[i].heights[j].standardHeights[k].standardHeight
//                 .toLowerCase()
//                 .trim() !== "l/w" &&
//               grades[i].heights[j].standardHeights[k].standardHeight
//                 .toLowerCase()
//                 .trim() !== "lw" &&
//               grades[i].heights[j].standardHeights[k].standardHeight
//                 .toLowerCase()
//                 .trim() !== "ct"
//             ) {
//               standardHeightValue.dataset.value = `${grades[i].heights[j].standardHeights[k].standardHeight}?q=${grades[i].heights[j].standardHeights[k].quantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

//               if (
//                 grades[i].heights[j].standardHeights[k].standardHeight.match(
//                   /\d+/g
//                 ) !== null
//               ) {
//                 standardHeightValue.textContent =
//                   grades[i].heights[j].standardHeights[k].standardHeight + "m";
//               } else {
//                 standardHeightValue.textContent =
//                   grades[i].heights[j].standardHeights[k].standardHeight;
//               }

//               standardHeightValue.classList.add("selection-box");

//               document
//                 .querySelector("#standard-height-selection")
//                 .appendChild(standardHeightValue);

//               standardHeightValues += 1;

//               // standardHeightValue.addEventListener("click", () => {
//               //   standardHeightValues = 0;
//               //   document
//               //     .querySelectorAll(".standard-selection-value-active")
//               //     .forEach((child) => {
//               //       child.classList.remove("standard-selection-value-active");
//               //     });
//               //   standardHeightValue.classList.add(
//               //     "standard-selection-value-active"
//               //   );

//               //   let parameters =
//               //     standardHeightValue.dataset.value.split("?")[1];
//               //   let standardQuantity = parameters.split("&")[0];
//               //   let wholesalePrice = parameters.split("&")[1];
//               //   let retailPrice = parameters.split("&")[2];

//               //   quantityField.textContent = `${
//               //     standardQuantity.split("q=")[1]
//               //   }`;
//               //   wholesalePriceField.textContent = `${
//               //     wholesalePrice.split("wp=")[1]
//               //   }.00+GST (Wholesale)`;
//               //   retailPriceField.textContent = `${
//               //     retailPrice.split("rp=")[1]
//               //   }.00+GST (Retail)`;

//               //   if (parseInt(standardQuantity.split("q=")[1]) === 0) {
//               //     addToOrderButton.disabled = true;
//               //     treeQuantity.disabled = true;
//               //     treeQuantity.value = 1;
//               //   } else {
//               //     addToOrderButton.disabled = false;
//               //     treeQuantity.disabled = false;
//               //     treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
//               //     treeQuantity.onchange = function () {
//               //       if (this.value < 1) {
//               //         this.value = 1;
//               //       } else if (
//               //         this.value > parseInt(standardQuantity.split("q=")[1])
//               //       ) {
//               //         this.value = parseInt(standardQuantity.split("q=")[1]);
//               //       }
//               //     };
//               //   }
//               // });
//             } else if (
//               grades[i].heights[j].standardHeights[k].standardHeight
//                 .toLowerCase()
//                 .trim() !== "column"
//             ) {
//               standardHeightValue = document.createElement("span");

//               standardHeightValue.textContent = "None";

//               noStandardHeightQuantity +=
//                 grades[i].heights[j].standardHeights[k].quantity;

//               standardHeightValue.dataset.value = `None?q=${noStandardHeightQuantity}&wp=${grades[i].heights[j].standardHeights[k].wholesalePrice}&rp=${grades[i].heights[j].standardHeights[k].retailPrice}`;

//               standardHeightValue.classList.add("selection-box");

//               document
//                 .querySelector("#standard-height-selection")
//                 .appendChild(standardHeightValue);

//               standardHeightValues += 1;

//               // standardHeightValue.addEventListener("click", () => {
//               //   standardHeightValues = 0;
//               //   document
//               //     .querySelectorAll(".standard-selection-value-active")
//               //     .forEach((child) => {
//               //       child.classList.remove("standard-selection-value-active");
//               //     });
//               //   standardHeightValue.classList.add(
//               //     "standard-selection-value-active"
//               //   );

//               //   let parameters =
//               //     standardHeightValue.dataset.value.split("?")[1];
//               //   let standardQuantity = parameters.split("&")[0];
//               //   let wholesalePrice = parameters.split("&")[1];
//               //   let retailPrice = parameters.split("&")[2];

//               //   quantityField.textContent = `${
//               //     standardQuantity.split("q=")[1]
//               //   }`;
//               //   wholesalePriceField.textContent = `${
//               //     wholesalePrice.split("wp=")[1]
//               //   }.00+GST (Wholesale)`;
//               //   retailPriceField.textContent = `${
//               //     retailPrice.split("rp=")[1]
//               //   }.00+GST (Retail)`;

//               //   if (parseInt(standardQuantity.split("q=")[1]) === 0) {
//               //     addToOrderButton.disabled = true;
//               //     treeQuantity.disabled = true;
//               //     treeQuantity.value = 1;
//               //   } else {
//               //     addToOrderButton.disabled = false;
//               //     treeQuantity.disabled = false;
//               //     treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
//               //     treeQuantity.onchange = function () {
//               //       if (this.value < 1) {
//               //         this.value = 1;
//               //       } else if (
//               //         this.value > parseInt(standardQuantity.split("q=")[1])
//               //       ) {
//               //         this.value = parseInt(standardQuantity.split("q=")[1]);
//               //       }
//               //     };
//               //   }
//               // });
//             }
//           }

//           break;
//         }
//       }
//       break;
//     }
//   }

//   // if (standardHeightValues === 1) {
//   //   let standardChildren = document.querySelector(
//   //     "#standard-height-selection"
//   //   ).children;
//   //   standardChildren[0].classList.add("standard-selection-value-active");

//   //   let parameters = standardChildren[0].dataset.value.split("?")[1];
//   //   let standardQuantity = parameters.split("&")[0];
//   //   let wholesalePrice = parameters.split("&")[1];
//   //   let retailPrice = parameters.split("&")[2];

//   //   quantityField.textContent = `${standardQuantity.split("q=")[1]}`;
//   //   wholesalePriceField.textContent = `${
//   //     wholesalePrice.split("wp=")[1]
//   //   }.00+GST (Wholesale)`;
//   //   retailPriceField.textContent = `${
//   //     retailPrice.split("rp=")[1]
//   //   }.00+GST (Retail)`;

//   //   if (parseInt(standardQuantity.split("q=")[1]) === 0) {
//   //     addToOrderButton.disabled = true;
//   //     treeQuantity.disabled = true;
//   //     treeQuantity.value = 1;
//   //   } else {
//   //     addToOrderButton.disabled = false;
//   //     treeQuantity.disabled = false;
//   //     treeQuantity.max = parseInt(standardQuantity.split("q=")[1]);
//   //     treeQuantity.onchange = function () {
//   //       if (this.value < 1) {
//   //         this.value = 1;
//   //       } else if (this.value > parseInt(standardQuantity.split("q=")[1])) {
//   //         this.value = parseInt(standardQuantity.split("q=")[1]);
//   //       }
//   //     };
//   //   }
//   // }
// }

async function createStockTable() {
  let heading = [];
  if (document.body.classList.contains("loggedIn")) {
    heading = [
      "Grade",
      "$Retail",
      "$Wholesale",
      "Height (m)",
      "Standard Height (m)",
      "Ready",
      "In Production",
    ];
  } else {
    heading = [
      "Grade",
      "$Retail",
      "Height (m)",
      "Standard Height (m)",
      "Ready",
      "In Production",
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
        .replace("Alectryon excelsus subsp. excelsus", "Alectryon excelsus")
        .replace("Psidium cattleyanum var. cattleyanum", "Guava Red Cherry")
        .replace("Corylus avellana", "Hazelnut")
        .replace("Juglans regia '", "Walnut '")
        .replace("Eriobotrya japonica 'Golden Orb'", "Loquat Golden Orb")
        .replace("Eriobotrya japonica", "Loquat japonica")
        .replace("Macadamia integrifolia x tetraphylla", "Macadamia")
        .replace("Prunus persica var. nectarina", "Nectarine")
        .replace("Olea europaea", "Olive")
        .replace("Prunus persica 'Healy's'", "Peacherine Healy's")
        .replace("Prunus persica", "Peach")
        .replace("Pyrus pyrifolia", "Pear")
        .replace("Pyrus communis", "Pear")
        .replace("Prunus salicina", "Plum")
        .replace("Prunus domestica", "Plum")
        .replace("Cydonia oblonga", "Quince")
        .replace("Metrosideros x sub-tomentosa", "Metrosideros")
        .replace("Metrosideros excelsa x umbellata", "Metrosideros")
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
      productTrees = JSON.parse(sessionStorage.getItem(event.key));
    }
  });

  // document.querySelectorAll(".add-product").forEach((child) => {
  //   child.addEventListener("click", () => {
  //     addTreeToSessionStorage();
  //     window.dispatchEvent(productAdded);

  //     if (maximumQuantityReached) {
  //       document.querySelector(
  //         "#success-message-text"
  //       ).innerHTML = `You tried adding more trees than we have in stock. Order quantity has been set to the maximum quantity.`;
  //       maximumQuantityReached = false;
  //     } else {
  //       document.querySelector("#success-message-text").innerHTML = `${
  //         quantity.value
  //       }<span class="lowercase">x</span> ${
  //         document
  //           .querySelector(".selection-box-active")
  //           .querySelector(".order-product-grade").dataset.value
  //       } ${treeBotanicalName.innerHTML} added to order.`;
  //     }

  //     successMessage.style.setProperty("opacity", "1");
  //     successMessage.style.setProperty("visibility", "visible");

  //     setTimeout(() => {
  //       successMessage.style.setProperty("opacity", "0");
  //       successMessage.style.setProperty("visibility", "hidden");
  //     }, 4000);
  //   });
  // });

  document.querySelector("#open-stock-table").addEventListener("click", () => {
    document.body.classList.add("stock-table-open");
  });

  document.querySelector("#stock-table-close").addEventListener("click", () => {
    document.body.classList.remove("stock-table-open");
  });
}

document.querySelector("#open-more-links").addEventListener("click", () => {
  document.body.classList.add("more-links-open");
});
document.querySelector("#close-more-links").addEventListener("click", () => {
  document.body.classList.remove("more-links-open");
});

// document.querySelector("#open-features").addEventListener("click", () => {
//   document.body.classList.add("features-open");
// });
// document.querySelector("#close-features").addEventListener("click", () => {
//   document.body.classList.remove("features-open");
// });
