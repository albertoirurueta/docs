// SAP Fiori "Horizon" (sap_horizon), light. The colours were read from the Horizon theme of OpenUI5 1.154.0
// (@openui5/themelib_sap_horizon, Apache-2.0; file src/sap/ui/core/themes/sap_horizon/base.less, the open-source
// theming base content that SAPUI5 ships, theming engine 17.0.10) and from the Fiori elements preview of the lab app
// (modules/ROOT/examples/sap-lab/expenses, `cds watch`) in a browser. Values that the theme derives with Less
// functions are computed here and marked with the formula: darken/lighten move the HSL lightness by that many points.
// This is the stated exception to the single-palette rule of scripts/cards/palette.mjs: guide figures must look like the
// product, so the product's own colours are used, only through these tokens. The shell bar shows a neutral placeholder
// mark, never an SAP logo. Confirmed in the lab on 2026-11-13 (CAP 10.2.2 `cds watch`, Fiori elements preview that
// loads SAPUI5 1.145.0, computed styles in the Browser pane): page background rgb(245,246,247), text rgb(19,30,41), shell
// bar white and 52 px high, emphasized button rgb(0,112,242) with 8 px radius and white text, title 24 px in rgb(0,100,217),
// font family 72. The preview runs in compact density (26 px controls); the figures draw the cozy 36 px size of the theme.
// NOT MEASURED (conservative neutral values, marked below): the syntax colours (the chart palette stands in) and the map
// colours.
export default {
  name: 'sap-horizon-1.154-light',
  product: 'sap-fiori',
  version: '1.154.0',
  variant: 'light',
  font: {
    family: '"72", "72full", Arial, Helvetica, sans-serif', // @sapFontFamily
    mono: '"72Mono", "72Monofull", "lucida console", monospace', // @sapContent_MonospaceFontFamily
    size: { small: 12, body: 14, title: 16, heading: 24, stat: 40 }, // body is @sapFontSize (0.875rem); heading measured in the lab; the others are not measured
  },
  size: { controlHeight: 36, headerHeight: 52, navWidth: 240 }, // controlHeight is @sapElement_Height (2.25rem, cozy); headerHeight measured in the lab; navWidth not measured
  radius: { panel: 16, control: 8, badge: 4 }, // control is @sapButton_BorderCornerRadius (0.5rem, confirmed in the lab); the others are not measured
  colour: {
    canvas: '#f5f6f7', // @sapBackgroundColor = @sapPrimary4
    surface: '#ffffff', // @sapBaseColor = @sapPrimary3 (list, group and page header backgrounds)
    surfaceRaised: '#eff1f2', // @sapShell_Background = darken(@sapBackgroundColor, 2)
    inputBg: '#ffffff', // @sapField_Background is #eff1f2 with the default flag; the lab draws fields white
    border: '#e5e5e5', // @sapList_BorderColor = darken(@sapList_Background, 10.2)
    borderStrong: '#556b81', // @sapField_BorderColor = darken(@sapPrimary5, 13)
    gridLine: '#e5e5e5', // not measured: the list border
    text: '#131e29', // @sapTextColor = @sapPrimary6
    textMuted: '#556b82', // @sapContent_LabelColor = @sapPrimary7
    textFaint: '#758ca4', // @sapPrimary5 (disabled and placeholder text are lighter than the label)
    textStrong: '#131e29',
    textOnPrimary: '#ffffff', // @sapButton_Emphasized_TextColor
    primary: '#0070f2', // @sapButton_Emphasized_Background = @sapBrandColor = @sapPrimary2
    secondary: '#ffffff', // @sapButton_Background = lighten(@sapBackgroundColor, 4)
    secondaryText: '#0064d9', // @sapButton_TextColor resolves to @sapHighlightColor = darken(@sapBrandColor, 5)
    secondaryBorder: '#bcc3ca', // @sapButton_BorderColor = darken(@sapBackgroundColor, 20)
    link: '#0064d9', // @sapLinkColor = @sapHighlightColor
    focus: '#0032a5', // @sapContent_FocusColor
    danger: '#aa0808', // @sapNegativeColor
    headerBg: '#ffffff', // @sapShellColor = @sapBaseColor
    headerText: '#131e29', // @sapShell_TextColor
    subHeaderBg: '#f5f6f7',
    navBg: '#ffffff', // @sapShell_Navigation_Background
    navText: '#131e29',
    navActiveBg: '#ebf8ff', // @sapList_SelectionBackgroundColor = @sapPrimary1
    navActiveBar: '#0064d9', // @sapList_SelectionBorderColor = @sapSelectedColor = @sapHighlightColor
    chipBg: '#eff1f2',
    chipText: '#131e29',
    tabActive: '#0064d9',
    editorBg: '#ffffff',
    editorText: '#131e29',
    syntax: { keyword: '#8b47d7', string: '#75980b', label: '#0064d9', number: '#c87b00' }, // not measured: chart palette entries 5, 3, 7 and 2
    state: {
      normal: { bg: '#256f3a', text: '#ffffff' }, // @sapPositiveColor
      pending: { bg: '#e76500', text: '#ffffff' }, // @sapCriticalColor
      firing: { bg: '#aa0808', text: '#ffffff' }, // @sapNegativeColor
      nodata: { bg: '#788fa6', text: '#ffffff' }, // @sapNeutralColor
    },
    threshold: { green: '#256f3a', yellow: '#c87b00', orange: '#e76500', red: '#aa0808' },
    map: { water: '#ebf8ff', land: '#eff1f2', border: '#bcc3ca' }, // not measured: Fiori maps are not drawn in the guides
    series: ['#168eff', '#c87b00', '#75980b', '#df1278', '#8b47d7', '#049f9a', '#0070f2', '#cc00dc', '#798c77', '#da6c6c'], // @sapChart_OrderedColor_1..10
  },
};
