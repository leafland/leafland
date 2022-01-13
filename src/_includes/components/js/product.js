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

      if (parseInt(grade.comingOn) !== 0 && !Number.isNaN(grade.comingOn)) {
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

async function createRelatedTrees(productTreeData) {
  let relatedTreesKeywords = [
    "uses",
    "tolerates",
    "winterFoliage",
    "soilType",
    "sunShade",
    "height",
    "width",
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
        if (
          relatedTreesData[i].botanicalName.split(" ")[0] ===
          productTreeData[0].botanicalName.split(" ")[0]
        ) {
          if (
            productTreeData[0].botanicalName.split(" ")[1].search("'") === -1 &&
            productTreeData[0].botanicalName.split(" ")[1] !== "x" &&
            relatedTreesData[i].botanicalName.split(" ")[1].search("'") ===
              -1 &&
            relatedTreesData[i].botanicalName.split(" ")[1] !== "x"
          ) {
            if (
              relatedTreesData[i].botanicalName.split(" ")[1] ===
              productTreeData[0].botanicalName.split(" ")[1]
            ) {
              relatedTrees.push(relatedTreesData[i]);
            }
          } else {
            relatedTrees.push(relatedTreesData[i]);
          }
        }
      }
    }

    if (relatedTrees.length < 12) {
      for (let i = 0; i < relatedTreesData.length; i++) {
        if (relatedTrees.length > 11) {
          break;
        }
        if (
          relatedTreesData[i].botanicalName !== productTreeData[0].botanicalName
        ) {
          let add = 0;

          for (let j = 0; j < relatedTreesKeywords.length; j++) {
            if (
              productTreeData[0][relatedTreesKeywords[j]] ===
              relatedTreesData[i][relatedTreesKeywords[j]]
            ) {
              add++;
            }
          }

          if (add > 8) {
            const result = relatedTrees.find(
              ({ botanicalName }) =>
                botanicalName === relatedTreesData[i].botanicalName
            );

            if (result === undefined) {
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
