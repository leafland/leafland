let searchInput = document.querySelector("#search");
let searchResultsInner = document.querySelector("#search-results-inner");
let openSearch = document.querySelector("#open-search");
let closeSearch = document.querySelector("#close-search");
let searchLoadMoreButton = document.querySelector("#search-load-more");
let searchReturnToTopButton = document.querySelector("#search-return-to-top");
let searchResults = [];
let start = 0;
let end = 11;

function resetStartEnd() {
  start = 0;
  end = 11;
}

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
  if (end >= results.length - 1) {
    searchLoadMoreButton.disabled = true;
  } else {
    searchLoadMoreButton.disabled = false;
  }
  for (let i = start; i < end + 1; i++) {
    if (i > results.length - 1) {
      break;
    }

    let resultDiv = document.createElement("div");
    resultDiv.classList.add("search-result");

    let surfaceContent = document.createElement("div");
    surfaceContent.classList.add("surface-content");

    let titleDiv = document.createElement("div");
    titleDiv.classList.add("result-title");

    let resultTitle = document.createElement("p");
    resultTitle.classList.add("result-botanical-name");

    let resultSubtitle = document.createElement("p");
    resultSubtitle.classList.add("result-common-name");

    let resultLink = document.createElement("a");
    resultLink.href = `/trees/${results[i].url}/`;
    resultLink.classList.add("button");
    resultLink.textContent = "View Tree";

    if (results[i].cultivar !== "") {
      if (results[i].form !== "") {
        resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> f. <i>${results[i].form}</i> '${results[i].cultivar}'`;
      } else if (results[i].variety !== "") {
        resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> var. <i>${results[i].variety}</i> '${results[i].cultivar}'`;
      } else if (results[i].subspecies !== "") {
        resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> subsp. <i>${results[i].subspecies}</i> '${results[i].cultivar}'`;
      } else if (results[i].hybrid !== "") {
        if (results[i].hybrid.search(" x ") !== -1) {
          let text = results[i].hybrid.split(" x ");
          let newText = text.join("</i> x <i>");
          resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${newText}</i> '${results[i].cultivar}'`;
        } else {
          resultTitle.innerHTML = `<i>${results[i].genus}</i> x <i>${results[i].hybrid}</i> '${results[i].cultivar}'`;
        }
      } else {
        if (results[i].species !== "") {
          resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> '${results[i].cultivar}'`;
        } else {
          resultTitle.innerHTML = `<i>${results[i].genus}</i> '${results[i].cultivar}'`;
        }
      }
    } else if (results[i].form !== "") {
      resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> f. <i>${results[i].form}</i>`;
    } else if (results[i].variety !== "") {
      resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> var. <i>${results[i].variety}</i>`;
    } else if (results[i].subspecies !== "") {
      resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> subsp. <i>${results[i].subspecies}</i>`;
    } else if (results[i].hybrid !== "") {
      if (results[i].hybrid.search(" x ") !== -1) {
        let text = results[i].hybrid.split(" x ");
        let newText = text.join("</i> x <i>");
        resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${newText}</i>`;
      } else {
        resultTitle.innerHTML = `<i>${results[i].genus}</i> x <i>${results[i].hybrid}</i>`;
      }
    } else {
      resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i>`;
    }

    resultSubtitle.innerHTML = `${results[i].commonName}`;
    titleDiv.insertAdjacentElement("afterbegin", resultSubtitle);

    let imageDiv = document.createElement("div");

    let resultImage = document.createElement("img");
    resultImage.src = `https://leafland.co.nz/cdn-cgi/image/format=auto,quality=75,width=700/https://leafland.sgp1.cdn.digitaloceanspaces.com/images/trees/${results[i].mainImage}`;
    resultImage.width = "700";
    resultImage.height = "700";
    resultImage.loading = "lazy";
    resultImage.alt = `${results[i].url.replace(/-/g, " ")}`;

    titleDiv.insertAdjacentElement("afterbegin", resultTitle);

    imageDiv.insertAdjacentElement("afterbegin", resultImage);

    resultDiv.appendChild(imageDiv);

    surfaceContent.appendChild(titleDiv);

    surfaceContent.appendChild(resultLink);

    resultDiv.appendChild(surfaceContent);

    searchResultsInner.appendChild(resultDiv);
  }
}

let typingTimer;
let doneTypingInterval = 500;

(async function init() {
  searchInput.disabled = true;

  searchInput.disabled = false;

  searchInput.addEventListener("keyup", (event) => {
    clearTimeout(typingTimer);
    searchLoadMoreButton.style.setProperty("visibility", "hidden");
    searchReturnToTopButton.style.setProperty("visibility", "hidden");
    searchResultsInner.innerHTML = ``;
    document.body.classList.remove("search-loaded");

    typingTimer = setTimeout(() => {
      (async function () {
        await search(event.target.value);

        if (searchResults.length > 0) {
          searchLoadMoreButton.style.setProperty("visibility", "hidden");
          searchReturnToTopButton.style.setProperty("visibility", "hidden");
          searchResultsInner.innerHTML = ``;

          resetStartEnd();
          await displayResults(searchResults);
          searchLoadMoreButton.style.setProperty("visibility", "visible");
          searchReturnToTopButton.style.setProperty("visibility", "visible");
          document.body.classList.add("search-loaded");
        } else {
          searchLoadMoreButton.style.setProperty("visibility", "hidden");
          searchReturnToTopButton.style.setProperty("visibility", "hidden");
          searchResultsInner.innerHTML = ``;
          let emptyMessage = document.createElement("p");
          emptyMessage.textContent = "No results found.";
          emptyMessage.classList.add("empty-message");
          searchResultsInner.appendChild(emptyMessage);

          document.body.classList.add("search-loaded");
        }
      })();
    }, doneTypingInterval);
  });
})();

openSearch.addEventListener("click", () => {
  document.body.classList.add("search-open");
});

closeSearch.addEventListener("click", () => {
  document.body.classList.remove("search-open");
  document.body.classList.remove("search-loaded");
  searchInput.value = "";
});

searchLoadMoreButton.addEventListener("click", () => {
  start += 12;
  end += 12;
  displayResults(searchResults);
});

searchReturnToTopButton.addEventListener("click", () => {
  document.querySelector("#search-overlay").scroll({ top: 0, left: 0 });
});
