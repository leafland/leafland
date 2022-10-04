let searchInput = document.querySelector("#search");
let searchResultsInner = document.querySelector("#search-results-inner");
let searchResults = [];

async function search(terms) {
  searchResults = [];

  terms = terms.toLowerCase().split(" ");

  searchResults = treeData.filter((tree) => {
    let count = 0;
    let searchString =
      tree.genus +
      " " +
      tree.species +
      " " +
      tree.hybrid +
      " " +
      tree.subspecies +
      " " +
      tree.variety +
      " " +
      tree.form +
      " " +
      tree.cultivar +
      " " +
      tree.commonName +
      " " +
      tree.otherCommonNames +
      " " +
      tree.origin +
      " " +
      tree.uses +
      " " +
      tree.tolerates +
      " " +
      tree.soilType +
      " " +
      tree.sunShade +
      " " +
      tree.winterFoliage +
      " " +
      tree.types +
      " " +
      tree.stem.summer +
      " " +
      tree.stem.autumn +
      " " +
      tree.stem.winter +
      " " +
      tree.stem.spring +
      " " +
      tree.flowers.summer +
      " " +
      tree.flowers.autumn +
      " " +
      tree.flowers.winter +
      " " +
      tree.flowers.spring +
      " " +
      tree.foliage.summer +
      " " +
      tree.foliage.autumn +
      " " +
      tree.foliage.winter +
      " " +
      tree.foliage.spring +
      " " +
      tree.fruit.summer +
      " " +
      tree.fruit.autumn +
      " " +
      tree.fruit.winter +
      " " +
      tree.fruit.spring;

    for (let j = 0; j < tree.synonyms.length; j++) {
      searchString +=
        tree.synonyms[j].genus +
        " " +
        tree.synonyms[j].species +
        " " +
        tree.synonyms[j].hybrid +
        " " +
        tree.synonyms[j].subspecies +
        " " +
        tree.synonyms[j].variety +
        " " +
        tree.synonyms[j].form +
        " " +
        tree.synonyms[j].cultivar;
    }

    for (let i = 0; i < terms.length; i++) {
      if (
        searchString
          .replace(/ã/g, "a")
          .replace(/é/g, "e")
          .replace(/ā/g, "a")
          .replace(/ē/g, "e")
          .replace(/ī/g, "i")
          .replace(/ō/g, "o")
          .replace(/ū/g, "u")
          .replace(/ä/g, "a")
          .toLowerCase()
          .includes(terms[i])
      ) {
        count += 1;
      }
    }

    return count === terms.length;
  });
}

async function displayResults(results) {
  for (let i = 0; i < results.length; i++) {
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("result-title");

    let resultTitle = document.createElement("p");
    resultTitle.classList.add("result-botanical-name");

    let resultSubtitle = document.createElement("p");
    resultSubtitle.classList.add("result-common-name");

    let resultLink = document.createElement("a");
    resultLink.href = `/trees/${results[i].url}/`;
    resultLink.classList.add("search-result");

    resultTitle.innerHTML = `${results[i].fullName}`;

    resultSubtitle.innerHTML = `${results[i].commonName}`;

    titleDiv.insertAdjacentElement("afterbegin", resultSubtitle);

    let resultImage = document.createElement("img");
    resultImage.src = `https://leafland.co.nz/cdn-cgi/image/format=auto,metadata=none,quality=75,width=75/https://files.leafland.co.nz/${results[i].mainImage}`;
    resultImage.width = "50";
    resultImage.height = "50";
    resultImage.loading = "lazy";
    resultImage.alt = `${results[i].url.replace(/-/g, " ")}`;

    titleDiv.insertAdjacentElement("afterbegin", resultTitle);

    resultLink.appendChild(resultImage);

    resultLink.appendChild(titleDiv);

    searchResultsInner.appendChild(resultLink);
  }
}

let typingTimer;
let doneTypingInterval = 500;

(async function init() {
  searchInput.addEventListener("keyup", (event) => {
    document
      .querySelector("#search-results")
      .scroll({ top: 0, behavior: "auto" });
    document.body.classList.remove("search-loaded");
    searchResultsInner.innerHTML = ``;

    clearTimeout(typingTimer);
    if (event.target.value.length > 0) {
      typingTimer = setTimeout(() => {
        (async function () {
          await search(event.target.value);

          if (searchResults.length > 0) {
            searchResultsInner.innerHTML = ``;
            await displayResults(searchResults);
            document.body.classList.add("search-loaded");
          } else {
            searchResultsInner.innerHTML = ``;
            let emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No results found.";
            emptyMessage.classList.add("empty-message");
            searchResultsInner.appendChild(emptyMessage);

            document.body.classList.add("search-loaded");
          }
        })();
      }, doneTypingInterval);
    } else {
      document.body.classList.remove("search-loaded");
    }
  });
})();

searchInput.addEventListener("search", () => {
  document.body.classList.remove("search-loaded");
});
