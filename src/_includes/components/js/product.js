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
let lightboxImage;
let lightboxImageLow;

let grades = [];
let stockData = [];

let stockListType = "retail";

if (loggedIn) {
  stockListType = "wholesale";
  document.querySelector("#grade-price").textContent = "$Wholesale";
}

(async function init() {
  if (document.querySelector("#grade-size-images").firstElementChild) {
    document.querySelector("#grade-size-image-div").style.setProperty("display", "grid");
  }
  addEventListeners();

  productImage = mainImg.src.split("auto/")[1];

  await getProductStockData();

  await createStockValues();

  document.querySelector("#grade-sizes").style.setProperty("display", "grid");
})();

async function getProductStockData() {
  stockData = await fetch("https://get-stock-data.leafland.co.nz/")
    .then((response) => response.json())
    .catch((error) => {});

  stockData = stockData.values.filter((row) => {
    let compare = "";
    if (row[13]) {
      compare = row[13].split(" ")[0];
    }
    return compare === document.body.dataset.code;
  });
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
          button.textContent = "Add to order";

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
            document.querySelector("#order-grades-table-inner").insertBefore(row, preOrderRow);
          } else {
            if (previousRow) {
              previousRow.after(row);
            } else {
              document.querySelector("#order-grades-table-inner").insertAdjacentElement("afterbegin", row);
            }

            previousRow = row;
          }
        } else if (stockData[i][9] > 0) {
          let cell = document.createElement("td");

          let orderNow = document.createElement("button");
          orderNow.textContent = "Pre-order";

          orderNow.addEventListener("click", () => {
            document.querySelector("#pre-order-title").innerHTML = stockData[i][2] + " " + treeBotanicalName.innerHTML;
            document.querySelector(
              "#message-paragraph"
            ).innerHTML = `<button type="submit" id="send-pre-order">Submit Pre-order</button>`;
            document.body.classList.add("pre-order-open");
            document.body.classList.remove("stock-table-open");
            document.querySelector("#pre-order-quantity").max = stockData[i][9];

            document.querySelector("#pre-order-quantity").addEventListener("change", () => {
              if (parseInt(document.querySelector("#pre-order-quantity").value) < 1) {
                document.querySelector("#pre-order-quantity").value = 1;
              } else if (parseInt(document.querySelector("#pre-order-quantity").value) > stockData[i][9]) {
                document.querySelector("#pre-order-quantity").value = stockData[i][9];
              }
            });

            document.querySelector("#pre-grid-content").addEventListener("submit", (event) => {
              event.preventDefault();
              document.querySelector("#send-pre-order").textContent = "Submitting...";

              const { name, email, phone, streetAddress, townCity, notes, preOrderQuantity } = event.target;

              const internalBody = JSON.stringify({
                fromAddress: "administrator@leafland.co.nz",
                fromName: "Admin | Leafland",
                toAddress: "sales@leafland.co.nz",
                replyToAddress: email.value,
                replyToName: name.value,
                subject: "Pre-order from " + name.value,
                html: `Hi team,<br><br>I would like to place a pre-order for:<br><br>Tree: ${
                  treeBotanicalName.textContent
                }<br>Grade: ${stockData[i][2]}<br>Price per tree: ${
                  loggedIn ? stockData[i][5] + "+GST (Wholesale)" : stockData[i][3] + "+GST (Retail)"
                }<br>Quantity: ${preOrderQuantity.value}<br><br><br>Name: ${name.value}<br>Email: ${
                  email.value
                }<br>Phone: ${phone.value}<br>Street Address: ${streetAddress.value}<br>Town/City: ${
                  townCity.value
                }<br>Notes: ${notes.value}`,
                isOpenTracked: false,
              });

              const internalRequestOptions = {
                method: "POST",
                mode: "no-cors",
                body: internalBody,
              };

              (async function () {
                await fetch("https://internal-order.leafland.co.nz", internalRequestOptions)
                  .then((response) => {
                    document.querySelector(
                      "#message-paragraph"
                    ).innerHTML = `<p>Thanks for your pre-order! We will be in touch to confirm your pre-order. Payment is done via internet banking and we will email through an invoice for the 50% deposit.</p>`;
                  })
                  .catch((error) => {});
              })();
            });
          });

          cell.append(orderNow);
          row.append(cell);

          document.querySelector("#order-grades-table-inner").insertAdjacentElement("beforeend", row);

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
      document.querySelector("#grade-sizes").innerHTML = "<p class='title'>Currently out of stock.</p>";
    }
  } else {
    document.querySelector("#grade-sizes").innerHTML = "<p class='title'>Currently out of stock.</p>";
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
    totalWholesaleCost += tree.quantity * parseInt(tree.wholesalePrice.slice(1), 10);
  });

  sessionStorage.setItem("trees", JSON.stringify(productTrees));
  sessionStorage.setItem("totalRetailCost", JSON.stringify(totalRetailCost));
  sessionStorage.setItem("totalWholesaleCost", JSON.stringify(totalWholesaleCost));
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

  document.querySelector("#pre-order-close").addEventListener("click", () => {
    document.body.classList.remove("pre-order-open");
  });

  document.querySelector("#pre-order-back").addEventListener("click", () => {
    document.body.classList.remove("pre-order-open");
    document.body.classList.add("stock-table-open");
  });

  imageLightBoxClose.addEventListener("click", () => {
    document.body.classList.remove("lightbox-open");
    document.querySelector("#next-prev").style.setProperty("display", "none");
    lightboxImage.src = "";
  });

  for (let i = 0; i < thumbImages.length; i++) {
    thumbImages[i].addEventListener("click", (e) => {
      lightboxImage = document.querySelector("#lightbox-image");
      lightboxImage.src = "";

      document.querySelector("#next-prev").style.setProperty("display", "grid");
      document.querySelector("#date-taken-div").style.setProperty("display", "none");
      document.querySelector("#date-taken-div").innerHTML = "";

      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:85,format:auto/${thumbImages[i].dataset.url}`;

      lightboxImage.alt = thumbImages[i].alt;

      lightboxImage.dataset.position = i;

      document.body.classList.add("lightbox-open");
    });
  }

  document.querySelector("#image-lightbox-prev").addEventListener("click", () => {
    lightboxImage = document.querySelector("#lightbox-image");
    lightboxImage.src = "";

    if (parseInt(lightboxImage.dataset.position) === 0) {
      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:85,format:auto/${
        thumbImages[thumbImages.length - 1].dataset.url
      }`;

      lightboxImage.alt = thumbImages[thumbImages.length - 1].alt;

      lightboxImage.dataset.position = thumbImages.length - 1;
    } else {
      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:85,format:auto/${
        thumbImages[parseInt(lightboxImage.dataset.position) - 1].dataset.url
      }`;

      lightboxImage.alt = thumbImages[parseInt(lightboxImage.dataset.position) - 1].alt;

      lightboxImage.dataset.position = parseInt(lightboxImage.dataset.position) - 1;
    }
  });

  document.querySelector("#image-lightbox-next").addEventListener("click", () => {
    lightboxImage = document.querySelector("#lightbox-image");
    lightboxImage.src = "";

    if (parseInt(lightboxImage.dataset.position) === thumbImages.length - 1) {
      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:85,format:auto/${thumbImages[0].dataset.url}`;

      lightboxImage.alt = thumbImages[0].alt;

      lightboxImage.dataset.position = 0;
    } else {
      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:85,format:auto/${
        thumbImages[parseInt(lightboxImage.dataset.position) + 1].dataset.url
      }`;

      lightboxImage.alt = thumbImages[parseInt(lightboxImage.dataset.position) + 1].alt;

      lightboxImage.dataset.position = parseInt(lightboxImage.dataset.position) + 1;
    }
  });

  document.querySelectorAll(".grade-size-div").forEach((gradeImage) =>
    gradeImage.addEventListener("click", () => {
      document.querySelector("#date-taken-div").innerHTML = "";
      document.querySelector("#date-taken-div").style.setProperty("display", "inline-block");
      lightboxImage = document.querySelector("#lightbox-image");
      lightboxImage.src = "";

      let info = gradeImage.dataset.info.split("&");

      lightboxImage.src = `https://img.imageboss.me/leafland/width/1500/quality:75,format:auto/${info[0]}`;

      lightboxImage.alt = info[1];

      document.body.classList.add("lightbox-open");
      imageLightbox.style.setProperty("z-index", "9");

      document.querySelector(
        "#date-taken-div"
      ).innerHTML = `<span id="date-taken" style="font-weight:600">${info[3]} in ${info[2]}</span>`;
    })
  );
}
