module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", function (date, dateFormat) {
    return format(date, dateFormat);
  });

  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
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

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "build",
    },
  };
};
