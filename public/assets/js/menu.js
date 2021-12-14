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
  // document.querySelector("#main-menu-items").style.setProperty("opacity", "1");
  // document.querySelectorAll(".menu-unloaded").forEach((menuItem) => {
  //   menuItem.classList.add("menu-loaded");
  // });
});
closeMenu.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  // document.querySelectorAll(".menu-unloaded").forEach((menuItem) => {
  //   menuItem.classList.remove("menu-loaded");
  // });
});

backButton.addEventListener("click", () => {
  resourcesSubMenu.style.setProperty("opacity", "0");
  resourcesSubMenu.style.setProperty("z-index", "0");
  // resourcesSubMenu.style.setProperty("visibility", "hidden");
  // resourcesSubMenu.style.setProperty("position", "absolute");
  topTreesSubMenu.style.setProperty("opacity", "0");
  topTreesSubMenu.style.setProperty("z-index", "0");

  // topTreesSubMenu.style.setProperty("visibility", "hidden");
  // topTreesSubMenu.style.setProperty("position", "absolute");
  // mainMenu.style.setProperty("visibility", "visible");
  // mainMenu.style.setProperty("position", "relative");
  mainMenu.style.setProperty("opacity", "1");
  mainMenu.style.setProperty("z-index", "9");
  topTreesSubMenu.style.setProperty(
    "grid-template-columns",
    "repeat(auto-fit, minmax(0px, 50px))"
  );
  backButton.style.setProperty("opacity", "0");
  backButton.style.setProperty("z-index", "0");

  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
});

resourcesSubMenuButton.addEventListener("click", () => {
  mainMenu.style.setProperty("opacity", "0");
  mainMenu.style.setProperty("z-index", "0");
  topTreesSubMenu.style.setProperty(
    "grid-template-columns",
    "repeat(auto-fit, minmax(0px, 50px))"
  );
  // mainMenu.style.setProperty("visibility", "hidden");
  // mainMenu.style.setProperty("position", "absolute");
  // resourcesSubMenu.style.setProperty("visibility", "visible");
  // resourcesSubMenu.style.setProperty("position", "relative");
  resourcesSubMenu.style.setProperty("opacity", "1");
  resourcesSubMenu.style.setProperty("z-index", "9");
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");

  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
});

topTreesSubMenuButton.addEventListener("click", () => {
  mainMenu.style.setProperty("opacity", "0");
  mainMenu.style.setProperty("z-index", "0");
  topTreesSubMenu.style.setProperty(
    "grid-template-columns",
    "repeat(auto-fit, minmax(200px, 500px))"
  );
  // mainMenu.style.setProperty("visibility", "hidden");
  // mainMenu.style.setProperty("position", "absolute");
  // topTreesSubMenu.style.setProperty("visibility", "visible");
  // topTreesSubMenu.style.setProperty("position", "relative");
  topTreesSubMenu.style.setProperty("opacity", "1");
  topTreesSubMenu.style.setProperty("z-index", "9");
  backButton.style.setProperty("opacity", "1");
  backButton.style.setProperty("z-index", "9");
  document.querySelector("#main-menu-overlay").scroll({
    top: 0,
    left: 0,
  });
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
