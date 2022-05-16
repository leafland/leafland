let orderContent = document.querySelector("#order-content");
let openOrder = document.querySelector("#open-order");
let closeOrder = document.querySelector("#close-order");
let submitOrder = document.querySelector("#submit-order");

let totalCostText = document.querySelector("#order-overlay-total");
let productList = document.createElement("ul");
productList.classList.add("order-product-list");
const orderUpdated = new Event("orderUpdated");

let totalRetailCost = localStorage.getItem("totalRetailCost");
let totalWholesaleCost = localStorage.getItem("totalWholesaleCost");

let orderTrees;

function updateOrderTotal() {
  if (loggedIn) {
    totalCostText.innerHTML = `Total: <span class="info-pill">$${totalWholesaleCost}.00+GST (excluding freight)</span>`;
  } else {
    totalCostText.innerHTML = `Total: <span class="info-pill">$${totalRetailCost}.00+GST (excluding freight)</span>`;
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
  totalCostText.style.setProperty("visibility", "hidden");
  localStorage.setItem("totalRetailCost", "0");
  localStorage.setItem("totalWholesaleCost", "0");

  submitOrder.classList.add("disabled");
}

async function updateOrder() {
  orderTrees = JSON.parse(localStorage.getItem("trees"));

  if (!(orderTrees.length === 0)) {
    totalRetailCost = localStorage.getItem("totalRetailCost");
    totalWholesaleCost = localStorage.getItem("totalWholesaleCost");

    totalCostText.style.setProperty("visibility", "visible");
    let emptyOrder = document.querySelector(".empty-message");

    if (orderContent.contains(emptyOrder)) {
      orderContent.removeChild(emptyOrder);
    }

    submitOrder.classList.remove("disabled");

    productList.innerHTML = "";

    orderTrees.forEach((tree) => {
      let listItem = document.createElement("li");
      listItem.classList.add("order-product");

      let leftDiv = document.createElement("div");
      leftDiv.classList.add("order-product-left");

      let rightDiv = document.createElement("div");
      rightDiv.classList.add("order-product-right");

      let itemImage = document.createElement("img");
      itemImage.src = `https://leafland.imgix.net/images/trees/${tree.mainImage}?auto=format&w=300&q=75`;
      itemImage.width = "300";
      itemImage.height = "300";
      itemImage.loading = "lazy";
      itemImage.alt = `${tree.url
        .replace(/\/trees\//g, "")
        .replace(/\//g, "")
        .replace(/-/g, " ")}`;

      let itemBotanicalName = document.createElement("p");
      itemBotanicalName.innerHTML = `<a href='${tree.url}'>${tree.botanicalName}</a>`;
      itemBotanicalName.classList.add("order-botanical-name");

      let nameDiv = document.createElement("div");
      nameDiv.classList.add("order-product-name");
      nameDiv.appendChild(itemBotanicalName);

      if (tree.commonName !== "") {
        let itemCommonName = document.createElement("a");
        itemCommonName.href = `${tree.url}`;
        itemCommonName.textContent = `${tree.commonName}`;
        itemCommonName.classList.add("order-common-name");
        nameDiv.appendChild(itemCommonName);
      }

      let itemDiv = document.createElement("div");
      itemDiv.classList.add("order-item-details");

      let itemGrade = document.createElement("p");
      itemGrade.innerHTML = `Grade Size: <span class="info-pill">${tree.grade}</span>`;

      let itemAverageHeight = document.createElement("p");
      itemAverageHeight.innerHTML = `Height: <span class="info-pill">${
        tree.averageHeight.toLowerCase() === "n/a"
          ? tree.averageHeight
          : tree.averageHeight + "<span class='lowercase'>m</span>"
      }</span>`;

      let itemStandardHeight = document.createElement("p");

      if (tree.standardHeight.match(/\d+/g) !== null) {
        itemStandardHeight.innerHTML = `Standard Height: <span class="info-pill">${
          tree.standardHeight + "<span class='lowercase'>m</span>"
        }</span>`;
      } else {
        itemStandardHeight.innerHTML = `Standard Height: <span class="info-pill">${tree.standardHeight}</span>`;
      }

      let itemPrice = document.createElement("p");

      if (loggedIn) {
        itemPrice.innerHTML = `Price: <span class="info-pill">${tree.wholesalePrice}+GST (Wholesale)</span>`;
      } else {
        itemPrice.innerHTML = `Price: <span class="info-pill">${tree.retailPrice}+GST (Retail)</span>`;
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

        // Loop over each tree in the trees array
        for (let i = 0; i < orderTrees.length; i++) {
          if (orderTrees[i].botanicalName === tree.botanicalName) {
            if (orderTrees[i].grade === itemQuantity.dataset.grade) {
              if (orderTrees[i].averageHeight === itemQuantity.dataset.height) {
                if (
                  orderTrees[i].standardHeight ===
                  itemQuantity.dataset.standardHeight
                ) {
                  orderTrees[i].quantity = itemQuantity.value;
                  break;
                }
              }
            }
          }
        }
        totalWholesaleCost = 0;
        totalRetailCost = 0;

        for (i = 0; i < orderTrees.length; i++) {
          totalWholesaleCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].wholesalePrice.slice(1), 10);
          totalRetailCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].retailPrice.slice(1), 10);
        }
        updateOrderTotal();
        updateStorage();
        window.dispatchEvent(orderUpdated);
      });

      itemQuantity.addEventListener("input", () => {
        // Loop over each tree in the trees array
        for (let i = 0; i < orderTrees.length; i++) {
          if (orderTrees[i].botanicalName === tree.botanicalName) {
            if (orderTrees[i].grade === itemQuantity.dataset.grade) {
              if (orderTrees[i].averageHeight === itemQuantity.dataset.height) {
                if (
                  orderTrees[i].standardHeight ===
                  itemQuantity.dataset.standardHeight
                ) {
                  orderTrees[i].quantity = itemQuantity.value;
                  break;
                }
              }
            }
          }
        }
        totalWholesaleCost = 0;
        totalRetailCost = 0;

        for (i = 0; i < orderTrees.length; i++) {
          totalWholesaleCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].wholesalePrice.slice(1), 10);
          totalRetailCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].retailPrice.slice(1), 10);
        }
        updateOrderTotal();
        updateStorage();
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
                if (
                  orderTrees[i].standardHeight ===
                  itemQuantity.dataset.standardHeight
                ) {
                  orderTrees.splice(i, 1);
                  break;
                }
              }
            }
          }
        }

        totalWholesaleCost = 0;
        totalRetailCost = 0;
        for (i = 0; i < orderTrees.length; i++) {
          totalWholesaleCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].wholesalePrice.slice(1), 10);
          totalRetailCost +=
            orderTrees[i].quantity *
            parseInt(orderTrees[i].retailPrice.slice(1), 10);
        }

        updateStorage();
        updateOrder();
        window.dispatchEvent(orderUpdated);
      });

      leftDiv.appendChild(nameDiv);
      leftDiv.appendChild(itemDiv);
      itemDiv.appendChild(itemGrade);
      itemDiv.appendChild(itemAverageHeight);
      itemDiv.appendChild(itemStandardHeight);
      itemDiv.appendChild(itemPrice);
      leftDiv.appendChild(itemQuantity);
      leftDiv.appendChild(removeItem);

      rightDiv.appendChild(itemImage);

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
  localStorage.setItem("trees", JSON.stringify(orderTrees));
  localStorage.setItem("totalRetailCost", JSON.stringify(totalRetailCost));
  localStorage.setItem(
    "totalWholesaleCost",
    JSON.stringify(totalWholesaleCost)
  );
}

openOrder.addEventListener("click", () => {
  // updateOrder();
  document.body.classList.add("order-open");
});
closeOrder.addEventListener("click", () => {
  document.body.classList.remove("order-open");
});
window.addEventListener("storage", () => {
  localStorage.getItem("loggedIn") === "true"
    ? (loggedIn = true)
    : (loggedIn = false);
  updateOrder();
});
window.addEventListener("productAdded", () => {
  updateOrder();
});

window.addEventListener("loginUpdated", () => {
  (async function init() {
    updateOrder();
  })();
});
