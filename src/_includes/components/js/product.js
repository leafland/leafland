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

let productTrees = JSON.parse(sessionStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let grades = [];
let stockData = [];

(async function init() {
  addEventListeners();

  await createTreeImages();

  await getProductStockData();

  await createStockValues();
})();

async function getProductStockData() {
  stockData = await fetch(
    "https://api.leafland.co.nz/default/get-stock-data-file"
  )
    .then((response) => response.json())
    .catch((error) => {});

  stockData = stockData.filter(
    (row) =>
      row[0]
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
        .replace(/ /g, "-") ===
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
  );
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
  let productionDates = [];

  if (stockData.length > 0) {
    let previousGrade = "";
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < stockData.length; i++) {
      if (stockData[i][8] !== "0" && stockData[i][8] !== null) {
        if (stockData[i][2] !== previousGrade) {
          let button = document.createElement("button");
          button.textContent = stockData[i][2];

          button.addEventListener("click", () => {
            document.querySelector("#order-grades").innerHTML = "";

            if (!button.classList.contains("button-active")) {
              if (document.querySelector(".button-active")) {
                document
                  .querySelector(".button-active")
                  .classList.remove("button-active");
              }

              button.classList.add("button-active");

              for (let j = 0; j < stockData.length; j++) {
                if (
                  stockData[j][2] === button.textContent &&
                  stockData[j][8] !== "0" &&
                  stockData[j][8] !== null
                ) {
                  let gradeDiv = document.createElement("div");
                  gradeDiv.classList.add("selection-box");

                  let gradeValue = document.createElement("p");
                  gradeValue.innerHTML = `Grade Size: <span class='accent-color'>${stockData[j][2]}</span>`;
                  gradeValue.classList.add("order-product-grade");

                  let heightValue = document.createElement("p");
                  heightValue.classList.add("order-product-height");

                  let standardHeightValue = document.createElement("p");
                  standardHeightValue.classList.add(
                    "order-product-standard-height"
                  );

                  let quantityValue = document.createElement("p");
                  quantityValue.classList.add("order-product-quantity");

                  let wholesalePriceValue = document.createElement("p");
                  wholesalePriceValue.classList.add("wholesale-price");
                  wholesalePriceValue.classList.add(
                    "order-product-wholesale-price"
                  );

                  let retailPriceValue = document.createElement("p");
                  retailPriceValue.classList.add("retail-price");
                  retailPriceValue.classList.add("order-product-retail-price");

                  if (stockData[j][6] !== "") {
                    heightValue.innerHTML = `Height: <span class='accent-color'>${
                      stockData[j][6].toLowerCase() === "n/a"
                        ? stockData[j][6]
                        : stockData[j][6] + "m"
                    }</span>`;
                  } else {
                    heightValue.dataset.value = "N/A";
                    heightValue.innerHTML =
                      "Height: <span class='accent-color'>N/A</span>";
                  }

                  if (stockData[j][7].match(/\d+/g) !== null) {
                    standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>${stockData[j][7]}m</span>`;
                  } else if (stockData[j][7] !== "") {
                    standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>${stockData[j][7]}</span>`;
                  } else {
                    standardHeightValue.innerHTML = `Standard Height: <span class='accent-color'>None</span>`;
                  }

                  quantityValue.innerHTML = `Quantity Ready: <span class='accent-color'>${stockData[j][8]}</span>`;

                  wholesalePriceValue.innerHTML = `Price per tree: <span class='accent-color'>${stockData[j][4]}.00+GST (Wholesale)</span>`;

                  retailPriceValue.innerHTML = `Price per tree: <span class='accent-color'>${stockData[j][3]}.00+GST (Retail)</span>`;

                  gradeDiv.appendChild(gradeValue);
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
                  gradeInput.max = parseInt(stockData[j][8]);
                  gradeInput.inputmode = "numeric";

                  gradeInput.onchange = function () {
                    if (this.value < 1) {
                      this.value = 1;
                    } else if (this.value > parseInt(stockData[j][8])) {
                      this.value = parseInt(stockData[j][8]);
                    }
                  };

                  let gradeButton = document.createElement("button");
                  gradeButton.class = "add-product";
                  gradeButton.textContent = "Add to order";

                  gradeButton.dataset.grade = stockData[j][2];
                  gradeButton.dataset.height = stockData[j][6];
                  gradeButton.dataset.standardHeight =
                    stockData[j][7] === "" ? "None" : stockData[j][7];
                  gradeButton.dataset.quantity = stockData[j][8];
                  gradeButton.dataset.wholesalePrice = stockData[j][4];
                  gradeButton.dataset.retailPrice = stockData[j][3];

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

                  document.querySelector("#order-grades").appendChild(gradeDiv);
                }
              }
            } else {
              button.classList.remove("button-active");
            }
          });

          document.querySelector("#grade-size-selection").appendChild(button);
          previousGrade = stockData[i][2];
        }
      }

      for (let k = 14; k < stockData[i].length; k++) {
        let exists = (element) => stockData[i][k].includes(element);

        if (months.some(exists)) {
          let currentDate = new Date();
          let compareDate = new Date(stockData[i][k]);

          let counter = 0;
          if (compareDate.getTime() > currentDate.getTime()) {
            for (let j = 0; j < productionDates.length; j++) {
              if (
                productionDates[j].dateReady.getTime() ===
                  compareDate.getTime() &&
                productionDates[j].grade === stockData[i][2]
              ) {
                productionDates[j].quantity += parseInt(stockData[i][k - 1]);
                counter += 1;
              }
            }
            if (counter === 0) {
              productionDates.push({
                grade: stockData[i][2],
                quantity: parseInt(stockData[i][k - 1]),
                dateReady: compareDate,
                height: stockData[i][6],
                standardHeight: stockData[i][7],
                wholesalePrice: stockData[i][4],
                retailPrice: stockData[i][3],
              });
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

        let gradeValue = document.createElement("p");
        gradeValue.innerHTML = `Grade Size: <span class='accent-color'>${productionDates[n].grade}</span>`;

        let quantityValue = document.createElement("p");
        quantityValue.innerHTML = `Quantity In Production: <span class='accent-color'>${productionDates[n].quantity}</span>`;

        let wholesalePriceValue = document.createElement("p");
        wholesalePriceValue.classList.add("wholesale-price");
        wholesalePriceValue.innerHTML = `Price per tree: <span class='accent-color'>${productionDates[n].wholesalePrice}.00+GST (Wholesale)</span>`;

        let retailPriceValue = document.createElement("p");
        retailPriceValue.classList.add("retail-price");
        retailPriceValue.innerHTML = `Price per tree: <span class='accent-color'>${productionDates[n].retailPrice}.00+GST (Retail)</span>`;

        let dateReady = document.createElement("p");
        dateReady.innerHTML = `Date Ready: <span class='accent-color'>${productionDates[
          n
        ].dateReady.toLocaleDateString("en-gb", {
          year: "numeric",
          month: "long",
        })}</span>`;

        let orderNow = document.createElement("a");
        orderNow.href = `mailto:sales@leafland.co.nz?subject=Tree Pre-order&body=Hi team,%0D%0A%0D%0AI would like to place a pre-order for:%0D%0A%0D%0ATree: ${
          treeBotanicalName.textContent
        }%0D%0AGrade: ${productionDates[n].grade}%0D%0APrice per tree: ${
          loggedIn
            ? productionDates[n].wholesalePrice + ".00+GST (Wholesale)"
            : productionDates[n].retailPrice + ".00+GST (Retail)"
        }%0D%0ADate Ready: ${productionDates[n].dateReady.toLocaleDateString(
          "en-gb",
          {
            year: "numeric",
            month: "long",
          }
        )}`;
        orderNow.textContent = "Pre-order";
        orderNow.classList.add("button");

        gradeDiv.appendChild(gradeValue);
        gradeDiv.appendChild(quantityValue);
        gradeDiv.appendChild(wholesalePriceValue);
        gradeDiv.appendChild(retailPriceValue);
        gradeDiv.appendChild(dateReady);
        gradeDiv.appendChild(orderNow);

        document.querySelector("#in-production-grades").appendChild(gradeDiv);
      }
    }

    if (
      document.querySelector("#grade-size-selection").innerHTML === "" &&
      document.querySelector("#in-production-grades").innerHTML === ""
    ) {
      document.querySelector("#grade-sizes").innerHTML =
        "<p class='title'>Currently out of stock.</p>";
      document
        .querySelector("#order-grades")
        .style.setProperty("display", "none");
    } else if (
      document.querySelector("#grade-size-selection").innerHTML === ""
    ) {
      document
        .querySelector("#in-stock-grades")
        .style.setProperty("display", "none");
    }
    if (document.querySelector("#in-production-grades").innerHTML === "") {
      document
        .querySelector("#in-production-div")
        .style.setProperty("display", "none");
    }
  } else {
    document.querySelector("#grade-sizes").innerHTML =
      "<p class='title'>Currently out of stock.</p>";
    document
      .querySelector("#order-grades")
      .style.setProperty("display", "none");
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

  if (document.body.contains(document.querySelector("#open-more-links"))) {
    document.querySelector("#open-more-links").addEventListener("click", () => {
      document.body.classList.add("more-links-open");
    });
  }

  document.querySelector("#close-more-links").addEventListener("click", () => {
    document.body.classList.remove("more-links-open");
  });

  document
    .querySelector("#stock-table-open-order")
    .addEventListener("click", () => {
      document.body.classList.remove("stock-table-open");
      document.body.classList.add("order-open");
    });
}
