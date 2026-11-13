// Visual Studio Code 1.135.0, theme "Dark Modern". The colours were read from the theme files that ship with the editor
// (Contents/Resources/app/extensions/theme-defaults/themes/dark_modern.json, dark_plus.json and dark_vs.json, MIT
// licence of the vscode repository) and from the default colour registry in the same installation (list selection and
// hover, terminal ANSI colours). The guides run the editor on the lab project; no screenshot was taken, so nothing here
// is read from a rendered window. NOT MEASURED (conservative values, marked below): the series colours, the map colours
// and the sizes of the controls.
export default {
  name: 'vscode-1.135-dark-modern',
  product: 'vscode',
  version: '1.135.0',
  variant: 'dark',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    size: { small: 12, body: 13, title: 13, heading: 20, stat: 32 }, // the workbench font is 13px; the others are not measured
  },
  size: { controlHeight: 26, headerHeight: 30, navWidth: 260 }, // not measured
  radius: { panel: 6, control: 2, badge: 10 }, // not measured
  colour: {
    canvas: '#1f1f1f', // editor.background
    surface: '#181818', // sideBar.background, panel.background, titleBar.activeBackground
    surfaceRaised: '#313131', // input.background, dropdown.background
    inputBg: '#313131', // input.background
    border: '#2b2b2b', // sideBar.border, panel.border, tab.border
    borderStrong: '#3c3c3c', // input.border
    gridLine: '#2b2b2b',
    text: '#cccccc', // foreground
    textMuted: '#9d9d9d', // descriptionForeground, tab.inactiveForeground
    textFaint: '#989898', // input.placeholderForeground
    textStrong: '#ffffff', // tab.activeForeground
    textOnPrimary: '#ffffff', // button.foreground
    primary: '#0078d4', // button.background
    secondary: '#313131',
    secondaryText: '#cccccc', // button.secondaryForeground
    secondaryBorder: '#3c3c3c',
    link: '#4daafc', // textLink.foreground
    focus: '#0078d4', // focusBorder
    danger: '#f85149', // errorForeground
    headerBg: '#181818', // titleBar.activeBackground
    headerText: '#cccccc', // titleBar.activeForeground
    subHeaderBg: '#1f1f1f', // breadcrumb row sits on the editor background
    navBg: '#181818', // sideBar.background
    navText: '#cccccc', // sideBar.foreground
    navActiveBg: '#04395e', // list.activeSelectionBackground (default registry)
    navActiveBar: '#0078d4', // activityBar.activeBorder
    chipBg: '#616161', // badge.background
    chipText: '#f8f8f8', // badge.foreground
    tabActive: '#0078d4', // tab.activeBorderTop
    editorBg: '#1f1f1f', // editor.background
    editorText: '#cccccc', // editor.foreground
    syntax: { keyword: '#569cd6', string: '#ce9178', label: '#9cdcfe', number: '#b5cea8' }, // dark_vs.json token colours: keyword, string, variable, numeric
    state: {
      normal: { bg: '#0dbc79', text: '#000000' }, // terminal ANSI green
      pending: { bg: '#e5e510', text: '#000000' }, // terminal ANSI yellow
      firing: { bg: '#cd3131', text: '#ffffff' }, // terminal ANSI red
      nodata: { bg: '#616161', text: '#f8f8f8' }, // badge
    },
    threshold: { green: '#0dbc79', yellow: '#e5e510', orange: '#ce9178', red: '#f14c4c' },
    map: { water: '#181818', land: '#313131', border: '#3c3c3c' }, // not measured: maps are not drawn in this product
    series: ['#2472c8', '#0dbc79', '#e5e510', '#bc3fbc', '#11a8cd', '#cd3131', '#3b8eea', '#23d18b', '#d670d6', '#29b8db'], // terminal ANSI colours; not measured as chart colours
  },
};
