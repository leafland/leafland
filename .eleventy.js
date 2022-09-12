module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "liquid",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2",
  ]);

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("_headers");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "build",
    },
  };
};
