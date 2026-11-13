// SAP cheat sheet content, from modules/ROOT/pages/erp/sap/cheat-sheet.adoc (releases from the
// `== Version baseline` of modules/ROOT/pages/erp/sap/index.adoc).
export default {
  file: 'sap-cheat-sheet.pdf',
  title: 'SAP Cheat Sheet',
  subtitle: 'S/4HANA 2025 FPS02 · Public Edition 2608 · CAP @sap/cds 10.2 · SAPUI5 1.154 · AI-generated summary — verify against help.sap.com',
  footer: 'Irurueta Docs · SAP · transaction codes, commands and details: see the SAP pages',
  boxes: [
    {
      title: 'SAP GUI — TRANSACTION CODES',
      color: 'indigo',
      items: [
        { label: 'Command field', code: [
          '/nmb01   end task, open new transaction',
          '/o SE80  open it in a new session',
          '/o       list sessions',
          '/i       close this session',
          '/nend    confirm, then log off',
          '/nex     log off at once, no dialog',
        ].join('\n') },
        { label: 'Common codes', code: [
          'SU01 users        PFCG roles',
          'SE80 Object Navigator',
          'SM59 RFC destinations',
          'STMS transports   SM37 job overview',
          'SM12 lock entries ST22 ABAP dumps',
          '/IWFND/MAINT_SERVICE  OData services',
        ].join('\n') },
      ],
    },
    {
      title: 'CLIENTS, LANDSCAPE, TRANSPORTS',
      color: 'cyan',
      items: [
        { label: 'Clients and systems', code: [
          'DEV -> QAS -> PRD   three-system group',
          'T000    client control table',
          'SCC4    client settings',
          'MANDT   client key column',
        ].join('\n') },
        { label: 'Transports', code: [
          'SE09 / SE01   request overview',
          'STMS          Transport Management',
          'S_TRANSPRT    authorization object',
        ].join('\n') },
        { label: 'Other tools', text: 'Public Edition: Adaptation Transport Organizer. BTP content: SAP Cloud Transport Management. SAP Cloud ALM orchestrates, it does not move transports.' },
      ],
    },
    {
      title: 'USERS, ROLES, AUTHORIZATIONS',
      color: 'green',
      items: [
        { label: 'ABAP system', code: [
          'SU01   create user, assign roles',
          'PFCG   roles, menu, authorizations',
          'SU53   last failed check',
          'SUIM   users, roles, critical rights',
          'ST01   authorization trace',
        ].join('\n') },
        { label: 'Other models', text: 'Public Edition: business roles from business catalogs, narrowed by restriction types. BTP: role templates, role collections, then users or groups.' },
      ],
    },
    {
      title: 'ARCHITECTURE AND VDM',
      color: 'orange',
      items: [
        { label: 'Three tiers', text: 'Presentation: Fiori launchpad, SAP GUI (DIAG). Application: ABAP server with SAP Gateway. Database: SAP HANA, in-memory and column-oriented.' },
        { label: 'View prefixes', code: [
          'I_  interface view',
          'C_  consumption view',
          'P_  private view',
          'R_ A_ E_  further prefixes',
        ].join('\n') },
        { label: 'Note', text: 'Build only on released views (contracts C0, C1, C2).' },
      ],
    },
    {
      title: 'ODATA AND GATEWAY',
      color: 'pink',
      items: [
        { label: 'Query options', code: [
          '$metadata   service description',
          '$filter=amount gt 50',
          '$select  $orderby=ID  $top=5',
          '$skip=10  $count=true  $expand=items',
          '$batch      many requests, one trip',
        ].join('\n') },
        { label: 'Gateway', code: [
          'SEGW                   build V2 services',
          '/IWFND/MAINT_SERVICE   publish V2',
          '/IWFND/V4_ADMIN        V4 service groups',
          'x-csrf-token: fetch    before writes',
        ].join('\n') },
      ],
    },
    {
      title: 'INTEGRATION — RFC, BAPI, IDOC',
      color: 'violet',
      items: [
        { label: 'ALE chain of settings', code: [
          'SM59   destination',
          'WE21   port',
          'WE20   partner profile',
          'WE41 / WE42   process codes',
          'WE02   display IDocs',
          'WE19   test tool',
        ].join('\n') },
        { label: 'Notes', text: 'BAPI: RFC-capable function module, synchronous via RFC, asynchronous via ALE. Commit with BAPI_TRANSACTION_COMMIT. ABAP Cloud: communication arrangements. Prefer OData and events for new interfaces.' },
      ],
    },
    {
      title: 'BTP AND CAP COMMANDS',
      color: 'teal',
      items: [
        { label: 'Project and local run', code: [
          'npm i -g @sap/cds-dk',
          'cds init expenses --nodejs',
          'cds watch',
          'cds version',
          'cds env get requires.auth.kind',
        ].join('\n') },
        { label: 'Deploy', code: [
          'cds add hana,xsuaa,mta',
          'cds up',
          'mbt build -t gen --mtar mta.tar',
          'cf deploy gen/mta.tar -f',
          'cf login --sso',
          'cf target',
          'cds add kyma',
        ].join('\n') },
        { label: 'Accounts', text: 'Global account, subaccounts (one region each), optional directories. Cloud Foundry: org and spaces. Kyma: clusters and namespaces.' },
      ],
    },
    {
      title: 'SAPUI5 AND FIORI',
      color: 'yellow',
      items: [
        { label: 'UI5 CLI', code: [
          'npx ui5 serve --port 8127',
          'npx ui5 build --dest ../dist',
        ].join('\n') },
        { label: 'App parts', text: 'Component with manifest.json (models, libraries, routes), XML views, JavaScript controllers loaded with sap.ui.define, models, i18n files, routes.' },
        { label: 'Fiori elements annotations', code: [
          '@UI.LineItem         list report columns',
          '@UI.SelectionFields  filter bar fields',
          '@UI.HeaderInfo       object names, title',
          '@UI.Facets           object page sections',
          '@UI.FieldGroup       fields in a section',
        ].join('\n') },
      ],
    },
    {
      title: 'EXTENSIBILITY, DEPLOYMENT',
      color: 'slate',
      items: [
        { label: 'Three extension kinds', text: 'Key user (low-code, in the app), developer (ABAP in the S/4HANA stack), side-by-side (on SAP BTP). Start with key user for small changes.' },
        { label: 'Clean core levels', text: 'A to D by the SAP objects used; ATC shows no finding, information, warning, error.' },
        { label: 'Deployment options', text: 'Public Edition: multi-tenant, upgrades February and August. Private Edition: single-tenant, RISE with SAP. On premise: customer operated. Paths: new implementation, system conversion, selective data transition.' },
      ],
    },
  ],
};
