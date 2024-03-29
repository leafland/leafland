let searchInput = document.querySelector("#search");
let searchResultsInner = document.querySelector("#search-results-inner");
let searchResults = [];

async function search(terms) {
  searchResults = [];

  searchResults = treeData.filter((tree) => {
    let count = 0;

    if (
      tree.fullName
        .toLowerCase()
        .replaceAll("ã", "a")
        .replaceAll("ā", "a")
        .replaceAll("ä", "a")
        .replaceAll("é", "e")
        .replaceAll("ê", "e")
        .replaceAll("ē", "e")
        .replaceAll("è", "e")
        .replaceAll("ī", "i")
        .replaceAll("ō", "o")
        .replaceAll("ū", "u")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .replaceAll("<i>", "")
        .replaceAll("</i>", "")
        .includes(terms.replaceAll("'", "").replaceAll('"', "").toLowerCase()) ||
      tree.commonName
        .toLowerCase()
        .replaceAll("ã", "a")
        .replaceAll("ā", "a")
        .replaceAll("ä", "a")
        .replaceAll("é", "e")
        .replaceAll("ê", "e")
        .replaceAll("ē", "e")
        .replaceAll("è", "e")
        .replaceAll("ī", "i")
        .replaceAll("ō", "o")
        .replaceAll("ū", "u")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .includes(terms.replaceAll("'", "").replaceAll('"', "").toLowerCase()) ||
      tree.otherCommonNames
        .toLowerCase()
        .replaceAll("ã", "a")
        .replaceAll("ā", "a")
        .replaceAll("ä", "a")
        .replaceAll("é", "e")
        .replaceAll("ê", "e")
        .replaceAll("ē", "e")
        .replaceAll("è", "e")
        .replaceAll("ī", "i")
        .replaceAll("ō", "o")
        .replaceAll("ū", "u")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .includes(terms.replaceAll("'", "").replaceAll('"', "").toLowerCase()) ||
      tree.synonyms
        .toLowerCase()
        .replaceAll("ã", "a")
        .replaceAll("ā", "a")
        .replaceAll("ä", "a")
        .replaceAll("é", "e")
        .replaceAll("ê", "e")
        .replaceAll("ē", "e")
        .replaceAll("è", "e")
        .replaceAll("ī", "i")
        .replaceAll("ō", "o")
        .replaceAll("ū", "u")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .includes(terms.replaceAll("'", "").replaceAll('"', "").toLowerCase())
    ) {
      count += 1;
    }

    return count > 0;
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
    resultImage.src = `https://files.leafland.co.nz/tr:w-75/${results[i].url}/${results[i].url}${results[i].images[0]}.jpg`;
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
    document.querySelector("#search-results").scroll({ top: 0, behavior: "auto" });
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
