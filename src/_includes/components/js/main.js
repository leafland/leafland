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

document.querySelector("#subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#subscribe").value = "Subscribing...";

  const subscribeExternalBody = JSON.stringify({
    fromAddress: "administrator@leafland.co.nz",
    fromName: "Admin | Leafland",
    toAddress: "joshua@leafland.co.nz",
    replyToAddress: "administrator@leafland.co.nz",
    replyToName: "Admin | Leafland",
    subject: "New Subscriber",
    html: `<!DOCTYPE html><html><head><body>Name: ${event.target.firstName.value}, Email: ${event.target.email.value}</body></html>`,
    isOpenTracked: false,
  });

  const subscribeExternalRequestOptions = {
    method: "POST",
    mode: "no-cors",
    body: subscribeExternalBody,
  };

  (async function () {
    await fetch("https://subscribe.leafland.co.nz", subscribeExternalRequestOptions)
      .then((response) => {
        document.querySelector("#email-signup").innerHTML = `<p>Thanks for subscribing!</p>`;
      })
      .catch((error) => {});
  })();
});
