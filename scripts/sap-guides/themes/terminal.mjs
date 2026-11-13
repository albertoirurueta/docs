// A terminal window as the VS Code integrated terminal draws it in Dark Modern: the colours were read from the same
// sources as themes/vscode.mjs (VS Code 1.135.0: dark_modern.json for the panel, the default colour registry for
// terminal.foreground and the ANSI palette). A terminal is a frame the guides draw by hand, so the sizes are not
// measured. The values are for a monospace-first look: `font.family` is the monospace stack.
export default {
  name: 'terminal-vscode-1.135-dark',
  product: 'terminal',
  version: '1.135.0',
  variant: 'dark',
  font: {
    family: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    size: { small: 12, body: 13, title: 13, heading: 20, stat: 32 }, // not measured
  },
  size: { controlHeight: 24, headerHeight: 28, navWidth: 200 }, // not measured
  radius: { panel: 6, control: 2, badge: 8 }, // not measured
  colour: {
    canvas: '#181818', // panel.background (terminal.background is unset, so the panel shows through)
    surface: '#181818',
    surfaceRaised: '#313131',
    inputBg: '#181818',
    border: '#2b2b2b', // panel.border
    borderStrong: '#3c3c3c',
    gridLine: '#2b2b2b',
    text: '#cccccc', // terminal.foreground (dark default)
    textMuted: '#9d9d9d',
    textFaint: '#666666', // ANSI bright black
    textStrong: '#ffffff',
    textOnPrimary: '#ffffff',
    primary: '#0078d4',
    secondary: '#313131',
    secondaryText: '#cccccc',
    secondaryBorder: '#3c3c3c',
    link: '#3b8eea', // ANSI bright blue
    focus: '#0078d4',
    danger: '#f14c4c', // ANSI bright red
    headerBg: '#181818',
    headerText: '#cccccc',
    subHeaderBg: '#181818',
    navBg: '#181818',
    navText: '#cccccc',
    navActiveBg: '#04395e',
    navActiveBar: '#0078d4',
    chipBg: '#313131',
    chipText: '#cccccc',
    tabActive: '#0078d4',
    editorBg: '#181818',
    editorText: '#cccccc',
    syntax: { keyword: '#d670d6', string: '#e5e510', label: '#29b8db', number: '#23d18b' }, // ANSI bright magenta, yellow, cyan and green
    state: {
      normal: { bg: '#0dbc79', text: '#000000' }, // ANSI green
      pending: { bg: '#e5e510', text: '#000000' }, // ANSI yellow
      firing: { bg: '#cd3131', text: '#ffffff' }, // ANSI red
      nodata: { bg: '#666666', text: '#ffffff' }, // ANSI bright black
    },
    threshold: { green: '#0dbc79', yellow: '#e5e510', orange: '#e5e510', red: '#cd3131' },
    map: { water: '#181818', land: '#313131', border: '#3c3c3c' }, // not used
    series: ['#2472c8', '#0dbc79', '#e5e510', '#bc3fbc', '#11a8cd', '#cd3131', '#3b8eea', '#23d18b', '#d670d6', '#29b8db'], // ANSI colours
  },
};
