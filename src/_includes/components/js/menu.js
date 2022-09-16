let openMenu = document.querySelector("#open-menu");
let closeMenu = document.querySelector("#close-menu");

let mainMenu = document.querySelector("#main-menu");

openMenu.addEventListener("click", () => {
  document.body.classList.add("main-menu-open");
});
closeMenu.addEventListener("click", () => {
  document.body.classList.remove("main-menu-open");
});
