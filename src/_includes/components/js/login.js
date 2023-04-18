let loginForm = document.querySelector("#login-form");
let returnMessage = document.querySelector("#return-message");
let logOutButton = document.querySelector("#log-out");
let login = false;
let openLogin = document.querySelector("#open-login");
let closeLogin = document.querySelector("#close-login");
let emails = [];

async function logIn(event) {
  document.querySelector("#log-in").value = "Logging in...";

  emails = await fetch(`/public/emails.json`)
    .then((response) => response.json())
    .catch((error) => {});

  let emailString = emails.join(" ,").toLowerCase();

  if (emailString.includes(event.target[0].value.toLowerCase())) {
    login = true;
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  (async function () {
    await logIn(event);
    if (!login || login === undefined) {
      returnMessage.textContent = "Invalid email address. Please try again.";
      document.querySelector("#log-in").value = "Log in";
      document.querySelector("#log-in").disabled = false;
      sessionStorage.setItem("loggedIn", "false");
    } else {
      document.querySelector("#log-in").value = "Log in";
      document.querySelector("#log-in").disabled = true;
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("loginEmail", `${event.target[0].value.toLowerCase()}`);
      if (window.location.pathname === "/retail-stock-list/") {
        window.location.pathname = "/wholesale-stock-list/";
      } else {
        window.location.reload();
      }
    }
  })();
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
  sessionStorage.setItem("loggedIn", "false");
  if (window.location.pathname === "/wholesale-stock-list/") {
    window.location.pathname = "/retail-stock-list/";
  } else {
    window.location.reload();
  }
});
