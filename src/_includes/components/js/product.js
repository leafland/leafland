let colorSection = document.querySelector("#color-section");
let gradeSizesDiv = document.querySelector("#grade-sizes");

let treeBotanicalName = document.querySelector(".tree-botanical-name");
let treeCommonName = document.querySelector(".tree-common-name");
let images = document.querySelector(".images");
let mainImage = document.querySelector("#main-image-inner");

let treeAttributes = document.querySelector("#tree-attributes");
let imageLightbox = document.querySelector("#image-lightbox");
let imageLightboxInner = document.querySelector("#image-lightbox-div");
let imageLightBoxClose = document.querySelector("#image-lightbox-close");

let imageLeftButton = document.querySelector("#image-left-button");
let imageRightButton = document.querySelector("#image-right-button");
let imagePosition = 0;
let thumbImages = document.querySelectorAll(".thumb-image");

let productImage = "";
let maximumQuantityReached = false;

let stockTableDiv = document.querySelector("#stock-table-div");

let productTrees = JSON.parse(sessionStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];

(async function init() {
  addEventListeners();

  await createTreeImages();

  await getProductStockData();

  await createStockValues();

  document.querySelector(
    "#tree-name-content"
  ).innerHTML = `${treeBotanicalName.innerHTML}`;

  await createStockTable();
})();

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
    }?auto=format&w=1500&q=75' height="1500" width="1500" alt="${
      mainImg.alt
    }">`;
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
          }?auto=format&w=700&q=75" height="700" width="700" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");
        }, 500);

        mainImage.addEventListener("click", () => {
          imageLightboxInner.innerHTML = `<img src="${
            thumbImage.src.split("?")[0]
          }?auto=format&w=1500&q=75" height="1500" width="1500" alt="${
            thumbImage.alt
          }">`;
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
          }?auto=format&w=700&q=75" height="700" width="700" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=1500&q=75" height="1500" width="1500" alt="${
              thumbImage.alt
            }">`;
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
          }?auto=format&w=700&q=75" height="700" width="700" alt="${
            thumbImage.alt
          }" class="main-img" style="opacity: 1;">`;
          mainImage.style.setProperty("opacity", "1");
          mainImage.style.setProperty("visibility", "visible");

          mainImage.addEventListener("click", () => {
            imageLightboxInner.innerHTML = `<img src="${
              thumbImage.src.split("?")[0]
            }?auto=format&w=1500&q=75" height="1500" width="1500" alt="${
              thumbImage.alt
            }">`;
            document.body.classList.add("lightbox-open");
          });
        }, 500);
      }
    });
  });
}

async function createStockValues() {
  let inStock = 0;
  let totalProductionDates = 0;
  let totalProductGrades = 0;

  if (grades.length !== 0) {
    for (let i = 0; i < grades.length; i++) {
      for (let j = 0; j < grades[i].heights.length; j++) {
        let previousDate = "";
        let productionDates = [];

        for (let k = 0; k < grades[i].heights[j].standardHeights.length; k++) {
          if (parseInt(grades[i].heights[j].standardHeights[k].quantity) > 0) {
            inStock += 1;

            let gradeDiv = document.createElement("div");
            gradeDiv.classList.add("selection-box");

            let gradeSizeValue = document.createElement("p");
            gradeSizeValue.innerHTML = `Grade Size: <span class='accent-color'>${grades[i].grade}</span>`;
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

            wholesalePriceValue.innerHTML = `Price per tree: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].wholesalePrice}.00+GST (Wholesale)</span>`;

            retailPriceValue.innerHTML = `Price per tree: <span class='accent-color'>${grades[i].heights[j].standardHeights[k].retailPrice}.00+GST (Retail)</span>`;

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

            document
              .querySelector("#grade-size-selection")
              .appendChild(gradeDiv);

            totalProductGrades += 1;
          }

          for (
            let l = 0;
            l < grades[i].heights[j].standardHeights[k].productionDates.length;
            l++
          ) {
            if (
              Object.keys(
                grades[i].heights[j].standardHeights[k].productionDates[l]
              ).length !== 0
            ) {
              if (
                grades[i].heights[j].standardHeights[k].productionDates[l]
                  .dateReady !== ""
              ) {
                let currentDate = new Date();

                let compareDate = new Date(
                  grades[i].heights[j].standardHeights[k].productionDates[
                    l
                  ].dateReady
                );

                if (
                  grades[i].heights[j].standardHeights[k].productionDates[l]
                    .quantity !== "" &&
                  parseInt(
                    grades[i].heights[j].standardHeights[k].productionDates[l]
                      .quantity
                  ) !== 0 &&
                  compareDate > currentDate
                ) {
                  inStock += 1;

                  if (l === 0) {
                    productionDates.push({
                      grade: grades[i].grade,
                      quantity: parseInt(
                        grades[i].heights[j].standardHeights[k].productionDates[
                          l
                        ].quantity
                      ),
                      dateReady: compareDate,
                    });
                    previousDate = compareDate;
                  } else {
                    let found = false;
                    for (let m = 0; m < productionDates.length; m++) {
                      if (
                        compareDate.getTime() ===
                        productionDates[m].dateReady.getTime()
                      ) {
                        found = true;
                        productionDates[m].quantity += parseInt(
                          grades[i].heights[j].standardHeights[k]
                            .productionDates[l].quantity
                        );
                      }
                    }

                    if (!found) {
                      productionDates.push({
                        grade: grades[i].grade,
                        quantity: parseInt(
                          grades[i].heights[j].standardHeights[k]
                            .productionDates[l].quantity
                        ),
                        dateReady: compareDate,
                      });
                    }

                    previousDate = compareDate;
                  }
                }
              }
            }
          }

          if (productionDates.length > 0) {
            productionDates.sort((a, b) => {
              if (a.grade === b.grade) {
                if (a.dateReady.getTime() > b.dateReady.getTime()) {
                  return 1;
                } else if (a.dateReady.getTime() < b.dateReady.getTime()) {
                  return -1;
                }
              } else {
                return 0;
              }
            });

            for (let n = 0; n < productionDates.length; n++) {
              let gradeDiv = document.createElement("div");
              gradeDiv.classList.add("selection-box");

              let gradeSizeValue = document.createElement("p");
              gradeSizeValue.innerHTML = `Grade Size: <span class='accent-color'>${grades[i].grade}</span>`;

              let quantityValue = document.createElement("p");
              quantityValue.innerHTML = `Quantity In Production: <span class='accent-color'>${productionDates[n].quantity}</span>`;

              let dateReady = document.createElement("p");
              dateReady.innerHTML = `Date Ready: <span class='accent-color'>${productionDates[
                n
              ].dateReady.toLocaleDateString("en-gb", {
                year: "numeric",
                month: "long",
              })}</span>`;

              gradeDiv.appendChild(gradeSizeValue);
              gradeDiv.appendChild(quantityValue);
              gradeDiv.appendChild(dateReady);

              document
                .querySelector("#in-production-grades")
                .appendChild(gradeDiv);

              totalProductionDates += 1;
            }
          }
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
  }

  if (totalProductionDates === 0) {
    document
      .querySelector("#production-details")
      .style.setProperty("display", "none");
  }

  if (totalProductGrades === 0) {
    document
      .querySelector("#available-details")
      .style.setProperty("display", "none");
  }

  if (inStock === 0) {
    gradeSizesDiv.innerHTML = ``;
    let message = document.createElement("p");
    message.textContent = "Currently out of stock.";
    message.classList.add("bold-up");
    gradeSizesDiv.appendChild(message);
    gradeSizesDiv.style.setProperty("grid-template-columns", "1fr");
    gradeSizesDiv.style.setProperty("margin-top", "0");
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

  let table = document.createElement("table");

  if (grades.length > 0) {
    for (let i = 0; i < grades.length; i++) {
      if (i === 0) {
        let row = document.createElement("tr");
        heading.forEach((item) => {
          let cell = document.createElement("th");
          cell.textContent = item;
          row.append(cell);
        });
        table.append(row);
      }

      for (let j = 0; j < grades[i].heights.length; j++) {
        for (let k = 0; k < grades[i].heights[j].standardHeights.length; k++) {
          let row = document.createElement("tr");

          let gradeCell = document.createElement("td");
          gradeCell.textContent = grades[i].grade;

          let retailCell = document.createElement("td");
          retailCell.textContent =
            grades[i].heights[j].standardHeights[k].retailPrice;

          let wholesaleCell = document.createElement("td");
          wholesaleCell.textContent =
            grades[i].heights[j].standardHeights[k].wholesalePrice;

          let heightCell = document.createElement("td");
          if (grades[i].heights[j].averageHeight === "N/A") {
            heightCell.textContent = "";
          } else {
            heightCell.textContent = grades[i].heights[j].averageHeight;
          }

          let standardHeightCell = document.createElement("td");
          standardHeightCell.textContent =
            grades[i].heights[j].standardHeights[k].standardHeight;

          let readyCell = document.createElement("td");
          readyCell.textContent =
            grades[i].heights[j].standardHeights[k].quantity;

          let productionCell = document.createElement("td");
          productionCell.textContent =
            grades[i].heights[j].standardHeights[k].inProduction;

          row.append(gradeCell);
          row.append(retailCell);
          if (document.body.classList.contains("loggedIn")) {
            row.append(wholesaleCell);
          }
          row.append(heightCell);
          row.append(standardHeightCell);
          row.append(readyCell);
          row.append(productionCell);

          table.append(row);
        }
      }
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

  document.querySelector("#open-stock-table").addEventListener("click", () => {
    document.body.classList.add("stock-table-open");
  });

  document.querySelector("#stock-table-close").addEventListener("click", () => {
    document.body.classList.remove("stock-table-open");
  });
}

if (document.body.contains(document.querySelector("#open-more-links"))) {
  document.querySelector("#open-more-links").addEventListener("click", () => {
    document.body.classList.add("more-links-open");
  });
}

document.querySelector("#close-more-links").addEventListener("click", () => {
  document.body.classList.remove("more-links-open");
});
