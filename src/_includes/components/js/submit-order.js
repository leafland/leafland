const submitForm = document.querySelector(".submit-form");
const treesField = document.querySelector("#trees");
const send = document.querySelector(".send-order");
const treesDisplay = document.querySelector("#form-trees");
let gridContentRight = document.querySelector("#grid-content-right");
let region = document.querySelector("#region");

let emptyMessage = document.querySelector("#empty-message");
let submitOrderTrees = JSON.parse(sessionStorage.getItem("trees"));

let total;
let freightTotal = document.querySelector("#freight-total");
let treeTotal = document.querySelector("#tree-total");
let orderTotal = document.querySelector("#order-total");

const orderSent = new Event("orderSent");

loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);

async function populateForm() {
  let totalFreight = 0;
  let freightRegion = [];
  let minimumCharge = "";
  if (
    region.value !== "Northland" &&
    region.value !== "Manawatu" &&
    region.value !== "Gisborne" &&
    region.value.toLowerCase() !== "pickup"
  ) {
    orderFreightData.forEach((datum) => {
      if (datum[0] === region.value) {
        freightRegion.push({ grade: datum[1], price: datum[2] });
        if (datum[1] === "Minimum") {
          minimumCharge = datum[2];
        }
      }
    });
  }

  totalRetailCost = sessionStorage.getItem("totalRetailCost");
  totalWholesaleCost = sessionStorage.getItem("totalWholesaleCost");
  loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);
  treesDisplay.innerHTML = "";
  treesField.value = "";
  let title = document.createElement("p");
  title.classList.add("form-trees-title");
  title.textContent = "Trees:";

  let poaGrade = false;

  submitOrderTrees.forEach((tree) => {
    let freightPriceValue = "";
    if (
      region.value !== "Northland" &&
      region.value !== "Manawatu" &&
      region.value !== "Gisborne" &&
      region.value.toLowerCase() !== "pickup"
    ) {
      for (i = 0; i < freightRegion.length; i++) {
        if (freightRegion[i].grade.search(tree.grade) !== -1) {
          freightPriceValue = freightRegion[i].price;
          break;
        }
      }
    }

    let formTree = document.createElement("div");
    formTree.classList.add("form-tree");

    let formTreeLeft = document.createElement("div");
    formTreeLeft.classList.add("form-tree-left");

    let treeNameDiv = document.createElement("div");
    treeNameDiv.classList.add("tree-name");

    let treeUrlBotanical = document.createElement("a");
    treeUrlBotanical.href = tree.url;
    treeUrlBotanical.innerHTML = tree.botanicalName;

    let botanicalName = document.createElement("p");
    botanicalName.classList.add("botanical-name");

    botanicalName.appendChild(treeUrlBotanical);

    treeNameDiv.appendChild(botanicalName);

    if (tree.commonName !== "") {
      let treeUrlCommon = document.createElement("a");
      treeUrlCommon.href = tree.url;
      treeUrlCommon.textContent = tree.commonName;
      treeUrlCommon.classList.add("common-name");

      treeNameDiv.appendChild(treeUrlCommon);
    }

    let treeInfoDiv = document.createElement("div");
    treeInfoDiv.classList.add("tree-info");

    let gradeSize = document.createElement("p");
    gradeSize.innerHTML = `Grade Size: <span class="accent-color">${tree.grade}</span>`;

    let averageHeight = document.createElement("p");
    averageHeight.innerHTML = `Height: <span class="accent-color">${
      tree.averageHeight.toLowerCase() === "n/a"
        ? tree.averageHeight
        : tree.averageHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let standardHeight = document.createElement("p");
    standardHeight.innerHTML = `Standard Height: <span class="accent-color">${
      tree.standardHeight.toLowerCase() === "none"
        ? tree.standardHeight
        : tree.standardHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let quantity = document.createElement("p");
    quantity.innerHTML = `Quantity: <span class="accent-color">${tree.quantity}</span>`;

    let price = document.createElement("p");
    price.innerHTML = `Price per tree: <span class="accent-color">${
      loggedIn
        ? tree.wholesalePrice + "+GST (Wholesale)"
        : tree.retailPrice + "+GST (Retail)"
    }</span>`;

    let freightPrice = document.createElement("p");

    treeInfoDiv.appendChild(gradeSize);
    treeInfoDiv.appendChild(averageHeight);
    treeInfoDiv.appendChild(standardHeight);
    treeInfoDiv.appendChild(quantity);
    treeInfoDiv.appendChild(price);
    treeInfoDiv.appendChild(freightPrice);

    formTreeLeft.appendChild(treeInfoDiv);

    let formTreeRight = document.createElement("div");
    formTreeRight.classList.add("form-tree-right");

    let treeImage = document.createElement("img");
    treeImage.src = `https://leafland.imgix.net/images/trees/${tree.mainImage}?auto=format&w=300&q=75`;
    treeImage.alt = `${tree.url
      .replace(/\/trees\//g, "")
      .replace(/\//g, "")
      .replace(/-/g, " ")}`;
    treeImage.loading = "lazy";

    formTreeRight.appendChild(treeImage);

    formTree.appendChild(treeNameDiv);
    formTree.appendChild(formTreeLeft);
    formTree.appendChild(formTreeRight);

    treesDisplay.appendChild(formTree);

    if (
      region.value !== "Northland" &&
      region.value !== "Manawatu" &&
      region.value !== "Gisborne" &&
      region.value !== "Pickup"
    ) {
      if (freightPriceValue === "P.O.A") {
        poaGrade = true;
        freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">P.O.A</span></p>`;

        treesField.value += `<tr style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><td><b>${
          tree.botanicalName
        } (${tree.commonName})</b></td> <td><b>${tree.grade}</b></td> <td><b>${
          tree.averageHeight.toLowerCase() === "n/a"
            ? tree.averageHeight
            : tree.averageHeight + "m"
        }</b></td> <td><b>${
          tree.standardHeight.toLowerCase() === "none"
            ? tree.standardHeight
            : tree.standardHeight + "m"
        }</b></td> <td><b>${tree.quantity}</b></td> <td><b>${
          loggedIn
            ? tree.wholesalePrice + "+GST (Wholesale)"
            : tree.retailPrice + "+GST (Retail)"
        }</b></td> <td><b>P.O.A</b><td> </tr>`;
      } else {
        freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">${freightPriceValue}+GST</span></p>`;

        treesField.value += `<tr style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><td><b>${
          tree.botanicalName
        } (${tree.commonName})</b></td> <td><b>${tree.grade}</b></td> <td><b>${
          tree.averageHeight.toLowerCase() === "n/a"
            ? tree.averageHeight
            : tree.averageHeight + "m"
        }</b></td> <td><b>${
          tree.standardHeight.toLowerCase() === "none"
            ? tree.standardHeight
            : tree.standardHeight + "m"
        }</b></td> <td><b>${tree.quantity}</b></td> <td><b>${
          loggedIn
            ? tree.wholesalePrice + "+GST (Wholesale)"
            : tree.retailPrice + "+GST (Retail)"
        }</b></td> <td><b>${freightPriceValue}+GST</b></td> </tr>`;

        totalFreight +=
          parseInt(tree.quantity, 10) * parseFloat(freightPriceValue.slice(1));
      }
    } else {
      freightPrice.innerHTML = `<p>Freight per tree: <span class="accent-color">N/A</span></p>`;

      treesField.value += `<tr style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><td><b>${
        tree.botanicalName
      } (${tree.commonName})</b></td> <td><b>${tree.grade}</b></td> <td><b>${
        tree.averageHeight.toLowerCase() === "n/a"
          ? tree.averageHeight
          : tree.averageHeight + "m"
      }</b></td> <td><b>${
        tree.standardHeight.toLowerCase() === "none"
          ? tree.standardHeight
          : tree.standardHeight + "m"
      }</b></td> <td><b>${tree.quantity}</b></td> <td><b>${
        loggedIn
          ? tree.wholesalePrice + "+GST (Wholesale)"
          : tree.retailPrice + "+GST (Retail)"
      }</b></td> <td><b>N/A</b></td> </tr>`;
    }
  });

  if (
    region.value !== "Northland" &&
    region.value !== "Manawatu" &&
    region.value !== "Gisborne" &&
    region.value !== "Pickup"
  ) {
    if (poaGrade) {
      if (totalFreight <= parseInt(minimumCharge.slice(1), 10)) {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">${minimumCharge}+GST (minimum freight charge, excluding freight for P.O.A grades)</span>`;
      } else {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">$${totalFreight.toFixed(
          2
        )}+GST (excluding freight for P.O.A grades)</span>`;
      }

      orderTotal.innerHTML = `Order Total: <span class="accent-color">$${
        freightTotal.textContent.search("(minimum freight charge)") !== -1
          ? (
              parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)
            ).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST (excluding freight for P.O.A grades)</span>`;
    } else {
      if (totalFreight <= parseInt(minimumCharge.slice(1), 10)) {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">${minimumCharge}+GST (minimum freight charge)</span>`;
      } else {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">$${totalFreight.toFixed(
          2
        )}+GST</span>`;
      }

      orderTotal.innerHTML = `Order Total: <span class="accent-color">$${
        freightTotal.textContent.search("(minimum freight charge)") !== -1
          ? (
              parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)
            ).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST</span>`;
    }

    treeTotal.innerHTML = `Tree Total: <span class="accent-color">$${total}.00+GST</span>`;
  } else {
    freightTotal.innerHTML = `Freight Total: <span class="accent-color">N/A</span>`;

    treeTotal.innerHTML = `Tree Total: <span class="accent-color">$${parseInt(
      total,
      10
    ).toFixed(2)}+GST</span>`;

    orderTotal.innerHTML = `Order Total: <span class="accent-color">$${parseInt(
      total,
      10
    ).toFixed(2)}+GST</span>`;
  }
}

window.addEventListener("loginUpdated", () => {
  (async function () {
    if (submitOrderTrees.length === 0) {
      submitForm.style.setProperty("display", "none");
      emptyMessage.style.setProperty("display", "block");
    } else {
      await populateForm();
    }
  })();
});

window.addEventListener("storage", (event) => {
  if (event.key === "trees") {
    submitOrderTrees = JSON.parse(sessionStorage.getItem("trees"));

    if (submitOrderTrees.length !== 0) {
      emptyMessage.style.setProperty("display", "none");

      loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);
      populateForm();
      submitForm.style.setProperty("display", "grid");
    } else {
      emptyMessage.style.setProperty("display", "block");
      submitForm.style.setProperty("display", "none");
    }
  }
});

window.addEventListener("orderUpdated", () => {
  submitOrderTrees = JSON.parse(sessionStorage.getItem("trees"));

  if (submitOrderTrees.length !== 0) {
    emptyMessage.style.setProperty("display", "none");

    loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);
    populateForm();
    submitForm.style.setProperty("display", "grid");
  } else {
    emptyMessage.style.setProperty("display", "block");
    submitForm.style.setProperty("display", "none");
  }
});

region.addEventListener("input", () => {
  populateForm();
});

submitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let freightTotal = document.querySelector("#freight-total");
  let treeTotal = document.querySelector("#tree-total");
  let orderTotal = document.querySelector("#order-total");

  send.textContent = "Submitting...";
  send.style.setProperty("background", "var(--primary-text");
  send.style.setProperty("color", "var(--secondary-background");
  send.style.setProperty("cursor", "default");

  const {
    name,
    email,
    phone,
    streetAddress,
    townCity,
    returningCustomer,
    notes,
    trees,
  } = event.target;

  const endpoint = "https://api.leafland.co.nz/default/send-order-email";

  const body = JSON.stringify({
    name: name.value,
    email: email.value,
    phone: phone.value,
    streetAddress: streetAddress.value,
    townCity: townCity.value,
    returningCustomer: returningCustomer.value,
    notes: notes.value,
    trees: trees.value,
    freightRegion: region.value,
    freightTotal: freightTotal.innerHTML
      .replace(/Freight Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, ""),
    treeTotal: treeTotal.innerHTML
      .replace(/Tree Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, ""),
    orderTotal: orderTotal.innerHTML
      .replace(/Order Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, ""),
  });
  const requestOptions = {
    method: "POST",
    body,
  };

  (async function () {
    await fetch(endpoint, requestOptions)
      .then((response) => {})
      .catch((error) => {});

    sessionStorage.setItem("trees", "[]");
    window.dispatchEvent(orderSent);
    sessionStorage.setItem("submittedOrder", "true");
    window.location.reload();
  })();
});

document.querySelector("#close-submit-order").addEventListener("click", () => {
  document.body.classList.remove("submit-order-open");
});
