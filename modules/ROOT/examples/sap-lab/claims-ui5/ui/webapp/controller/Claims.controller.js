sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], (Controller, Filter, FilterOperator) => {
  "use strict";

  return Controller.extend("sap.guide.claims.controller.Claims", {
    // The bundle of the i18n model: the texts in the user's language.
    getBundle() {
      return this.getView().getModel("i18n").getResourceBundle();
    },

    // Turns the status code of the service into a word from the i18n file.
    formatStatus(code) {
      return this.getBundle().getText("status" + code);
    },

    // Runs when the table has read its rows: show how many there are.
    onUpdateFinished(event) {
      const total = event.getParameter("total");
      const text = this.getBundle().getText("tableTitleCount", [total]);
      this.byId("tableTitle").setText(text);
    },

    // Runs when the user searches: ask the service for the matching rows only.
    onSearch(event) {
      const query = event.getParameter("query");
      const filters = [];
      if (query) {
        filters.push(new Filter("title", FilterOperator.Contains, query));
      }
      this.byId("claimTable").getBinding("items").filter(filters);
    }
  });
});
