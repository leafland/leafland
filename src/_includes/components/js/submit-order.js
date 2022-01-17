const submitForm = document.querySelector(".submit-form");
const treesField = document.querySelector("#trees");
const send = document.querySelector(".send-order");
const treesDisplay = document.querySelector("#form-trees");
let gridContentRight = document.querySelector("#grid-content-right");
let region = document.querySelector("#region");

let emptyMessage = document.querySelector("#empty-message");
let freightData = [];
let submitOrderImages = [];
let submitOrderTrees = JSON.parse(localStorage.getItem("trees"));

let total;
let freightTotal = document.querySelector("#freight-total");
let treeTotal = document.querySelector("#tree-total");
let orderTotal = document.querySelector("#order-total");

loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);

async function getFreightData() {
  freightData = await fetch(
    "https://api.leafland.co.nz/default/get-freight-data-file"
  )
    .then((response) => response.json())
    .catch((error) => {});
}

async function getSubmitOrderImages() {
  submitOrderImages = await fetch(
    `https://api.leafland.co.nz/default/get-image-data`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function populateForm() {
  let totalFreight = 0;
  let freightRegion = [];
  let minimumCharge = "";
  if (
    region.value !== "Northland" &&
    region.value !== "Manawatu" &&
    region.value.toLowerCase() !== "pickup"
  ) {
    freightData.forEach((datum) => {
      if (datum[0] === region.value) {
        freightRegion.push({ grade: datum[1], price: datum[2] });
        if (datum[1] === "Minimum") {
          minimumCharge = datum[2];
        }
      }
    });
  }

  totalRetailCost = localStorage.getItem("totalRetailCost");
  totalWholesaleCost = localStorage.getItem("totalWholesaleCost");
  loggedIn ? (total = totalWholesaleCost) : (total = totalRetailCost);
  treesDisplay.innerHTML = "";
  treesField.value = "";
  let title = document.createElement("p");
  title.classList.add("form-trees-title");
  title.textContent = "Trees:";

  let poaGrade = false;

  submitOrderTrees.forEach((tree) => {
    let imageDataSubset = [];

    for (let i = 0; i < submitOrderImages.length; i++) {
      if (
        submitOrderImages[i].split("/", 4)[3] ===
          `${
            tree.url.slice(0, tree.url.length - 1).split(/\/trees\//)[1]
          }.jpg` ||
        submitOrderImages[i].split("/", 4)[3] ===
          `${tree.url.slice(0, tree.url.length - 1).split(/\/trees\//)[1]}.jpeg`
      ) {
        imageDataSubset.push(submitOrderImages[i]);
      }
    }

    let freightPriceValue = "";
    if (
      region.value !== "Northland" &&
      region.value !== "Manawatu" &&
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

    let botanicalName = document.createElement("p");
    botanicalName.textContent = tree.botanicalName;
    botanicalName.classList.add("botanical-name");

    treeUrlBotanical.appendChild(botanicalName);

    treeNameDiv.appendChild(treeUrlBotanical);

    if (tree.commonName !== "") {
      let treeUrlCommon = document.createElement("a");
      treeUrlCommon.href = tree.url;
      treeUrlCommon.textContent = tree.commonName;
      treeUrlCommon.classList.add("common-name");

      treeNameDiv.appendChild(treeUrlCommon);
    }

    formTreeLeft.appendChild(treeNameDiv);

    let treeInfoDiv = document.createElement("div");
    treeInfoDiv.classList.add("tree-info");

    let gradeSize = document.createElement("p");
    gradeSize.innerHTML = `Grade size: <span class="info-pill">${tree.grade}</span>`;

    let averageHeight = document.createElement("p");
    averageHeight.innerHTML = `Average height: <span class="info-pill">${
      tree.averageHeight.toLowerCase() === "n/a"
        ? tree.averageHeight
        : tree.averageHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let standardHeight = document.createElement("p");
    standardHeight.innerHTML = `Standard height: <span class="info-pill">${
      tree.standardHeight.toLowerCase() === "none"
        ? tree.standardHeight
        : tree.standardHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let quantity = document.createElement("p");
    quantity.innerHTML = `Quantity: <span class="info-pill">${tree.quantity}</span>`;

    let price = document.createElement("p");
    price.innerHTML = `Price per tree: <span class="info-pill">${
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
    treeImage.src = `https://ik.imagekit.io/leafland/${
      imageDataSubset[imageDataSubset.length - 1]
    }?tr=w-300,q-75,pr-true,f-auto`;
    treeImage.loading = "lazy";

    formTreeRight.appendChild(treeImage);

    formTree.appendChild(formTreeLeft);
    formTree.appendChild(formTreeRight);

    treesDisplay.appendChild(formTree);

    if (
      region.value !== "Northland" &&
      region.value !== "Manawatu" &&
      region.value !== "Pickup"
    ) {
      if (freightPriceValue === "P.O.A") {
        poaGrade = true;
        freightPrice.innerHTML = `<p>Freight per tree: <span class="info-pill">P.O.A</span></p>`;

        treesField.value += `<p style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><b>${tree.botanicalName.toUpperCase()} (${tree.commonName.toUpperCase()})</b> || Grade: <b>${
          tree.grade
        }</b> || Average Height: <b>${
          tree.averageHeight.toLowerCase() === "n/a"
            ? tree.averageHeight
            : tree.averageHeight + "m"
        }</b> || Standard Height: <b>${
          tree.standardHeight.toLowerCase() === "none"
            ? tree.standardHeight
            : tree.standardHeight + "m"
        }</b> || Quantity: <b>${tree.quantity}</b> || Price per tree: <b>${
          loggedIn
            ? tree.wholesalePrice + "+GST (Wholesale)"
            : tree.retailPrice + "+GST (Retail)"
        }</b> || Freight per tree: <b>P.O.A</b> </p><br>`;
      } else {
        freightPrice.innerHTML = `<p>Freight per tree: <span class="info-pill">${freightPriceValue}+GST</span></p>`;

        treesField.value += `<p style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><b>${tree.botanicalName.toUpperCase()} (${tree.commonName.toUpperCase()})</b> || Grade: <b>${
          tree.grade
        }</b> || Average Height: <b>${
          tree.averageHeight.toLowerCase() === "n/a"
            ? tree.averageHeight
            : tree.averageHeight + "m"
        }</b> || Standard Height: <b>${
          tree.standardHeight.toLowerCase() === "none"
            ? tree.standardHeight
            : tree.standardHeight + "m"
        }</b> || Quantity: <b>${tree.quantity}</b> || Price per tree: <b>${
          loggedIn
            ? tree.wholesalePrice + "+GST (Wholesale)"
            : tree.retailPrice + "+GST (Retail)"
        }</b> || Freight per tree: <b>${freightPriceValue}+GST</b> </p><br>`;

        totalFreight +=
          parseInt(tree.quantity, 10) * parseFloat(freightPriceValue.slice(1));
      }
    } else {
      freightPrice.innerHTML = `<p>Freight per tree: <span class="info-pill">N/A</span></p>`;

      treesField.value += `<p style="padding-bottom:3px;margin-bottom:3px;border-bottom:2px solid #000"><b>${tree.botanicalName.toUpperCase()} (${tree.commonName.toUpperCase()})</b> || Grade: <b>${
        tree.grade
      }</b> || Average Height: <b>${
        tree.averageHeight.toLowerCase() === "n/a"
          ? tree.averageHeight
          : tree.averageHeight + "m"
      }</b> || Standard Height: <b>${
        tree.standardHeight.toLowerCase() === "none"
          ? tree.standardHeight
          : tree.standardHeight + "m"
      }</b> || Quantity: <b>${tree.quantity}</b> || Price per tree: <b>${
        loggedIn
          ? tree.wholesalePrice + "+GST (Wholesale)"
          : tree.retailPrice + "+GST (Retail)"
      }</b> || Freight per tree: <b>N/A</b> </p><br>`;
    }
  });

  if (
    region.value !== "Northland" &&
    region.value !== "Manawatu" &&
    region.value !== "Pickup"
  ) {
    if (poaGrade) {
      if (totalFreight <= parseInt(minimumCharge.slice(1), 10)) {
        freightTotal.innerHTML = `Freight total: <span class="info-pill">${minimumCharge}+GST (Minimum freight charge, excluding freight for P.O.A grades)</span>`;
      } else {
        freightTotal.innerHTML = `Freight total: <span class="info-pill">$${totalFreight.toFixed(
          2
        )}+GST (excluding freight for P.O.A grades)</span>`;
      }

      orderTotal.innerHTML = `Order total: <span class="info-pill">$${
        freightTotal.textContent.search("(Minimum freight charge)") !== -1
          ? (
              parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)
            ).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST (excluding freight for P.O.A grades)</span>`;
    } else {
      if (totalFreight <= parseInt(minimumCharge.slice(1), 10)) {
        freightTotal.innerHTML = `Freight total: <span class="info-pill">${minimumCharge}+GST (Minimum freight charge)</span>`;
      } else {
        freightTotal.innerHTML = `Freight total: <span class="info-pill">$${totalFreight.toFixed(
          2
        )}+GST</span>`;
      }

      orderTotal.innerHTML = `Order total: <span class="info-pill">$${
        freightTotal.textContent.search("(Minimum freight charge)") !== -1
          ? (
              parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)
            ).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST</span>`;
    }

    treeTotal.innerHTML = `Tree total: <span class="info-pill">$${total}.00+GST</span>`;
  } else {
    freightTotal.innerHTML = `Freight total: <span class="info-pill">N/A</span>`;

    treeTotal.innerHTML = `Tree total: <span class="info-pill">$${parseInt(
      total,
      10
    ).toFixed(2)}+GST</span>`;

    orderTotal.innerHTML = `Order total: <span class="info-pill">$${parseInt(
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
      await getSubmitOrderImages();

      await getFreightData();
      await populateForm();
      document.body.classList.add("page-loaded");
    }
  })();
});

send.addEventListener("click", () => {
  localStorage.removeItem("trees");
});

window.addEventListener("storage", (event) => {
  if (event.key === "trees") {
    submitOrderTrees = JSON.parse(localStorage.getItem("trees"));

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
  submitOrderTrees = JSON.parse(localStorage.getItem("trees"));

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
      .replace(/Freight total: <span class="accent-color">/, "")
      .replace(/<\/span>/, ""),
    treeTotal: treeTotal.innerHTML
      .replace(/Tree total: <span class="accent-color">/, "")
      .replace(/<\/span>/, ""),
    orderTotal: orderTotal.innerHTML
      .replace(/Order total: <span class="accent-color">/, "")
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

    document.body.querySelector(
      "#content"
    ).innerHTML = `<h1>Thanks for your order!</h1><p>From here, we will process your order and confirm we can supply the trees and grades you are after. We will also double-check the freight and let you know if there will be any extra costs (like a surcharge for rural addresses). Then we will send you an invoice that will have our bank details on for payment. We do not take payment via any sort of card.</p>`;
  })();
});
