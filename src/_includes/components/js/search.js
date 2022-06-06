let searchInput = document.querySelector("#search");
// let searchResults = document.querySelector("#search-results");
let searchResultsInner = document.querySelector("#search-results-inner");
let openSearch = document.querySelector("#open-search");
let closeSearch = document.querySelector("#close-search");
let searchLoadMoreButton = document.querySelector("#search-load-more");
let searchReturnToTopButton = document.querySelector("#search-return-to-top");
let searchData = [];
let searchResults = [];
let start = 0;
let end = 11;

function resetStartEnd() {
  start = 0;
  end = 11;
}

async function getSearchData() {
  searchData = await fetch(`/public/trees.json`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
}

async function search(terms) {
  terms = terms.split(" ");

  for (let i = 0; i < terms.length; i++) {
    if (terms[i] === "" || terms[i].length === 0) {
      terms.splice(i, 1);
      i--;
    }
  }

  if (terms.length > 0) {
    searchResults = [];
    let usesValue = "";
    let toleratesValue = "";
    let typesValue = "";
    let compareValue = "";
    for (let i = 0; i < searchData.length; i++) {
      usesValue = "";
      toleratesValue = "";
      typesValue = "";
      compareValue = "";
      if (searchData[i].uses.search("hedging-screening") !== -1) {
        usesValue = `${usesValue} hedging hedge hedges hedged `;
      }
      if (searchData[i].uses.search("birds-bees") !== -1) {
        usesValue = `${usesValue} bird birds bees bee `;
      }
      if (searchData[i].uses.search("driveways-avenues") !== -1) {
        usesValue = `${usesValue} driveway driveways avenue avenues `;
      }
      if (searchData[i].uses.search("paddocks-shade") !== -1) {
        usesValue = `${usesValue} paddocks paddock field farm shade shading `;
      }
      if (searchData[i].uses.search("pleaching") !== -1) {
        usesValue = `${usesValue} pleaching pleached pleach `;
      }
      if (searchData[i].uses.search("small-garden") !== -1) {
        usesValue = `${usesValue} small `;
      }
      if (searchData[i].uses.search("street") !== -1) {
        usesValue = `${usesValue} street `;
      }
      if (searchData[i].uses.search("topiary") !== -1) {
        usesValue = `${usesValue} topiary topiaried ball `;
      }
      if (searchData[i].uses.search("narrow-spaces") !== -1) {
        usesValue = `${usesValue} narrow restricted thin `;
      }
      if (searchData[i].uses.search("attracts-birds") !== -1) {
        usesValue = `${usesValue} attracts birds bird `;
      }
      if (searchData[i].uses.search("attracts-bees") !== -1) {
        usesValue = `${usesValue} attracts bees bee `;
      }

      if (searchData[i].tolerates.search("dry") !== -1) {
        toleratesValue = `${toleratesValue} dry hot drought `;
      }
      if (searchData[i].tolerates.search("coastal") !== -1) {
        toleratesValue = `${toleratesValue} coastal coast beach sea seaside `;
      }
      if (searchData[i].tolerates.search("wet") !== -1) {
        toleratesValue = `${toleratesValue} wet damp moist sodden flood `;
      }
      if (searchData[i].tolerates.search("windy") !== -1) {
        toleratesValue = `${toleratesValue} windy wind gale exposed `;
      }
      if (searchData[i].tolerates.search("clay") !== -1) {
        toleratesValue = `${toleratesValue} clay heavy `;
      }

      if (searchData[i].types.search("conifer") !== -1) {
        typesValue = `${typesValue} conifer coniferous `;
      }
      if (searchData[i].types.search("edible") !== -1) {
        typesValue = `${typesValue} edible fruit nut `;
      }
      if (searchData[i].types.search("weeping") !== -1) {
        typesValue = `${typesValue} weeping pendula pendulum drooping `;
      }

      for (let j = 0; j < searchData[i].synonyms.length; j++) {
        compareValue += `${searchData[i].synonyms[j].genus} ${searchData[i].synonyms[j].species} ${searchData[i].synonyms[j].hybrid} ${searchData[i].synonyms[j].subspecies} ${searchData[i].synonyms[j].variety} ${searchData[i].synonyms[j].form} ${searchData[i].synonyms[j].cultivar}`
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/,/g, " ")
          .replace(/-/g, " ")
          .replace(/-x-/g, " ")
          // .replace(/\s/g, "")
          .replace(/ã/g, "a")
          .replace(/é/g, "e")
          .replace(/ā/g, "a")
          .replace(/ē/g, "e")
          .replace(/ī/g, "i")
          .replace(/ō/g, "o")
          .replace(/ū/g, "u")
          .toLowerCase();
      }

      compareValue +=
        `${searchData[i].genus} ${searchData[i].species} ${searchData[i].hybrid} ${searchData[i].subspecies} ${searchData[i].variety} ${searchData[i].form} ${searchData[i].cultivar} ${searchData[i].commonName} ${searchData[i].winterFoliage} ${searchData[i].origin} ${searchData[i].soilType} ${searchData[i].uses} ${searchData[i].sunShade} ${searchData[i].tolerates} ${searchData[i].types} ${searchData[i].stem.summer} ${searchData[i].stem.autumn} ${searchData[i].stem.winter} ${searchData[i].stem.spring} ${searchData[i].flowers.summer} ${searchData[i].flowers.autumn} ${searchData[i].flowers.winter} ${searchData[i].flowers.spring} ${searchData[i].foliage.summer} ${searchData[i].foliage.autumn} ${searchData[i].foliage.winter} ${searchData[i].foliage.spring} ${searchData[i].fruit.summer} ${searchData[i].fruit.autumn} ${searchData[i].fruit.winter} ${searchData[i].fruit.spring} ${typesValue} ${usesValue} ${toleratesValue}`
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/,/g, " ")
          .replace(/-/g, " ")
          .replace(/-x-/g, " ")
          // .replace(/\s/g, "")
          .replace(/ã/g, "a")
          .replace(/é/g, "e")
          .replace(/ā/g, "a")
          .replace(/ē/g, "e")
          .replace(/ī/g, "i")
          .replace(/ō/g, "o")
          .replace(/ū/g, "u")
          .toLowerCase();

      for (let j = 0; j < terms.length; j++) {
        if (
          compareValue.search(
            terms[j]
              .replace(/'/g, "")
              .replace(/"/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "")
              .replace(/,/g, " ")
              .replace(/-/g, " ")
              .replace(/-x-/g, " ")
              // .replace(/\s/g, "")
              .replace(/ã/g, "a")
              .replace(/é/g, "e")
              .replace(/ā/g, "a")
              .replace(/ē/g, "e")
              .replace(/ī/g, "i")
              .replace(/ō/g, "o")
              .replace(/ū/g, "u")
              .toLowerCase()
          ) !== -1
        ) {
          add = true;
        } else {
          add = false;
          break;
        }
      }

      if (add) {
        searchResults.push(searchData[i]);
      }
    }
  } else {
    searchResults = [];
  }
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

        if(results[i].hybrid.search(' x ') !== -1){
          resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].hybrid}</i> '${results[i].cultivar}'`;
        }
        else{
          resultTitle.innerHTML = `<i>${results[i].genus}</i> x <i>${results[i].hybrid}</i> '${results[i].cultivar}'`;
        }
      } else {

        if(results[i].species !== ""){
          resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i> '${results[i].cultivar}'`;
        }
        else{
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
      if(results[i].hybrid.search(' x ') !== -1){
        resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].hybrid}</i>`;
      }
      else{
        resultTitle.innerHTML = `<i>${results[i].genus}</i> x <i>${results[i].hybrid}</i>`;
      }
    } else {
      resultTitle.innerHTML = `<i>${results[i].genus}</i> <i>${results[i].species}</i>`;
    }

    resultSubtitle.innerHTML = `<span class="accent-color">${results[i].commonName}</span>`;
    titleDiv.insertAdjacentElement("afterbegin", resultSubtitle);

    let imageDiv = document.createElement("div");

    let resultImage = document.createElement("img");
    resultImage.src = `https://leafland.imgix.net/images/trees/${results[i].mainImage}?auto=format&w=500&q=74`;
    resultImage.width = "500";
    resultImage.height = "500";
    resultImage.loading = "lazy";
    resultImage.alt = `${results[i].url.replace(/-/g, " ")}`;

    titleDiv.insertAdjacentElement("afterbegin", resultTitle);

    imageDiv.insertAdjacentElement("afterbegin", resultImage);

    resultDiv.appendChild(imageDiv);

    surfaceContent.appendChild(titleDiv);

    surfaceContent.appendChild(resultLink);

    resultDiv.appendChild(surfaceContent);

    resultDiv.style.setProperty("--animation-order", `${i % 12}`);
    resultDiv.classList.add("search-result-loaded");
    searchResultsInner.appendChild(resultDiv);
  }
}

let typingTimer;
let doneTypingInterval = 500;

(async function init() {
  searchInput.disabled = true;
  await getSearchData();

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
          emptyMessage.textContent = "No results.";
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
