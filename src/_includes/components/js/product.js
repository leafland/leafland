let gradeSizesDiv = document.querySelector("#grade-sizes");

let treeBotanicalName = document.querySelector(".tree-botanical-name");
let treeCommonName = document.querySelector(".tree-common-name");
let images = document.querySelector(".images");

let treeAttributes = document.querySelector("#tree-attributes");
let imageLightbox = document.querySelector("#image-lightbox");
let imageLightboxInner = document.querySelector("#image-lightbox-div");
let imageLightBoxClose = document.querySelector("#image-lightbox-close");

let thumbImages = document.querySelectorAll(".thumb-image");

let productImage = "";
let maximumQuantityReached = false;

let productTrees = JSON.parse(sessionStorage.getItem("trees"));

const productAdded = new Event("productAdded");

let mainImg = document.querySelector(".main-img");

let grades = [];
let stockData = [];

let stockListType = "retail";

if (loggedIn) {
  stockListType = "wholesale";
  document.querySelector("#grade-price").textContent = "$Wholesale";
}

(async function init() {
  if (document.querySelector("#grade-size-images").firstElementChild) {
    document
      .querySelector("#grade-size-image-div")
      .style.setProperty("display", "grid");
  }
  addEventListeners();

  productImage = mainImg.src.split("files.leafland.co.nz/")[1];

  await getProductStockData();

  await createStockValues();

  document.querySelector("#grade-sizes").style.setProperty("display", "grid");
})();

async function getProductStockData() {
  stockData = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1MjWaC2gSJykzoEwj0CvGBjdQF-U4Yu1c4F-tVMU44NQ/values/Sheet1!A2:ZZ9999?key=AIzaSyCRZYs44jejbsBovgiExFgyJBOq0Vkd5uw"
  )
    .then((response) => response.json())
    .catch((error) => {});

  stockData = stockData.values.filter(
    (row) => row[13] === document.body.dataset.code
  );
}

async function createStockValues() {
  if (stockData.length > 0) {
    let preOrderRow = null;
    let previousRow = null;

    for (let i = 0; i < stockData.length; i++) {
      if (parseInt(stockData[i][8]) !== 0 || parseInt(stockData[i][9]) !== 0) {
        let row = document.createElement("tr");

        if (stockData[i][8] > 0) {
          let cell = document.createElement("td");

          let button = document.createElement("button");
          button.textContent = "Order " + stockData[i][2];

          button.addEventListener("click", () => {
            addTreeToSessionStorage(
              stockData[i][2],
              stockData[i][6],
              1,
              stockData[i][8],
              stockData[i][7],
              stockData[i][3],
              stockData[i][5]
            );
            window.dispatchEvent(productAdded);

            document.body.classList.remove("stock-table-open");
            document.body.classList.add("order-open");
          });

          cell.append(button);
          row.append(cell);

          if (preOrderRow) {
            document
              .querySelector("#order-grades-table-inner")
              .insertBefore(row, preOrderRow);
          } else {
            if (previousRow) {
              previousRow.after(row);
            } else {
              document
                .querySelector("#order-grades-table-inner")
                .insertAdjacentElement("afterbegin", row);
            }

            previousRow = row;
          }
        } else if (stockData[i][9] > 0) {
          let cell = document.createElement("td");

          let orderNow = document.createElement("a");
          orderNow.href = `mailto:sales@leafland.co.nz?subject=Tree Pre-order&body=Hi team,%0D%0A%0D%0AI would like to place a pre-order for:%0D%0A%0D%0ATree: ${
            treeBotanicalName.textContent
          }%0D%0AGrade: ${stockData[i][2]}%0D%0APrice per tree: ${
            loggedIn
              ? stockData[i][5] + ".00+GST (Wholesale)"
              : stockData[i][3] + ".00+GST (Retail)"
          }`;
          orderNow.textContent = "Pre-order " + stockData[i][2];
          orderNow.classList.add("button");

          cell.append(orderNow);
          row.append(cell);

          document
            .querySelector("#order-grades-table-inner")
            .insertAdjacentElement("beforeend", row);

          if (!preOrderRow) {
            preOrderRow = row;
          }
        }

        for (let j = 0; j < stockData[i].length; j++) {
          if (j !== 0 && j !== 1 && j !== 4 && j < 10) {
            let cell = document.createElement("td");
            if (stockListType === "retail") {
              if (j !== 5) {
                stockData[i][j].replaceAll('"', "") === ""
                  ? (cell.textContent = "-")
                  : (cell.textContent = stockData[i][j].replaceAll('"', ""));
                row.append(cell);
              }
            } else {
              if (j !== 3) {
                stockData[i][j].replaceAll('"', "") === ""
                  ? (cell.textContent = "-")
                  : (cell.textContent = stockData[i][j].replaceAll('"', ""));

                row.append(cell);
              }
            }
          }
        }
      }
    }

    if (document.querySelector("#order-grades-table-inner").innerHTML === "") {
      document.querySelector("#grade-sizes").innerHTML =
        "<p class='title'>Currently out of stock.</p>";
    }
  } else {
    document.querySelector("#grade-sizes").innerHTML =
      "<p class='title'>Currently out of stock.</p>";
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

  imageLightBoxClose.addEventListener("click", () => {
    document.body.classList.remove("lightbox-open");
    document.querySelector("#next-prev").style.setProperty("display", "none");
  });

  let lightboxImage;

  for (let i = 0; i < thumbImages.length; i++) {
    thumbImages[i].addEventListener("click", (e) => {
      lightboxImage = document.querySelector("#lightbox-image");
      document.querySelector("#next-prev").style.setProperty("display", "grid");
      document
        .querySelector("#date-taken-div")
        .style.setProperty("display", "none");
      document.querySelector("#date-taken-div").innerHTML = "";

      imageLightboxInner.innerHTML = `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=2000/https://files.leafland.co.nz/${
        thumbImages[i].src.split("files.leafland.co.nz/")[1]
      }' height="2000" width="2000" alt="${
        thumbImages[i].alt
      }" data-position='${i}' id="lightbox-image">`;

      document.body.classList.add("lightbox-open");
    });
  }

  document
    .querySelector("#image-lightbox-prev")
    .addEventListener("click", () => {
      lightboxImage = document.querySelector("#lightbox-image");

      imageLightboxInner.innerHTML =
        parseInt(lightboxImage.dataset.position) === 0
          ? `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=2000/https://files.leafland.co.nz/${
              thumbImages[thumbImages.length - 1].src.split(
                "files.leafland.co.nz/"
              )[1]
            }' height="2000" width="2000" alt="${
              thumbImages[thumbImages.length - 1].alt
            }" data-position='${thumbImages.length - 1}' id="lightbox-image">`
          : `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=2000/https://files.leafland.co.nz/${
              thumbImages[
                parseInt(lightboxImage.dataset.position) - 1
              ].src.split("files.leafland.co.nz/")[1]
            }' height="2000" width="2000" alt="${
              thumbImages[parseInt(lightboxImage.dataset.position) - 1].alt
            }" data-position='${
              parseInt(lightboxImage.dataset.position) - 1
            }' id="lightbox-image">`;
    });

  document
    .querySelector("#image-lightbox-next")
    .addEventListener("click", () => {
      lightboxImage = document.querySelector("#lightbox-image");

      imageLightboxInner.innerHTML =
        parseInt(lightboxImage.dataset.position) === thumbImages.length - 1
          ? `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=2000/https://files.leafland.co.nz/${
              thumbImages[0].src.split("files.leafland.co.nz/")[1]
            }' height="2000" width="2000" alt="${
              thumbImages[0].alt
            }" data-position='0' id="lightbox-image">`
          : `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=2000/https://files.leafland.co.nz/${
              thumbImages[
                parseInt(lightboxImage.dataset.position) + 1
              ].src.split("files.leafland.co.nz/")[1]
            }' height="2000" width="2000" alt="${
              thumbImages[parseInt(lightboxImage.dataset.position) + 1].alt
            }" data-position='${
              parseInt(lightboxImage.dataset.position) + 1
            }' id="lightbox-image">`;
    });

  document.querySelectorAll(".grade-size-div").forEach((gradeImage) =>
    gradeImage.addEventListener("click", () => {
      document.querySelector("#date-taken-div").innerHTML = "";
      document
        .querySelector("#date-taken-div")
        .style.setProperty("display", "inline-block");

      let info = gradeImage.dataset.info.split("&");

      imageLightboxInner.innerHTML = `<img src='https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=1500/https://files.leafland.co.nz/${info[0]}' height="1500" width="1500" alt="${info[1]}">`;
      document.body.classList.add("lightbox-open");
      imageLightbox.style.setProperty("z-index", "9");

      document.querySelector(
        "#date-taken-div"
      ).innerHTML = `<span id="date-taken" style="font-weight:600">${info[3]} in ${info[2]}</span>`;
    })
  );
}
