let menuStockLink = document.querySelector("#menu-stock-link");
let loggedIn = false;
let treeData = [];

const orderSent = new Event("orderSent");
const dataLoaded = new Event("dataLoaded");

if (sessionStorage.getItem("submittedOrder") === "true") {
  sessionStorage.setItem("trees", "[]");
  window.dispatchEvent(orderSent);

  document.body.classList.add("order-sent-open");
  document.querySelector("#close-order-sent").addEventListener("click", () => {
    document.body.classList.remove("order-sent-open");
  });

  sessionStorage.setItem("submittedOrder", "false");
} else {
  document.body.classList.remove("order-sent-open");
}

if (sessionStorage.getItem("trees") === null) {
  sessionStorage.setItem("trees", "[]");
}

if (sessionStorage.getItem("loggedIn") === "false" || sessionStorage.getItem("loggedIn") === null) {
  loggedIn = false;
  sessionStorage.setItem("loggedIn", "false");

  menuStockLink.href = `/retail-stock-list/`;
  document.body.classList.remove("loggedIn");

  document.querySelector("#login-form").style.setProperty("display", "block");
  document.querySelector("#login-message").style.setProperty("display", "none");
  document.querySelector("#log-out").style.setProperty("display", "none");
} else {
  loggedIn = true;
  sessionStorage.setItem("loggedIn", "true");

  menuStockLink.href = `/wholesale-stock-list/`;
  document.body.classList.add("loggedIn");

  document.querySelector("#login-form").style.setProperty("display", "none");
  document.querySelector("#login-message").style.setProperty("display", "block");
  document.querySelector("#log-out").style.setProperty("display", "block");
}

(async function () {
  treeData = await fetch(`/public/trees.json`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
  window.dispatchEvent(dataLoaded);
})();

document.querySelector("#cart-icon").addEventListener("click", (event) => {
  event.preventDefault();
  document.body.classList.add("order-open");
});

document.querySelector("#subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#subscribe").value = "Subscribing...";

  const newContactExternalBody = JSON.stringify({
    email_address: event.target.email.value,
    status: "subscribed",
    merge_fields: {
      FNAME: event.target.firstName.value,
    },
    tags: ["retail"],
  });

  const newContactExternalRequestOptions = {
    method: "POST",
    mode: "no-cors",
    body: newContactExternalBody,
  };

  (async function () {
    await fetch("https://update-contacts.leafland.co.nz", newContactExternalRequestOptions)
      .then((response) => {
        document.querySelector("#email-signup").innerHTML = `<p>Thanks for subscribing!</p>`;
      })
      .catch((error) => {});
  })();
});
