let treeWrapper = document.querySelector("#tree-wrapper");
let topTreesData = [];
let topTreesImages = [];

async function getTopTreesData() {
  topTreesData = await fetch(
    `https://api.leafland.co.nz/default/get-product-data?type=top-trees&topTrees=${document.body.dataset["id"]}`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function getTopTreesImages() {
  topTreesImages = await fetch(
    `https://api.leafland.co.nz/default/get-image-data`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

(async function init() {
  await getTopTreesData();
  await getTopTreesImages();
  await populatePage(topTreesData);
})();

async function populatePage(trees) {
  treeWrapper.innerHTML = "";

  for (let i = 0; i < trees.length; i++) {
    if (!(trees[i] === undefined || trees[i] === null)) {
      let treeItem = document.createElement("div");
      treeItem.classList.add("tree-item");

      let treeUrl = document.createElement("a");
      treeUrl.href = `/trees/${trees[i].url}/`;
      treeUrl.textContent = "View Tree";
      treeUrl.classList.add("tree-link");
      treeUrl.classList.add("button");

      let treeTitle = document.createElement("h2");
      let treeSubtitle = document.createElement("h3");

      let container = document.createElement("div");
      container.classList.add("title-link-box");

      let titleContainer = document.createElement("div");
      titleContainer.classList.add("title-container");

      treeTitle.textContent = trees[i].botanicalName;

      if (!(trees[i].commonName === "")) {
        treeSubtitle.textContent = `${trees[i].commonName}`;
        titleContainer.appendChild(treeTitle);
        titleContainer.appendChild(treeSubtitle);
      } else {
        titleContainer.appendChild(treeTitle);
      }

      container.appendChild(titleContainer);
      container.appendChild(treeUrl);

      let imageDiv = document.createElement("div");
      imageDiv.classList.add("tree-image");

      if (topTreesImages.length > 0) {
        let imageDataSubset = [];

        for (let j = 0; j < topTreesImages.length; j++) {
          if (
            topTreesImages[j].split("/", 4)[3] === `${trees[i].url}.jpg` ||
            topTreesImages[j].split("/", 4)[3] === `${trees[i].url}.jpeg`
          ) {
            imageDataSubset.push(topTreesImages[j]);
          }
        }

        if (imageDataSubset.length > 0) {
          let treeImage = document.createElement("img");

          treeImage.src = `https://images.leafland.co.nz/${
            imageDataSubset[imageDataSubset.length - 1]
          }?tr=w-500,q-75,pr-true,f-auto`;
          treeImage.width = "500";
          treeImage.height = "500";
          treeImage.alt = imageDataSubset[imageDataSubset.length - 1]
            .substring(
              imageDataSubset[imageDataSubset.length - 1].lastIndexOf("/") + 1,
              imageDataSubset[imageDataSubset.length - 1].lastIndexOf(".")
            )
            .replace(/-/g, " ");
          treeImage.loading = "lazy";

          imageDiv.appendChild(treeImage);
          treeItem.appendChild(imageDiv);
        }
      }

      treeItem.appendChild(container);
      treeItem.style.setProperty("--animation-order", `${i % 12}`);
      treeItem.classList.add("tree-item-loaded");
      treeWrapper.appendChild(treeItem);
    }
  }
}
