let headerStockLink = document.querySelector("#header-stock-link");
let menuStockLink = document.querySelector("#menu-stock-link");
let loggedIn = false;

const orderSent = new Event("orderSent");

if (sessionStorage.getItem("submittedOrder") === "true") {
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

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

if (
  localStorage.getItem("loggedIn") === "false" ||
  localStorage.getItem("loggedIn") === null
) {
  loggedIn = false;
  localStorage.setItem("loggedIn", "false");

  headerStockLink.href = `/retail-stock-list/`;
  menuStockLink.href = `/retail-stock-list/`;
  document.body.classList.remove("loggedIn");

  document.querySelector("#login-form").style.setProperty("display", "block");
  document.querySelector("#login-message").style.setProperty("display", "none");
  document.querySelector("#log-out").style.setProperty("display", "none");
} else {
  loggedIn = true;
  localStorage.setItem("loggedIn", "true");

  headerStockLink.href = `/wholesale-stock-list/`;
  menuStockLink.href = `/wholesale-stock-list/`;
  document.body.classList.add("loggedIn");

  document.querySelector("#login-form").style.setProperty("display", "none");
  document
    .querySelector("#login-message")
    .style.setProperty("display", "block");
  document.querySelector("#log-out").style.setProperty("display", "block");
}

document
  .querySelector("#subscribe-form")
  .addEventListener("submit", (event) => {
    document.querySelector("#subscribe").value = "Subscribing...";
  });
