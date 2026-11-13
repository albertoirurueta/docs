sap.ui.define(["guide/claims/controller/Main.controller"], function (Main) {
  "use strict";
  QUnit.module("Main controller");
  QUnit.test("adds amounts", function (assert) {
    assert.strictEqual(Main.prototype.total([45.5, 120]), 165.5);
  });
  QUnit.test("an empty list has the total 0", function (assert) {
    assert.strictEqual(Main.prototype.total([]), 0);
  });
});
