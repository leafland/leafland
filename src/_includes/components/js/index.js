let image1 = document.querySelector("#image-1");
let image2 = document.querySelector("#image-2");
let image3 = document.querySelector("#image-3");

rotateImages();

function rotateImages() {
  let counter = 0;

  setInterval(() => {
    switch (counter) {
      case 0:
        image1.style.setProperty("opacity", "0");

        image2.style.setProperty("opacity", "1");
        counter++;
        break;

      case 1:
        image2.style.setProperty("opacity", "0");

        image3.style.setProperty("opacity", "1");
        counter++;
        break;

      case 2:
        image3.style.setProperty("opacity", "0");

        image1.style.setProperty("opacity", "1");

        counter = 0;

        break;
      default:
        counter = 0;
        break;
    }
  }, 7000);
}

var sections = document.querySelectorAll(".split-section");

const callback = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty(
        "animation",
        "fadeInUp 1s forwards cubic-bezier(0.31,0.87,0.32,1)"
      );
    }
  });
};

let options = {
  threshold: 0.75,
};

const sectionObserver = new IntersectionObserver(callback, options);

let heroText = document.querySelector("#hero-text");
let linkBlock = document.querySelector("#link-block");

const heroTextObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty(
          "animation",
          "fadeInUp 1s 500ms forwards cubic-bezier(0.31,0.87,0.32,1)"
        );
      }
    });
  },
  { threshold: 0.25 }
);

const linkBlockObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty(
          "animation",
          "fadeInUp 1s 500ms forwards cubic-bezier(0.31,0.87,0.32,1)"
        );
      }
    });
  },
  { threshold: 0.25 }
);

window.addEventListener("load", () => {
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  heroTextObserver.observe(heroText);
  linkBlockObserver.observe(linkBlock);
});
