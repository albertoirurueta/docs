// Which guide shows which screen map, and where the pages of each area live. A map (figures/sap-maps.mjs, file
// sap-<area>-map-<screen>.svg) is shown once, before the first numbered step, by the guide listed here (the file is
// guide-<name>.adoc in the area's folder). Until that guide exists the map has no page and the test accepts that; once it
// exists the map must be referenced by it and by no other page. A guide may show several maps.
//
// Areas: abap (ABAP section), general (SAP general: CAP, UI5, OData, BTP), finance, hr.
export const areaDirs = {
  abap: ['programming-languages', 'abap'],
  general: ['erp', 'sap'],
  finance: ['erp', 'sap', 'finance'],
  hr: ['erp', 'sap', 'human-resources'],
};

export const mapGuides = {
  general: {
    'fiori-list-report': 'cap-fiori-elements-app',
    'fiori-object-page': 'cap-fiori-elements-app',
    'vscode-cap-project': 'first-cap-service',
  },
  abap: {
    'abaplint-terminal': 'check-code-with-abaplint',
  },
};
