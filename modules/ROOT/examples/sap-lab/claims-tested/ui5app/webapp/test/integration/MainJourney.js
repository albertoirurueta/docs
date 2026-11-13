sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, opaTest, Press, PropertyStrictEquals) {
  "use strict";
  Opa5.extendConfig({ autoWait: true });
  QUnit.module("Main page");
  opaTest("shows the total after Total is pressed", function (Given, When, Then) {
    Given.iStartMyUIComponent({ componentConfig: { name: "guide.claims" } });
    When.waitFor({
      id: "totalButton",
      viewName: "guide.claims.view.Main",
      actions: new Press(),
      errorMessage: "The Total button was not found"
    });
    Then.waitFor({
      id: "total",
      viewName: "guide.claims.view.Main",
      matchers: new PropertyStrictEquals({
        name: "text", value: "Total: 165.50 EUR"
      }),
      success: function () { Opa5.assert.ok(true, "The total is shown"); },
      errorMessage: "The total was not shown"
    });
    Then.iTeardownMyApp();
  });
});
