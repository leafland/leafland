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
// let resourcesBackButton = document.querySelector("#resources-back-button");
// let topTreesBackButton = document.querySelector("#top-trees-back-button");

openMenu.addEventListener("click", () => {
  document.body.classList.add("menu-open");
});
closeMenu.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
});

backButton.addEventListener("click", () => {
  resourcesSubMenu.style.setProperty("opacity", "0");
  resourcesSubMenu.style.setProperty("z-index", "0");
  resourcesSubMenu.style.setProperty("display", "none");
  topTreesSubMenu.style.setProperty("opacity", "0");
  topTreesSubMenu.style.setProperty("z-index", "0");
  topTreesSubMenu.style.setProperty("display", "none");
  mainMenu.style.setProperty("display", "grid");
  mainMenu.style.setProperty("opacity", "1");
  mainMenu.style.setProperty("z-index", "9");
  backButton.style.setProperty("opacity", "0");
  backButton.style.setProperty("z-index", "0");
});

resourcesSubMenuButton.addEventListener("click", () => {
  mainMenu.style.setProperty("opacity", "0");
  mainMenu.style.setProperty("z-index", "0");
  mainMenu.style.setProperty("display", "none");
  resourcesSubMenu.style.setProperty("display", "grid");
  resourcesSubMenu.style.setProperty("opacity", "1");
  resourcesSubMenu.style.setProperty("z-index", "9");
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");
});

topTreesSubMenuButton.addEventListener("click", () => {
  mainMenu.style.setProperty("opacity", "0");
  mainMenu.style.setProperty("z-index", "0");
  mainMenu.style.setProperty("display", "none");
  topTreesSubMenu.style.setProperty("display", "grid");
  topTreesSubMenu.style.setProperty("opacity", "1");
  topTreesSubMenu.style.setProperty("z-index", "9");
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");
});

// resourcesBackButton.addEventListener("click", () => {
//   resourcesSubMenu.style.setProperty("opacity", "0");
//   resourcesSubMenu.style.setProperty("z-index", "0");
//   mainMenu.style.setProperty("opacity", "1");
//   mainMenu.style.setProperty("z-index", "9");
// });

// topTreesBackButton.addEventListener("click", () => {
//   topTreesSubMenu.style.setProperty("opacity", "0");
//   topTreesSubMenu.style.setProperty("z-index", "0");
//   mainMenu.style.setProperty("opacity", "1");
//   mainMenu.style.setProperty("z-index", "9");
// });
