// Content module for the Ionic cheat-sheet PDF (source: modules/ROOT/pages/apps/hybrid/ionic/cheat-sheet.adoc,
// versions from the Version baseline of modules/ROOT/pages/apps/hybrid/ionic/index.adoc).
export default {
  file: 'apps-hybrid-ionic-cheat-sheet.pdf',
  title: 'Ionic Cheat Sheet',
  subtitle: 'Ionic Framework 9.0.10 · Ionic CLI 7.2.1 · Capacitor 8.6.0 · Angular 22.2.5 · Node 22+ · AI-generated summary — verify against the official docs · see the Ionic pages for details',
  footer: 'Irurueta Docs · Ionic · full explanations and examples: see the Ionic pages',
  boxes: [
    {
      title: 'CLI — PROJECT',
      color: 'indigo',
      items: [
        { label: 'Install, scaffold, serve', code: 'npm install -g @ionic/cli\nionic start trailhead tabs --type=angular\nionic serve    # browser, live reload' },
        { label: 'Production web build', code: 'npx ng build --configuration production' },
        { label: 'Note', text: 'Angular 22 with standalone components and signals; example app id com.example.trailhead.' },
        { label: 'Capacitor 8 toolchain', code: 'Node.js 22+   Xcode 26.0+\nAndroid Studio Otter (2025.2.1)+\niOS 15.0+     Android minSdk 24\ncompileSdk / targetSdk 36' },
      ],
    },
    {
      title: 'PROJECT — LAYOUT',
      color: 'cyan',
      items: [
        { label: 'Paths', code: 'src/app/        components, services, routes\nsrc/theme/variables.scss\n                Ionic theme variables\nsrc/global.scss global styles, Ionic CSS\nandroid/, ios/  native projects, in Git\nwww/            web build output (webDir)' },
        { label: 'capacitor.config.ts', code: "const config: CapacitorConfig = {\n  appId: 'com.example.trailhead',\n  appName: 'trailhead',\n  webDir: 'www',\n};" },
        { label: 'Note', text: 'webDir must match the folder the web build writes to (also holds server and plugins keys).' },
      ],
    },
    {
      title: 'COMPONENTS — USE',
      color: 'green',
      items: [
        { label: 'Shell, header and body', code: 'ion-app, ion-router-outlet  # root, outlet\nion-header, ion-toolbar, ion-title\nion-content  # scrollable body, safe areas' },
        { label: 'Lists, input, actions', code: 'ion-list, ion-item, ion-label\nion-searchbar\nion-button, ion-fab, ion-icon' },
        { label: 'Tabs, overlays, paging', code: 'ion-tabs, ion-tab-bar, ion-tab-button\nion-modal, ion-alert, ion-toast\nion-refresher, ion-infinite-scroll' },
        { label: 'Standalone imports and icons', code: "import { IonContent, IonHeader }\n  from '@ionic/angular/standalone';\nimport { addIcons } from 'ionicons';\nimport { heart } from 'ionicons/icons';\n// @Component({ imports: [IonHeader, ...] })\naddIcons({ heart });" },
      ],
    },
    {
      title: 'THEMING — STYLE',
      color: 'orange',
      items: [
        { label: 'Global CSS variables', code: '--ion-color-primary\n  (+ -rgb, -contrast, -shade, -tint)\n--ion-background-color\n--ion-text-color\n--ion-font-family\n--ion-safe-area-top' },
        { label: 'Per-component custom properties', code: '--background, --color' },
        { label: 'Force a mode (ios or md)', code: "provideIonicAngular({ mode: 'md' })" },
        { label: 'Dark mode', text: "Import one of Ionic's dark palette stylesheets or use prefers-color-scheme." },
      ],
    },
    {
      title: 'ROUTING — NAVIGATE',
      color: 'pink',
      items: [
        { label: 'Routes (app.config.ts)', code: 'provideRouter(routes)\n// lazy-load a page\nloadComponent: () => import(...)\n// guard\ncanActivate: [authGuard]   // CanActivateFn' },
        { label: 'Navigation', code: 'NavController   // programmatic\nrouterLink      // declarative' },
        { label: 'Page lifecycle', code: 'ionViewWillEnter  // about to show: refresh\nionViewDidEnter   // fully shown\nionViewWillLeave  // hiding\nionViewDidLeave   // hidden\nngOnInit  // once; cached pages skip it' },
      ],
    },
    {
      title: 'CAPACITOR — SYNC',
      color: 'yellow',
      items: [
        { label: 'Native projects', code: 'npx cap add android    # or ios\nnpx cap open android   # or ios: IDE\nnpx cap run android    # device, emulator' },
        { label: 'Keep native in step', code: 'npx cap sync  # web, config, plugins\nnpx cap copy  # web build, config only' },
        { label: 'Maintenance', code: 'npx cap doctor   # env, plugin versions\nnpx cap migrate  # new Capacitor major\n# icons and splash screens\nnpx capacitor-assets generate' },
      ],
    },
    {
      title: 'PLUGINS — CALL',
      color: 'violet',
      items: [
        { label: 'Camera 8.2.6 · Geolocation 8.2.4', code: 'Camera.getPhoto({\n  resultType: CameraResultType.Uri })\nGeolocation.getCurrentPosition()\nGeolocation.checkPermissions()\nGeolocation.requestPermissions()' },
        { label: 'Network 8.0.1 · App 8.1.2', code: "Network.addListener(\n  'networkStatusChange', cb)\nApp.addListener('appUrlOpen', cb)" },
        { label: 'Haptics 8.0.2 · Splash Screen 8.0.2', code: 'Haptics.impact()\nSplashScreen.hide()' },
        { label: 'After installing', text: 'Run npx cap sync, declare permissions in AndroidManifest.xml and Info.plist, and wrap plugins in services so tests can replace them.' },
      ],
    },
    {
      title: 'DATA — STORE',
      color: 'slate',
      items: [
        { label: 'HttpClient with interceptors', code: 'provideHttpClient(withInterceptors([\n  baseUrlInterceptor, authInterceptor]))' },
        { label: 'Native HTTP (capacitor.config.ts)', code: 'plugins: {\n  CapacitorHttp: { enabled: true } }' },
        { label: 'Storage choices', code: 'settings  @capacitor/preferences 8.0.1\n          Preferences.set, Preferences.get\nfiles     @capacitor/filesystem 8.1.5\nrelational  @capacitor-community/sqlite\nbrowser   IndexedDB\ntokens    Keychain/Keystore-backed plugin' },
      ],
    },
    {
      title: 'SHIP — TEST & RELEASE',
      color: 'teal',
      items: [
        { label: 'Test and debug', code: 'npx ng test          # unit, component\nnpx playwright test  # e2e, PW 1.65.0\nchrome://inspect     # Android WebView\nSafari Develop menu  # iOS WebView' },
        { label: 'Android release', code: 'keytool -genkeypair -v \\\n  -keystore trailhead-upload.jks \\\n  -alias upload \\\n  -keyalg RSA -keysize 2048 -validity 10000\ncd android\n./gradlew assembleRelease  # release APK\n./gradlew bundleRelease    # AAB, Play' },
        { label: 'iOS and versions', code: 'Xcode: Product, Archive  # TestFlight\nversionCode / versionName  # Android\nCFBundleVersion  # iOS build number' },
        { label: 'Over-the-air', text: '@capacitor/live-updates 0.5.0 for optional web updates.' },
      ],
    },
  ],
};
