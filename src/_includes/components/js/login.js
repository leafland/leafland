let loginForm = document.querySelector("#login-form");
let returnMessage = document.querySelector("#return-message");
let logOutButton = document.querySelector("#log-out");
let login = "";
let openLogin = document.querySelector("#open-login");
let closeLogin = document.querySelector("#close-login");

async function logIn(event) {
  document.querySelector("#log-in").value = "Logging in...";

  login = await fetch(
    `https://api.leafland.co.nz/default/supabase-login?email=${event.target[0].value.toLowerCase()}`
  )
    .then((response) => response.text())
    .catch((error) => {});
}

async function checkToken(queryString) {
  login = await fetch(
    `https://api.leafland.co.nz/default/check-token${queryString}`
  )
    .then((response) => response.text())
    .catch((error) => {});
}

async function sendLoginLink(event) {
  const endpoint = "https://api.leafland.co.nz/default/send-login-link";

  const body = JSON.stringify({
    email: event.target[0].value,
    loginPage: window.location.href,
  });
  const requestOptions = {
    method: "POST",
    body,
  };

  fetch(endpoint, requestOptions)
    .then((response) => {})
    .catch((error) => {});
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("loginPage", `${window.location.href}`);

  (async function () {
    await logIn(event);
    if (login === "false") {
      returnMessage.textContent = "Invalid email address. Please try again.";
      document.querySelector("#log-in").value = "Log in";
      document.querySelector("#log-in").disabled = false;
      localStorage.setItem("loggedIn", "false");
    } else {
      await sendLoginLink(event);
      returnMessage.textContent = "Check your inbox for the login link.";
      document.querySelector("#log-in").value = "Log in";
      document.querySelector("#log-in").disabled = true;
    }
  })();
});

window.addEventListener("DOMContentLoaded", () => {
  let loginUpdated = new Event("loginUpdated");

  let queryString = window.location.search;
  if (queryString.length > 0) {
    (async function () {
      await checkToken(queryString);

      if (login === "true") {
        localStorage.setItem("loggedIn", "true");

        if (localStorage.getItem("reloaded") === null) {
          // window.location.replace(`${localStorage.getItem("loginPage")}`);
          window.history.replaceState(null, null, window.location.pathname);
          localStorage.setItem("reloaded", "true");
        } else if (localStorage.getItem("reloaded") === "false") {
          // window.location.replace(`${localStorage.getItem("loginPage")}`);
          window.history.replaceState(null, null, window.location.pathname);
          localStorage.setItem("reloaded", "true");
        }
      } else {
        localStorage.setItem("loggedIn", "false");
        localStorage.setItem("reloaded", "false");
      }

      window.dispatchEvent(loginUpdated);
    })();
  } else {
    window.dispatchEvent(loginUpdated);
  }
});

openLogin.addEventListener("click", () => {
  document.querySelector("#log-in").disabled = false;
  returnMessage.textContent = "";
  document.body.classList.add("login-open");
});

closeLogin.addEventListener("click", () => {
  document.body.classList.remove("login-open");
});

logOutButton.addEventListener("click", () => {
  localStorage.setItem("loggedIn", "false");
  localStorage.setItem("reloaded", "false");
  window.location.reload();
});
