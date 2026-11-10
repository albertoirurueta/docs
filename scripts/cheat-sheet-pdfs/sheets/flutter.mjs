// Flutter cheat sheet: content from modules/ROOT/pages/apps/hybrid/flutter/cheat-sheet.adoc (platform integration and
// a few API shapes from the sibling Flutter pages); versions from the Version baseline of the Flutter index.
export default {
  file: 'apps-hybrid-flutter-cheat-sheet.pdf',
  title: 'Flutter Cheat Sheet',
  subtitle: 'Flutter 3.47.9 · Dart 3.13.7 · go_router 18.1.4 · flutter_riverpod 3.5.0 · dio 5.11.1 · AI-generated summary — verify against the official docs · see the Flutter pages for details',
  footer: 'Irurueta Docs · Flutter · full explanations and examples: see the Flutter pages',
  boxes: [
    {
      title: 'CLI — PROJECT',
      color: 'indigo',
      items: [
        { label: 'Set up and create', code: 'flutter doctor       # check the toolchain\nflutter create trailhead\nflutter devices      # devices, emulators' },
        { label: 'Dependencies', code: 'flutter pub add dio\nflutter pub add dev:mocktail   # dev dep\nflutter pub get      # from pubspec.yaml' },
        { label: 'Run, analyse, generate', code: 'flutter run -d <device-id>\n# r = hot reload, R = hot restart\nflutter analyze\ndart format .\ndart run build_runner build\n# json_serializable, drift generators' },
      ],
    },
    {
      title: 'DART — ESSENTIALS',
      color: 'cyan',
      items: [
        { label: 'Variables and null safety', code: "final name = 'Ridge'; var count = 0;\nconst pi = 3.14;\nString? note; note?.length;\nnote ?? 'none'; note!" },
        { label: 'Functions and collections', code: 'int add(int a, int b) => a + b;\nvoid log({required String id,\n    int level = 0}) {}\n[1, 2]; {\'a\': 1}; {1, 2}\n[for (final t in trails) t.name,\n  if (admin) \'all\']' },
        { label: 'Classes, async, records', code: "class Trail {\n  const Trail(this.id); final String id; }\nFuture<int> f() async { return await g(); }\n(String, int) pair = ('a', 1);\n'${trail.name}: $count'" },
        { label: 'Sealed and switch', code: 'switch (r) {\n  Success(:final value) => value,\n  Failure() => null }' },
      ],
    },
    {
      title: 'WIDGETS — LAYOUT',
      color: 'green',
      items: [
        { label: 'Common widgets', code: 'MaterialApp  Scaffold  AppBar  Text  Icon\nElevatedButton  TextButton  IconButton\nFloatingActionButton\nTextField  Form  TextFormField   # input\nListView.builder  GridView.builder  # lazy\nCard  ListTile  Chip  Dialog  SnackBar' },
        { label: 'Layout', code: 'Row, Column     # main/crossAxisAlignment\nExpanded, Flexible  # share leftover space\nStack + Positioned  # overlay children\nPadding  SizedBox  Center  Align\nContainer  DecoratedBox  # size, colour\nSingleChildScrollView  SafeArea' },
        { label: 'Rule', text: 'Constraints go down, sizes go up, parents set positions. Bases: StatelessWidget, StatefulWidget, ConsumerWidget.' },
      ],
    },
    {
      title: 'STATE — RIVERPOD',
      color: 'orange',
      items: [
        { label: 'Notifier', code: 'class FavouritesNotifier\n    extends Notifier<Set<String>> {\n  @override\n  Set<String> build() => {};\n  void add(String id) =>\n      state = {...state, id};\n}' },
        { label: 'Declare and use', code: 'final favouritesProvider =\n  NotifierProvider<FavouritesNotifier,\n    Set<String>>(FavouritesNotifier.new);\nref.watch(p); ref.read(p); ref.listen(...)' },
        { label: 'Notes', text: 'Wrap the app in ProviderScope. AsyncNotifierProvider exposes AsyncValue (loading, data, error). Replace state with a new value, never mutate it. Local state: setState, ValueNotifier.' },
      ],
    },
    {
      title: 'ROUTING — GO_ROUTER',
      color: 'pink',
      items: [
        { label: 'Routes and guard', code: "GoRouter(\n  initialLocation: '/trails',\n  redirect: (context, state) =>\n      signedIn ? null : '/login',\n  routes: [GoRoute(\n    path: '/trails',\n    builder: (context, state) => ...,\n    routes: [GoRoute(path: ':id', ...)])])" },
        { label: 'Navigate', code: "context.go('/trails/42'); // replace stack\ncontext.push('/log');     // push on stack\ncontext.pop();            // go back" },
        { label: 'Parameters and tabs', code: "state.pathParameters['id']\nstate.uri.queryParameters['q']\nStatefulShellRoute.indexedStack\n// bottom tabs, each with its own stack" },
      ],
    },
    {
      title: 'NETWORK — DIO & STORAGE',
      color: 'yellow',
      items: [
        { label: 'Configure dio once', code: "final dio = Dio(BaseOptions(\n  baseUrl: 'https://api.example.com/v1',\n  connectTimeout:\n      const Duration(seconds: 10)));\ndio.interceptors\n    .add(AuthInterceptor(dio, tokens));" },
        { label: 'GET and decode', code: "final r = await dio\n    .get<List<dynamic>>('/trails');\nTrail.fromJson(\n    json as Map<String, dynamic>)\n// small apps: http.get(Uri), http.post" },
        { label: 'Local storage', code: 'final prefs =\n    await SharedPreferences.getInstance();\nawait getApplicationDocumentsDirectory();\n// drift: tables and watch() streams' },
      ],
    },
    {
      title: 'PLATFORM — INTEGRATE',
      color: 'violet',
      items: [
        { label: 'MethodChannel', code: "const _channel = MethodChannel(\n    'com.example.trailhead/battery');\nawait _channel\n    .invokeMethod<int>('getBatteryLevel');\n// throws PlatformException on failure" },
        { label: 'Location and camera', code: 'await Geolocator.checkPermission();\nawait Geolocator.requestPermission();\nfinal cameras = await availableCameras();\nCameraController(cameras.first,\n    ResolutionPreset.medium)' },
        { label: 'Permissions', text: 'Declare in AndroidManifest.xml and Info.plist (NSCameraUsageDescription, ...); a missing iOS key crashes on use. Pigeon generates both ends of a channel.' },
      ],
    },
    {
      title: 'TESTING — VERIFY',
      color: 'slate',
      items: [
        { label: 'Commands', code: 'flutter test             # unit + widget\nflutter test --coverage\n# writes coverage/lcov.info\nflutter test --update-goldens\nflutter test integration_test # device' },
        { label: 'Widget test', code: "testWidgets('...', (tester) async {\n  await tester.pumpWidget(const App());\n  await tester\n      .tap(find.byType(IconButton));\n  await tester.pumpAndSettle();\n  expect(find.text('Ridge'),\n      findsOneWidget);\n});" },
        { label: 'Fakes', text: 'Wrap the widget in ProviderScope with overrides to inject fakes; mocktail 1.0.5 for mocks.' },
      ],
    },
    {
      title: 'BUILD — RELEASE',
      color: 'teal',
      items: [
        { label: 'Artifacts', code: 'flutter build apk --release\nflutter build appbundle --release\n# Android App Bundle for Google Play\nflutter build ipa --release\n# iOS archive for App Store Connect' },
        { label: 'Options', code: '--dart-define=KEY=value\n--dart-define-from-file=file.json\n--obfuscate\n  --split-debug-info=build/symbols\n--analyze-size' },
        { label: 'Version in pubspec.yaml', code: 'version: 1.4.0+27  # name + build number' },
      ],
    },
  ],
};
