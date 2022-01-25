let openMenu = document.querySelector("#open-menu");
let closeMenu = document.querySelector("#close-menu");
let resourcesSubMenu = document.querySelector("#resources-sub-menu");
let topTreesSubMenu = document.querySelector("#top-trees-sub-menu");
let resourcesSubMenuButton = document.querySelector(
  "#resources-sub-menu-button"
);
let topTreesSubMenuButton = document.querySelector(
  "#top-trees-sub-menu-button"
);
let mainMenu = document.querySelector("#main-menu");
let backButton = document.querySelector("#back-button");

openMenu.addEventListener("click", () => {
  document.body.classList.add("main-menu-open");
});
closeMenu.addEventListener("click", () => {
  document.body.classList.remove("main-menu-open");
});

backButton.addEventListener("click", () => {
  backButton.style.setProperty("opacity", "0");
  backButton.style.setProperty("z-index", "0");

  resourcesSubMenu.classList.remove("menu-open");
  resourcesSubMenu.classList.add("menu-closed");
  topTreesSubMenu.classList.remove("menu-open");
  topTreesSubMenu.classList.add("menu-closed");
  mainMenu.classList.add("menu-open");
  mainMenu.classList.remove("menu-closed");

  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
});

resourcesSubMenuButton.addEventListener("click", () => {
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");

  resourcesSubMenu.classList.add("menu-open");
  resourcesSubMenu.classList.remove("menu-closed");
  topTreesSubMenu.classList.remove("menu-open");
  topTreesSubMenu.classList.add("menu-closed");
  mainMenu.classList.remove("menu-open");
  mainMenu.classList.add("menu-closed");

  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
});

topTreesSubMenuButton.addEventListener("click", () => {
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");

  resourcesSubMenu.classList.remove("menu-open");
  resourcesSubMenu.classList.add("menu-closed");
  topTreesSubMenu.classList.add("menu-open");
  topTreesSubMenu.classList.remove("menu-closed");
  mainMenu.classList.remove("menu-open");
  mainMenu.classList.add("menu-closed");

  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
});
