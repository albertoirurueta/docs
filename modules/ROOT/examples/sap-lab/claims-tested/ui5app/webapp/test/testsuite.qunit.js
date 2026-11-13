sap.ui.define(function () {
  "use strict";
  return {
    name: "QUnit test suite for guide.claims",
    defaults: {
      page: "ui5://test-resources/guide/claims/Test.qunit.html"
        + "?testsuite={suite}&test={name}",
      qunit: { version: 2 },
      loader: { paths: { "guide/claims": "../", "test": "./" } }
    },
    tests: {
      "unit/Main": { title: "Unit test of the Main controller" },
      "integration/opaTests": { title: "OPA5 journey of the Main page" }
    }
  };
});
