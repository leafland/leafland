// let stockLinks = document.querySelectorAll(".stock-link");
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
    // for (let i = 0; i < stockLinks.length; i++) {
    //   stockLinks[
    //     i
    //   ].innerHTML = `<a href="/wholesale-stock-list/" class="button">Wholesale Stock List</a>`;
    // }
    document.body.classList.add("loggedIn");
  } else {
    // for (let i = 0; i < stockLinks.length; i++) {
    //   stockLinks[i].innerHTML =
    //     '<a href="/retail-stock-list/" class="button">Retail Stock List</a>';
    // }
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
    // for (let i = 0; i < stockLinks.length; i++) {
    //   stockLinks[
    //     i
    //   ].innerHTML = `<a href="/wholesale-stock-list/" class="button">Wholesale Stock List</a>`;
    // }
    document.body.classList.add("loggedIn");
  } else {
    // for (let i = 0; i < stockLinks.length; i++) {
    //   stockLinks[i].innerHTML =
    //     '<a href="/retail-stock-list/" class="button">Retail Stock List</a>';
    // }
    document.body.classList.remove("loggedIn");
  }
});

document
  .querySelector("#subscribe-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const { subscriberFirstName, subscriberLastName, subscriberEmail } =
      event.target;

    const endpoint = "https://api.leafland.co.nz/default/add-new-subscriber";

    const body = JSON.stringify({
      subscriberFirstName: subscriberFirstName.value,
      subscriberLastName: subscriberLastName.value,
      subscriberEmail: subscriberEmail.value,
    });
    const requestOptions = {
      method: "POST",
      body,
    };

    (async function () {
      await fetch(endpoint, requestOptions)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {});
    })();
  });
