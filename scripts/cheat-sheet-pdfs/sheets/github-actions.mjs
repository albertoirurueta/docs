// GitHub Actions cheat sheet, condensed from modules/ROOT/pages/git-and-github/github-actions/cheat-sheet.adoc and
// its sibling subsection pages; versions from the subsection index's Version baseline table.
export default {
  file: 'github-actions-cheat-sheet.pdf',
  title: 'GitHub Actions Cheat Sheet',
  subtitle: 'Workflow syntax, runners and actions as of November 2026 · AI-generated summary — verify against the GitHub docs · see the GitHub Actions pages',
  footer: 'Irurueta Docs · GitHub Actions · full explanations and examples: see the GitHub Actions pages',
  boxes: [
    {
      title: 'WORKFLOW — SKELETON',
      color: 'indigo',
      items: [
        {
          label: '.github/workflows/ci.yml',
          code: 'name: ci\non:\n  push:\n    branches: [main]\n  pull_request:\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  build:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15\n    steps:\n      - uses: actions/checkout@v7\n      - run: npm ci && npm test',
        },
        {
          label: 'Serialize or cancel overlapping runs',
          code: 'concurrency:\n  group: publish\n  cancel-in-progress: true',
        },
        { label: 'Note', text: 'A step has either uses or run, never both.' },
      ],
    },
    {
      title: 'TRIGGERS — FILTER',
      color: 'cyan',
      items: [
        {
          label: 'push / pull_request filters',
          code: "on:\n  push:\n    branches: [main, 'release/**']\n    tags: ['v*.*.*']\n    paths-ignore: ['docs/**']",
        },
        {
          label: 'schedule (UTC, default branch only)',
          code: "  schedule:\n    - cron: '0 3 * * *'\n    - cron: '30 5 * * 1-5'  # weekdays",
        },
        {
          label: 'workflow_dispatch with typed inputs',
          code: '  workflow_dispatch:\n    inputs:\n      target:\n        type: choice\n        options: [staging, production]',
        },
        {
          label: 'Others',
          text: 'workflow_call makes a workflow reusable; release and workflow_run chain runs; pull_request_target has secrets, so never run PR code in it.',
        },
      ],
    },
    {
      title: 'EXPRESSIONS — READ',
      color: 'green',
      items: [
        {
          label: 'Contexts',
          code: "${{ github.sha }}  ${{ github.ref_name }}\n${{ secrets.NAME }}  ${{ vars.NAME }}\n${{ needs.job.outputs.x }}  ${{ matrix.os }}\n${{ hashFiles('**/package-lock.json') }}",
        },
        {
          label: 'Conditions with status functions',
          code: "if: github.ref == 'refs/heads/main'\nif: always()   # run after a failure too\n# success() failure() always() cancelled()",
        },
        {
          label: 'Passing data from a run step',
          code: 'echo "version=1.2.3" >> "$GITHUB_OUTPUT"\necho "NAME=value" >> "$GITHUB_ENV"\necho "### Done" >> "$GITHUB_STEP_SUMMARY"\necho "::add-mask::$TOKEN"',
        },
      ],
    },
    {
      title: 'JOBS — CHAIN',
      color: 'orange',
      items: [
        {
          label: 'needs and job outputs',
          code: 'jobs:\n  prepare:\n    runs-on: ubuntu-latest\n    outputs:\n      v: ${{ steps.v.outputs.version }}\n    steps:\n      - id: v\n        run: |\n          echo "version=1.2.3" \\\n            >> "$GITHUB_OUTPUT"\n  use:\n    needs: prepare\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "$V"\n        env:\n          V: ${{ needs.prepare.outputs.v }}',
        },
        { label: 'Note', text: 'Outputs are always strings; use artifacts for files. Cycles in needs are rejected.' },
      ],
    },
    {
      title: 'MATRIX — EXPAND',
      color: 'pink',
      items: [
        {
          label: 'strategy.matrix',
          code: 'runs-on: ${{ matrix.os }}\nstrategy:\n  fail-fast: false\n  max-parallel: 4\n  matrix:\n    os: [ubuntu-latest, windows-latest]\n    java: [17, 21, 25]\n    include:\n      - os: ubuntu-24.04-arm\n        java: 21\n    exclude:\n      - os: windows-latest\n        java: 17',
        },
        {
          label: 'Use the matrix value',
          code: '- uses: actions/setup-java@v6\n  with:\n    distribution: temurin\n    java-version: ${{ matrix.java }}',
        },
      ],
    },
    {
      title: 'CACHE & ARTIFACTS — REUSE',
      color: 'yellow',
      items: [
        {
          label: 'actions/cache',
          code: "- uses: actions/cache@v6\n  with:\n    path: ~/.npm\n    key: npm-${{ runner.os }}-${{\n      hashFiles('package-lock.json') }}\n    restore-keys: |\n      npm-${{ runner.os }}-",
        },
        {
          label: 'Hand files to a later job',
          code: '- uses: actions/upload-artifact@v7\n  with:\n    name: site\n    path: build/site\n    retention-days: 7\n- uses: actions/download-artifact@v8\n  with: { name: site, path: site }',
        },
        { label: 'Note', text: 'setup-node@v7 with cache: npm caches the npm store without a separate cache step.' },
      ],
    },
    {
      title: 'CREDENTIALS — SCOPE',
      color: 'violet',
      items: [
        {
          label: 'Least-privilege token and OIDC',
          code: 'permissions:\n  contents: read\n  id-token: write   # request OIDC token',
        },
        {
          label: 'Deployment environment',
          code: 'deploy:\n  environment:\n    name: production\n    url: https://example.com\n  runs-on: ubuntu-latest\n  steps:\n    - run: ./deploy.sh',
        },
        { label: 'OIDC cloud login, no stored keys', text: 'aws-actions/configure-aws-credentials@v6, google-github-actions/auth@v3, azure/login@v3. Unlisted permission scopes become none.' },
      ],
    },
    {
      title: 'REUSE — CALL',
      color: 'slate',
      items: [
        {
          label: 'Reusable workflow (on: workflow_call)',
          code: "jobs:\n  build:\n    uses: ./.github/workflows/build.yml\n    with:\n      node-version: '24'\n    secrets: inherit",
        },
        {
          label: '.github/actions/setup/action.yml',
          code: "runs:\n  using: composite\n  steps:\n    - uses: actions/setup-node@v7\n      with:\n        node-version: '24'\n    - run: npm ci\n      shell: bash",
        },
        {
          label: 'Note',
          text: 'Remote: uses: org/repo/.github/workflows/x.yml@v1. Every composite run step needs shell; a local action needs checkout first.',
        },
      ],
    },
    {
      title: 'RUNS & SECURITY — HARDEN',
      color: 'teal',
      items: [
        {
          label: 'Runner labels',
          code: 'ubuntu-latest  ubuntu-24.04-arm\nwindows-latest windows-11-arm\nmacos-latest   macos-26-intel\n[self-hosted, linux, x64]',
        },
        {
          label: 'gh CLI',
          code: 'gh workflow run publish.yml -f debug=true\ngh run list --workflow publish.yml\ngh run watch\ngh run view --log-failed\ngh run rerun --failed',
        },
        {
          label: 'Pin SHAs; pass untrusted text via env',
          code: '- uses: actions/checkout@<sha>  # v7.0.1\n- run: echo "Title: $PR_TITLE"\n  env:\n    PR_TITLE: ${{\n      github.event.pull_request.title }}',
        },
      ],
    },
  ],
};
