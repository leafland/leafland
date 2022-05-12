let headerStockLink = document.querySelector("#header-stock-link");
let menuStockLink = document.querySelector("#menu-stock-link");
let loggedIn = false;

if (localStorage.getItem("trees") === null) {
  localStorage.setItem("trees", "[]");
}

window.addEventListener("loginUpdated", () => {
  if (
    localStorage.getItem("loggedIn") === "false" ||
    localStorage.getItem("loggedIn") === null
  ) {
    loggedIn = false;
    localStorage.setItem("loggedIn", "false");
  } else {
    loggedIn = true;
    localStorage.setItem("loggedIn", "true");
  }

  if (loggedIn) {
    headerStockLink.href = `/wholesale-stock-list/`;

    menuStockLink.href = `/wholesale-stock-list/`;

    document.body.classList.add("loggedIn");
  } else {
    headerStockLink.href = `/retail-stock-list/`;

    menuStockLink.href = `/retail-stock-list/`;
    document.body.classList.remove("loggedIn");
  }
});

window.addEventListener("storage", () => {
  if (localStorage.getItem("loggedIn") === "true") {
    loggedIn = true;
  } else {
    loggedIn = false;
  }

  if (loggedIn) {
    headerStockLink.href = `/wholesale-stock-list/`;

    menuStockLink.href = `/wholesale-stock-list/`;
    document.body.classList.add("loggedIn");
  } else {
    headerStockLink.href = `/retail-stock-list/`;

    menuStockLink.href = `/retail-stock-list/`;
    document.body.classList.remove("loggedIn");
  }
});

// document
//   .querySelector("#subscribe-form")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();

//     document.querySelector("#subscribe").textContent = "Subscribing...";
//     document
//       .querySelector("#subscribe")
//       .style.setProperty("background", "var(--primary-text)");
//     document
//       .querySelector("#subscribe")
//       .style.setProperty("color", "var(--secondary-background)");

//     document.querySelector("#subscribe").style.setProperty("cursor", "default");

//     const { subscriberFirstName, subscriberLastName, subscriberEmail } =
//       event.target;

//     const endpoint = "https://api.leafland.co.nz/default/add-new-subscriber";

//     const body = JSON.stringify({
//       subscriberFirstName: subscriberFirstName.value,
//       subscriberLastName: subscriberLastName.value,
//       subscriberEmail: subscriberEmail.value,
//     });
//     const requestOptions = {
//       method: "POST",
//       body,
//     };

//     (async function () {
//       await fetch(endpoint, requestOptions)
//         .then((response) => response.json())
//         .then((data) => data)
//         .catch((error) => {});

//       document
//         .querySelector("#email-signup")
//         .style.setProperty("grid-template-columns", "1fr");

//       document.querySelector(
//         "#email-signup"
//       ).innerHTML = `<p class="paragraph-title">Thanks for subscribing!</p>`;
//     })();
//   });
