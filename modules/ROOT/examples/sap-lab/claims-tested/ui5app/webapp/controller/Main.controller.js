sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";
  return Controller.extend("guide.claims.controller.Main", {
    onInit: function () {
      this.getView().setModel(new JSONModel({
        claims: [
          { title: "Train ticket", amount: 45.5 },
          { title: "Hotel", amount: 120 }
        ]
      }));
    },
    total: function (aAmounts) {
      return aAmounts.reduce(function (sum, n) { return sum + n; }, 0);
    },
    onTotal: function () {
      var aClaims = this.getView().getModel().getProperty("/claims");
      var fTotal = this.total(aClaims.map(function (o) { return o.amount; }));
      this.byId("total").setText("Total: " + fTotal.toFixed(2) + " EUR");
    }
  });
});
