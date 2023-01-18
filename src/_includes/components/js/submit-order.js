const submitForm = document.querySelector(".submit-form");
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

    formTree.dataset.botanicalName = tree.botanicalName;
    formTree.dataset.commonName = tree.commonName;
    formTree.dataset.grade = tree.grade;

    tree.averageHeight === ""
      ? (formTree.dataset.averageHeight = "-")
      : (formTree.dataset.averageHeight = tree.averageHeight);
    tree.standardHeight === ""
      ? (formTree.dataset.standardHeight = "-")
      : (formTree.dataset.standardHeight = tree.standardHeight);

    formTree.dataset.quantity = tree.quantity;
    formTree.dataset.retailPrice = tree.retailPrice;
    formTree.dataset.wholesalePrice = tree.wholesalePrice;

    let formTreeLeft = document.createElement("div");
    formTreeLeft.classList.add("form-tree-left");

    let treeNameDiv = document.createElement("div");
    treeNameDiv.classList.add("tree-name");

    let botanicalName = document.createElement("p");
    botanicalName.innerHTML = tree.botanicalName;
    botanicalName.classList.add("botanical-name");

    treeNameDiv.appendChild(botanicalName);

    if (tree.commonName !== "") {
      let treeUrlCommon = document.createElement("p");
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
      tree.averageHeight.toLowerCase() === "n/a" ||
      tree.averageHeight.toLowerCase() === "" ||
      tree.averageHeight.toLowerCase() === "-"
        ? "-"
        : tree.averageHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let standardHeight = document.createElement("p");
    standardHeight.innerHTML = `Standard Height: <span class="accent-color">${
      tree.standardHeight.toLowerCase() === "none" ||
      tree.standardHeight.toLowerCase() === "" ||
      tree.standardHeight.toLowerCase() === "-"
        ? "-"
        : tree.standardHeight + "<span class='lowercase'>m</span>"
    }</span>`;

    let quantity = document.createElement("p");
    quantity.innerHTML = `Quantity: <span class="accent-color">${tree.quantity}</span>`;

    let price = document.createElement("p");
    price.innerHTML = `Price per tree: <span class="accent-color">${
      loggedIn ? tree.wholesalePrice + ".00+GST (Wholesale)" : tree.retailPrice + ".00+GST (Retail)"
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
    treeImage.src = `https://img.imageboss.me/leafland/width/150/quality:75,format:auto/${tree.mainImage}`;
    treeImage.width = "150";
    treeImage.height = "150";
    treeImage.alt = `${tree.url
      .replace(/\/trees\//g, "")
      .replace(/\//g, "")
      .replace(/-/g, " ")}`;
    treeImage.loading = "lazy";

    formTreeRight.appendChild(treeImage);
    formTreeRight.appendChild(treeNameDiv);

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
        freightPrice.innerHTML = `<p class="freight-price" data-freight-price="P.O.A">Freight per tree: <span class="accent-color">P.O.A</span></p>`;
      } else {
        freightPrice.innerHTML = `<p class="freight-price" data-freight-price="${freightPriceValue}">Freight per tree: <span class="accent-color">${freightPriceValue}+GST</span></p>`;

        totalFreight += parseInt(tree.quantity, 10) * parseFloat(freightPriceValue.slice(1));
      }
    } else {
      freightPrice.innerHTML = `<p class="freight-price" data-freight-price="-">Freight per tree: <span class="accent-color">-</span></p>`;
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
          ? (parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST (excluding freight for P.O.A grades)</span>`;
    } else {
      if (totalFreight <= parseInt(minimumCharge.slice(1), 10)) {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">${minimumCharge}+GST (minimum freight charge)</span>`;
      } else {
        freightTotal.innerHTML = `Freight Total: <span class="accent-color">$${totalFreight.toFixed(2)}+GST</span>`;
      }

      orderTotal.innerHTML = `Order Total: <span class="accent-color">$${
        freightTotal.textContent.search("(minimum freight charge)") !== -1
          ? (parseInt(total, 10) + parseInt(minimumCharge.slice(1), 10)).toFixed(2)
          : (parseInt(total, 10) + totalFreight).toFixed(2)
      }+GST</span>`;
    }

    treeTotal.innerHTML = `Tree Total: <span class="accent-color">$${total}.00+GST</span>`;
  } else {
    freightTotal.innerHTML = `Freight Total: <span class="accent-color">-</span>`;

    treeTotal.innerHTML = `Tree Total: <span class="accent-color">$${parseInt(total, 10).toFixed(2)}+GST</span>`;

    orderTotal.innerHTML = `Order Total: <span class="accent-color">$${parseInt(total, 10).toFixed(2)}+GST</span>`;
  }
}

(async function () {
  if (submitOrderTrees.length === 0) {
    submitForm.style.setProperty("display", "none");
    emptyMessage.style.setProperty("display", "block");
  } else {
    await populateForm();
  }
})();

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

  let treeEmailData = "";
  document.querySelectorAll(".form-tree").forEach((child) => {
    treeEmailData += `
    
    <tr>

          <td>

            <b>${child.dataset.botanicalName}</b>

            <b>(${child.dataset.commonName})</b>

          </td>
          
          <td>
            
            <b>${child.dataset.grade}</b>

          </td>
          
          <td>

            <b>${
              child.dataset.averageHeight.toLowerCase() === "n/a" ||
              child.dataset.averageHeight.toLowerCase() === "" ||
              child.dataset.averageHeight.toLowerCase() === "-"
                ? "-"
                : child.dataset.averageHeight + "m"
            }</b>

          </td>
          
          <td>
          
          <b>${
            child.dataset.standardHeight.toLowerCase() === "none" ||
            child.dataset.standardHeight.toLowerCase() === "" ||
            child.dataset.standardHeight.toLowerCase() === "-"
              ? "-"
              : child.dataset.standardHeight + "m"
          }</b>
          </td>
          
          <td>

          <b>${child.dataset.quantity}</b>
          
          </td>
          
          <td>

          <b>${
            loggedIn
              ? child.dataset.wholesalePrice + ".00+GST (Wholesale)"
              : child.dataset.retailPrice + ".00+GST (Retail)"
          }</b>
          
          </td>
          
          <td>

          <b>${child.querySelector(".freight-price").dataset.freightPrice}</b>
          
          </td>
          
      </tr>
    
    `;
  });

  let freightTotal = document.querySelector("#freight-total");
  let treeTotal = document.querySelector("#tree-total");
  let orderTotal = document.querySelector("#order-total");

  send.textContent = "Submitting...";
  send.style.setProperty("background", "var(--button-background-color-hover");
  send.style.setProperty("color", "var(--button-text-color-hover");
  send.style.setProperty("cursor", "default");

  const { name, email, phone, streetAddress, townCity, returningCustomer, notes } = event.target;

  const internalBody = JSON.stringify({
    from_email: "administrator@leafland.co.nz",
    from_name: "Leafland Admin",
    to: [
      {
        email: "sales@leafland.co.nz",
      },
    ],
    // replyToAddress: email.value,
    // replyToName: name.value,
    subject: "Order from " + name.value,
    html: `<!DOCTYPE html><html><head><style>body{word-break:break-word} h2{margin-top: 50px} td,th{border:2px solid #000;padding:10px} table{border-collapse: collapse;}</style></head><body><h1>Order from ${
      returningCustomer.value === "No" ? name.value + " (New Customer)" : name.value + " (Returning Customer)"
    }</h1><h2>CONTACT AND DELIVERY DETAILS</h2><p>${name.value}</p><p>${email.value}</p><p>${phone.value}</p><p>${
      streetAddress.value
    }</p><p>${townCity.value}</p><h2>NOTES</h2><p>${
      notes.value !== "" ? notes.value : "No notes"
    }</p><h2>TREES</h2><table><tr><th>NAME</th><th>GRADE</th><th>HEIGHT</th><th>STANDARD HEIGHT</th><th>QUANTITY</th><th>PRICE PER TREE</th><th>FREIGHT PER TREE</th></tr>${treeEmailData}</table><h2>TOTALS</h2><p><b>FREIGHT TOTAL:</b> ${freightTotal.innerHTML
      .replace(/Freight Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")} (Region: <b>${region.value}</b>)</p><p><b>TREE TOTAL:</b> ${treeTotal.innerHTML
      .replace(/Tree Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")}</p><p><b>ORDER TOTAL:</b> ${orderTotal.innerHTML
      .replace(/Order Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")}</p></body></html>`,
    track_opens: false,
    track_clicks: false,
  });

  const externalBody = JSON.stringify({
    from_email: "sales@leafland.co.nz",
    from_name: "Leafland Sales",
    to: [
      {
        email: email.value,
      },
    ],
    // replyToAddress: "sales@leafland.co.nz",
    // replyToName: "Sales | Leafland",
    subject: "Thanks for your order!",
    html: `<!DOCTYPE html><html><head><style>body{word-break:break-word} h2{margin-top: 50px} td,th{border:2px solid #000;padding:10px} table{border-collapse: collapse;}</style></head><body><h1>Thanks for your order ${
      name.value
    }!</h1><p>We are currently processing your order and will be in touch regarding payment and delivery.</p><h2>CONTACT AND DELIVERY DETAILS</h2><p>${
      name.value
    }</p><p>${email.value}</p><p>${phone.value}</p><p>${streetAddress.value}</p><p>${
      townCity.value
    }</p><h2>NOTES</h2><p>${
      notes.value !== "" ? notes.value : "No notes"
    }</p><h2>TREES</h2><table><tr><th>NAME</th><th>GRADE</th><th>HEIGHT</th><th>STANDARD HEIGHT</th><th>QUANTITY</th><th>PRICE PER TREE</th><th>FREIGHT PER TREE</th></tr>${treeEmailData}</table><h2>TOTALS</h2><p><b>FREIGHT TOTAL:</b> ${freightTotal.innerHTML
      .replace(/Freight Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")} (Region: <b>${region.value}</b>)</p><p><b>TREE TOTAL:</b> ${treeTotal.innerHTML
      .replace(/Tree Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")}</p><p><b>ORDER TOTAL:</b> ${orderTotal.innerHTML
      .replace(/Order Total: <span class="accent-color">/, "")
      .replace(/<\/span>/, "")}</p></body></html>`,
    track_opens: false,
    track_clicks: false,
  });

  const internalRequestOptions = {
    method: "POST",
    mode: "no-cors",
    body: internalBody,
  };

  const externalRequestOptions = {
    method: "POST",
    mode: "no-cors",
    body: externalBody,
  };

  (async function () {
    await fetch("https://internal-order.leafland.co.nz", internalRequestOptions)
      .then((response) => {})
      .catch((error) => {});

    await fetch("https://external-order.leafland.co.nz", externalRequestOptions)
      .then((response) => {})
      .catch((error) => {});

    sessionStorage.setItem("submittedOrder", "true");
    window.location.reload();
  })();
});

document.querySelector("#close-submit-order").addEventListener("click", () => {
  document.body.classList.remove("submit-order-open");
});

document.querySelector("#submit-order-back").addEventListener("click", () => {
  document.body.classList.remove("submit-order-open");
  document.body.classList.add("order-open");
});
