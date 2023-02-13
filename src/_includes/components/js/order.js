let orderContent = document.querySelector("#order-content");
let openOrder = document.querySelector("#open-order");
let closeOrder = document.querySelector("#close-order");
let submitOrder = document.querySelector("#submit-order");

let orderRegion = document.querySelector("#order-region");
let orderRegionSelect = document.querySelector(".order-region-select");

let totalCostText = document.querySelector("#order-overlay-total");
let productList = document.createElement("ul");
productList.classList.add("order-product-list");
const orderUpdated = new Event("orderUpdated");

let totalRetailCost = sessionStorage.getItem("totalRetailCost");
let totalWholesaleCost = sessionStorage.getItem("totalWholesaleCost");

let orderTrees;

let orderSticky = document.querySelector("#order-sticky");

let orderFreightData = [];
let orderTotalFreight = 0;
let orderPoaGrade = false;
let orderMinimumCharge = "";

async function getOrderFreightData() {
  orderFreightData = await fetch("/public/freight.json")
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

function updateOrderTotal() {
  let total = "";
  totalRetailCost = sessionStorage.getItem("totalRetailCost");
  totalWholesaleCost = sessionStorage.getItem("totalWholesaleCost");

  if (loggedIn) {
    total = totalWholesaleCost;
  } else {
    total = totalRetailCost;
  }

  if (
    orderRegion.value !== "Northland" &&
    orderRegion.value !== "Manawatu" &&
    orderRegion.value !== "Gisborne" &&
    orderRegion.value !== "Pickup"
  ) {
    if (orderPoaGrade) {
      if (orderTotalFreight <= parseInt(orderMinimumCharge.slice(1), 10)) {
        totalCostText.innerHTML = `Total: <span class="accent-color">$${
          parseInt(total, 10) + parseInt(orderMinimumCharge.slice(1), 10)
        }+GST (includes minimum freight charge, excluding freight for P.O.A grades)</span>`;
      } else {
        totalCostText.innerHTML = `Total: <span class="accent-color">$${(
          parseInt(total, 10) + orderTotalFreight
        ).toFixed(2)}+GST (excluding freight for P.O.A grades)</span>`;
      }
    } else {
      if (orderTotalFreight <= parseInt(orderMinimumCharge.slice(1), 10)) {
        totalCostText.innerHTML = `Total: <span class="accent-color">$${
          parseInt(total, 10) + parseInt(orderMinimumCharge.slice(1), 10)
        }+GST (includes minimum freight charge)</span>`;
      } else {
        totalCostText.innerHTML = `Total: <span class="accent-color">$${(
          parseInt(total, 10) + orderTotalFreight
        ).toFixed(2)}+GST (including freight)</span>`;
      }
    }
  } else {
    totalCostText.innerHTML = `Total: <span class="accent-color">$${parseInt(total, 10).toFixed(
      2
    )}+GST (excluding freight)</span>`;
  }
}

function displayEmptyOrder() {
  if (orderContent.contains(productList)) {
    orderContent.removeChild(productList);
  }
  orderContent.innerHTML = "";

  let empty = document.createElement("p");
  empty.textContent = "No trees in order.";
  empty.classList.add("empty-message");
  empty.classList.add("paragraph-title");

  orderContent.appendChild(empty);
  orderSticky.style.setProperty("visibility", "hidden");
  orderRegionSelect.style.setProperty("visibility", "hidden");
  sessionStorage.setItem("totalRetailCost", "0");
  sessionStorage.setItem("totalWholesaleCost", "0");

  submitOrder.classList.add("disabled");
}

async function updateOrder() {
  orderTrees = JSON.parse(sessionStorage.getItem("trees"));

  if (!(orderTrees.length === 0)) {
    orderTotalFreight = 0;
    let freightRegion = [];
    orderMinimumCharge = "";
    if (
      orderRegion.value !== "Northland" &&
      orderRegion.value !== "Manawatu" &&
      orderRegion.value !== "Gisborne" &&
      orderRegion.value.toLowerCase() !== "pickup"
    ) {
      orderFreightData.forEach((datum) => {
        if (datum[0] === orderRegion.value) {
          freightRegion.push({ grade: datum[1], price: datum[2] });
          if (datum[1] === "Minimum") {
            orderMinimumCharge = datum[2];
          }
        }
      });
    }

    totalRetailCost = sessionStorage.getItem("totalRetailCost");
    totalWholesaleCost = sessionStorage.getItem("totalWholesaleCost");

    orderSticky.style.setProperty("visibility", "visible");
    orderRegionSelect.style.setProperty("visibility", "visible");

    let emptyOrder = document.querySelector(".empty-message");

    if (orderContent.contains(emptyOrder)) {
      orderContent.removeChild(emptyOrder);
    }

    submitOrder.classList.remove("disabled");

    productList.innerHTML = "";

    orderPoaGrade = false;

    orderTrees.forEach((tree) => {
      let freightPriceValue = "";
      if (
        orderRegion.value !== "Northland" &&
        orderRegion.value !== "Manawatu" &&
        orderRegion.value !== "Gisborne" &&
        orderRegion.value.toLowerCase() !== "pickup"
      ) {
        for (i = 0; i < freightRegion.length; i++) {
          if (freightRegion[i].grade.search(tree.grade) !== -1) {
            freightPriceValue = freightRegion[i].price;
            break;
          }
        }
      }

      let listItem = document.createElement("li");
      listItem.classList.add("order-product");

      let leftDiv = document.createElement("div");
      leftDiv.classList.add("order-product-left");

      let rightDiv = document.createElement("div");
      rightDiv.classList.add("order-product-right");

      let itemImage = document.createElement("img");
      itemImage.src = `https://img.imageboss.me/leafland/width/150/quality:75,format:auto/${tree.mainImage}`;
      itemImage.width = "150";
      itemImage.height = "150";
      itemImage.loading = "lazy";
      itemImage.alt = `${tree.url
        .replace(/\/trees\//g, "")
        .replace(/\//g, "")
        .replace(/-/g, " ")}`;

      let itemBotanicalName = document.createElement("p");
      itemBotanicalName.innerHTML = tree.botanicalName;
      itemBotanicalName.classList.add("order-botanical-name");

      let nameDiv = document.createElement("div");
      nameDiv.classList.add("order-product-name");

      nameDiv.appendChild(itemBotanicalName);

      if (tree.commonName !== "") {
        let itemCommonName = document.createElement("p");
        itemCommonName.textContent = tree.commonName;
        itemCommonName.classList.add("order-common-name");
        nameDiv.appendChild(itemCommonName);
      }

      let itemDiv = document.createElement("div");
      itemDiv.classList.add("order-item-details");

      let itemGrade = document.createElement("p");
      itemGrade.innerHTML = `Grade Size: <span class="accent-color">${tree.grade}</span>`;

      let itemAverageHeight = document.createElement("p");
      itemAverageHeight.innerHTML = `Height: <span class="accent-color">${
        tree.averageHeight.toLowerCase() === "n/a" || tree.averageHeight.toLowerCase() === ""
          ? "-"
          : tree.averageHeight + "<span class='lowercase'>m</span>"
      }</span>`;

      let itemStandardHeight = document.createElement("p");

      if (tree.standardHeight.match(/\d+/g) !== null) {
        itemStandardHeight.innerHTML = `Standard Height: <span class="accent-color">${
          tree.standardHeight + "<span class='lowercase'>m</span>"
        }</span>`;
      } else {
        itemStandardHeight.innerHTML = `Standard Height: <span class="accent-color">-</span>`;
      }

      let itemPrice = document.createElement("p");

      if (loggedIn) {
        itemPrice.innerHTML = `Price per tree: <span class="accent-color">${tree.wholesalePrice}+GST (Wholesale)</span>`;
      } else {
        itemPrice.innerHTML = `Price per tree: <span class="accent-color">${tree.retailPrice}+GST (Retail)</span>`;
      }

      let freightPrice = document.createElement("p");

      if (
        orderRegion.value !== "Northland" &&
        orderRegion.value !== "Manawatu" &&
        orderRegion.value !== "Gisborne" &&
        orderRegion.value !== "Pickup"
      ) {
        if (freightPriceValue === "P.O.A") {
          orderPoaGrade = true;
          freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">P.O.A</span></p>`;
        } else {
          freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">${freightPriceValue}+GST</span></p>`;

          orderTotalFreight += parseInt(tree.quantity, 10) * parseFloat(freightPriceValue.slice(1));
        }
      } else {
        freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">-</span></p>`;
      }

      let itemQuantity = document.createElement("input");

      itemQuantity.type = "number";
      itemQuantity.value = tree.quantity;
      itemQuantity.min = "1";
      itemQuantity.max = tree.maxQuantity;
      itemQuantity.inputMode = "numeric";
      itemQuantity.classList.add("order-quantity");
      itemQuantity.dataset.grade = tree.grade;
      itemQuantity.dataset.height = tree.averageHeight;
      itemQuantity.dataset.standardHeight = tree.standardHeight;

      itemQuantity.addEventListener("change", () => {
        if (parseInt(itemQuantity.value) < 1) {
          itemQuantity.value = 1;
        } else if (parseInt(itemQuantity.value) > parseInt(tree.maxQuantity)) {
          itemQuantity.value = parseInt(tree.maxQuantity);
        }

        for (let i = 0; i < orderTrees.length; i++) {
          if (orderTrees[i].botanicalName === tree.botanicalName) {
            if (orderTrees[i].grade === itemQuantity.dataset.grade) {
              if (orderTrees[i].averageHeight === itemQuantity.dataset.height) {
                if (orderTrees[i].standardHeight === itemQuantity.dataset.standardHeight) {
                  orderTrees[i].quantity = itemQuantity.value;
                  break;
                }
              }
            }
          }
        }

        totalWholesaleCost = 0;
        totalRetailCost = 0;
        orderTotalFreight = 0;

        for (i = 0; i < orderTrees.length; i++) {
          totalWholesaleCost += orderTrees[i].quantity * parseInt(orderTrees[i].wholesalePrice.slice(1), 10);
          totalRetailCost += orderTrees[i].quantity * parseInt(orderTrees[i].retailPrice.slice(1), 10);

          freightPriceValue = "";
          if (
            orderRegion.value !== "Northland" &&
            orderRegion.value !== "Manawatu" &&
            orderRegion.value !== "Gisborne" &&
            orderRegion.value.toLowerCase() !== "pickup"
          ) {
            for (j = 0; j < freightRegion.length; j++) {
              if (freightRegion[j].grade.search(orderTrees[i].grade) !== -1) {
                freightPriceValue = freightRegion[j].price;
                break;
              }
            }
          }

          if (
            orderRegion.value !== "Northland" &&
            orderRegion.value !== "Manawatu" &&
            orderRegion.value !== "Gisborne" &&
            orderRegion.value !== "Pickup"
          ) {
            if (freightPriceValue === "P.O.A") {
            } else {
              orderTotalFreight += parseInt(orderTrees[i].quantity, 10) * parseFloat(freightPriceValue.slice(1));
            }
          } else {
          }
        }

        updateStorage();
        updateOrderTotal();
        window.dispatchEvent(orderUpdated);
      });

      let removeItem = document.createElement("button");

      removeItem.textContent = "Remove";
      removeItem.classList.add("remove-item");

      removeItem.addEventListener("click", () => {
        for (let i = 0; i < orderTrees.length; i++) {
          if (orderTrees[i].botanicalName === tree.botanicalName) {
            if (orderTrees[i].grade === itemQuantity.dataset.grade) {
              if (orderTrees[i].averageHeight === itemQuantity.dataset.height) {
                if (orderTrees[i].standardHeight === itemQuantity.dataset.standardHeight) {
                  orderTrees.splice(i, 1);
                  break;
                }
              }
            }
          }
        }

        totalWholesaleCost = 0;
        totalRetailCost = 0;
        orderTotalFreight = 0;

        for (i = 0; i < orderTrees.length; i++) {
          totalWholesaleCost += orderTrees[i].quantity * parseInt(orderTrees[i].wholesalePrice.slice(1), 10);
          totalRetailCost += orderTrees[i].quantity * parseInt(orderTrees[i].retailPrice.slice(1), 10);

          freightPriceValue = "";
          if (
            orderRegion.value !== "Northland" &&
            orderRegion.value !== "Manawatu" &&
            orderRegion.value !== "Gisborne" &&
            orderRegion.value.toLowerCase() !== "pickup"
          ) {
            for (j = 0; j < freightRegion.length; j++) {
              if (freightRegion[j].grade.search(orderTrees[i].grade) !== -1) {
                freightPriceValue = freightRegion[j].price;
                break;
              }
            }
          }

          if (
            orderRegion.value !== "Northland" &&
            orderRegion.value !== "Manawatu" &&
            orderRegion.value !== "Gisborne" &&
            orderRegion.value !== "Pickup"
          ) {
            if (freightPriceValue === "P.O.A") {
            } else {
              orderTotalFreight += parseInt(orderTrees[i].quantity, 10) * parseFloat(freightPriceValue.slice(1));
            }
          } else {
          }
        }

        updateStorage();
        updateOrder();
        window.dispatchEvent(orderUpdated);
      });

      leftDiv.appendChild(itemDiv);
      itemDiv.appendChild(itemGrade);
      itemDiv.appendChild(itemAverageHeight);
      itemDiv.appendChild(itemStandardHeight);
      itemDiv.appendChild(itemPrice);
      itemDiv.appendChild(freightPrice);
      leftDiv.appendChild(itemQuantity);
      leftDiv.appendChild(removeItem);

      rightDiv.appendChild(itemImage);
      rightDiv.appendChild(nameDiv);

      listItem.appendChild(leftDiv);
      listItem.appendChild(rightDiv);

      productList.appendChild(listItem);
    });

    orderContent.appendChild(productList);

    updateOrderTotal();
  } else {
    displayEmptyOrder();
  }

  window.dispatchEvent(orderUpdated);
}

function updateStorage() {
  sessionStorage.setItem("trees", JSON.stringify(orderTrees));
  sessionStorage.setItem("totalRetailCost", JSON.stringify(totalRetailCost));
  sessionStorage.setItem("totalWholesaleCost", JSON.stringify(totalWholesaleCost));
}

openOrder.addEventListener("click", () => {
  document.body.classList.add("order-open");
});
closeOrder.addEventListener("click", () => {
  document.body.classList.remove("order-open");
});
window.addEventListener("storage", () => {
  sessionStorage.getItem("loggedIn") === "true" ? (loggedIn = true) : (loggedIn = false);
  updateOrder();
});
window.addEventListener("productAdded", () => {
  updateOrder();
});

window.addEventListener("orderSent", () => {
  updateOrder();
});

(async function init() {
  updateOrder();
  getOrderFreightData();
})();

orderRegion.addEventListener("input", () => {
  updateOrder();
});

submitOrder.addEventListener("click", () => {
  document.body.classList.remove("order-open");
  document.body.classList.add("submit-order-open");
});

if (document.body.dataset.code) {
  document.querySelector("#stock-table-back").style.setProperty("display", "inline-block");

  document.querySelector("#stock-table-back").addEventListener("click", () => {
    document.body.classList.remove("order-open");
    document.body.classList.add("stock-table-open");
  });
}
