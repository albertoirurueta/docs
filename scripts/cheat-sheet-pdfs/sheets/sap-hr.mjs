// SAP HR cheat sheet content, from modules/ROOT/pages/erp/sap/human-resources/cheat-sheet.adoc (baseline from the
// `== Version baseline` of modules/ROOT/pages/erp/sap/human-resources/index.adoc).
export default {
  file: 'sap-hr-cheat-sheet.pdf',
  title: 'SAP HR Cheat Sheet',
  subtitle: 'H4S4 on SAP S/4HANA 2025 FPS02 · SuccessFactors 2H 2026 (2611) · AI-generated summary — verify against help.sap.com · see the SAP HR pages for details',
  footer: 'Irurueta Docs · SAP Human Resources · all keys and numbers are invented example values (Example Trading Co.)',
  boxes: [
    {
      title: 'LANDSCAPE',
      color: 'indigo',
      items: [
        { label: 'Options', text: 'SAP ERP HCM (classic); SAP HCM for SAP S/4HANA (H4S4), separate license, active by default from 2025; SuccessFactors Employee Central; Employee Central Payroll.' },
        { label: 'Dates SAP published', text: 'Business Suite 7 mainstream maintenance to end of 2027, optional extended to end of 2030; S/4HANA commitment to end of 2040. No H4S4 end date stated.' },
        { label: 'Core hybrid', text: 'Employee Central holds core HR; H4S4 runs payroll or time management. Replication through SAP Cloud Integration (add-on ECS4HCM).' },
      ],
    },
    {
      title: 'ENTERPRISE AND PERSONNEL STRUCTURE',
      color: 'cyan',
      items: [
        { label: 'Enterprise structure', text: 'Client > company code > personnel area (4 chars) > personnel subarea (4 chars). Subarea: pay scales, work schedules, holiday calendar.' },
        { label: 'Personnel structure', text: 'Employee group (1 char) > employee subgroup (2 chars: PCR, wage types, work schedule, quotas). Payroll area (2 chars): who is paid together, when.' },
        { label: 'Stored in', code: [
          'Infotype 0001 Organizational Assignment',
          'Example: EX01 / 0001 / 1 / AA / E1',
        ].join('\n') },
      ],
    },
    {
      title: 'ORGANIZATIONAL MANAGEMENT',
      color: 'green',
      items: [
        { label: 'Object types', code: [
          'O organizational unit   S position',
          'C job                   P person',
        ].join('\n') },
        { label: 'Storage', text: 'Infotype 1000 Object = HRP1000; infotype 1001 Relationships = HRP1001.' },
        { label: 'Relationships', code: [
          'A003/B003 belongs to / incorporates',
          'A008 holder (S to P)   007 job',
          '012 manages            B002 supervisor',
        ].join('\n') },
        { label: 'Evaluation path', text: 'O-S-P follows B002, B003, A008: start object 50000001 gives 9 objects, 50000002 gives 5. Integration switch PLOGI ORGA; report RHINTE30.' },
      ],
    },
    {
      title: 'INFOTYPES',
      color: 'orange',
      items: [
        { label: 'Key infotypes', code: [
          '0000 Actions      0001 Org. Assignment',
          '0002 Personal     0003 Payroll Status',
          '0006 Addresses    0007 Planned Work Time',
          '0008 Basic Pay    0014 Recurring Pay/Ded',
          '0015 Additional Payments',
          '2001 Absences     2002 Attendances',
          '2006 Absence Quotas',
        ].join('\n') },
        { label: 'Time constraints', code: [
          '1 exactly one record always',
          '2 at most one, gaps allowed',
          '3 any number    A/B one record only',
          'T by subtype     Z time infotypes',
        ].join('\n') },
        { label: 'Dictionary', text: 'PAnnnn table, Pnnnn and PSnnnn structures. Customer range 9000 to 9999, created with PM01.' },
      ],
    },
    {
      title: 'PERSONNEL ACTIONS',
      color: 'pink',
      items: [
        { label: 'Transactions', code: [
          'PA40 personnel actions (hire, move, leave)',
          'PA30 maintain one infotype',
          'PA20 display only',
          'HRFE_MASS_UPDATE mass update',
        ].join('\n') },
        { label: 'Hire flow', text: 'PA40, start date, action type Hiring, position; then infotypes of the infogroup 0000, 0001, 0002, 0006, 0007, 0008. Action is recorded in 0000.' },
        { label: 'Validity', text: 'A new record delimits the old one; open end is 31.12.9999. Change after payroll triggers retroactive accounting.' },
      ],
    },
    {
      title: 'TIME MANAGEMENT AND EVALUATION',
      color: 'yellow',
      items: [
        { label: 'Work schedule chain', code: [
          'Daily EXDAY 08:00-16:30, break 0.5 h = 8.0',
          'Period EXWEEK Mon-Fri EXDAY = 40.0 h',
          'Rule EXRULE; shifts EXEARLY, EXLATE',
        ].join('\n') },
        { label: 'Time status (0007)', text: '0 no evaluation; 1, 2 actual times; 9 deviations only; 7 no payroll transfer; 8 external staff.' },
        { label: 'RPTIME00 (PT60)', code: [
          'TIP input > TOP output > TES/ZES/SALDO',
          'DZL, ZML > ZL (cluster B2)',
          'IFTYP: S planned  M overtime  A absence',
          'Payroll imports ZL: IMPRT B2',
          'Time types: table T555A',
        ].join('\n') },
      ],
    },
    {
      title: 'PAYROLL PROCESS',
      color: 'violet',
      items: [
        { label: 'Control record (PA03)', code: [
          'Exit payroll > Released for payroll',
          '  > run / Check result',
          '  > Released for correction > release again',
          '  > Exit payroll',
        ].join('\n') },
        { label: 'Driver and tools', code: [
          'RPCALCx0 or HxxCALC0, RPCALCX0 intl.',
          'PC00_M99_CALC     H99_DISPLAY_PAYRESULT',
          'Test run T, simulation S',
          'Off-cycle: blank, A bonus, B corr., C manual',
        ].join('\n') },
        { label: 'Check result', text: 'Result status A current, P previous, O older. Block a person with infotype 0003 to skip the run.' },
      ],
    },
    {
      title: 'SCHEMAS, PCRS, WAGE TYPES',
      color: 'slate',
      items: [
        { label: 'Schema X000 (subschemas)', code: [
          'COPY XIN0 init     COPY XBD0 basic data',
          'COPY XT00 gross    COPY XAP9 add. pay',
          'LPBEG ... LPEND iteration (XDD9, XNA9)',
          'COPY XRR0 retro    COPY XNN0 net',
          'COPY XEND final     * in D = line off',
        ].join('\n') },
        { label: 'Rules and tables', code: [
          'PCR X011: ADDWT, VWTCL, GCY subrule',
          'Editors PE01 schema, PE02 rule, PE04',
          'Fields AMT, RTE, NUM; tables WPBP IT RT',
          'CRT BT C0 C1 ORT; secondary /101 /559',
        ].join('\n') },
      ],
    },
    {
      title: 'AUTHORIZATIONS AND FORMS',
      color: 'teal',
      items: [
        { label: 'Authorization objects', code: [
          'P_ORGIN INFTY SUBTY AUTHC PERSA PERSG',
          '        PERSK VDSK1',
          'P_ORGXX extended   P_PERNR own number',
          'P_PCLX clusters    PLOG structural',
          'AUTHC: R M W E D S, PSIGN: I include',
          'Switches: T77S0 group AUTSW, ADAYS 15',
        ].join('\n') },
        { label: 'Forms', code: [
          'HRFORMS Forms Workplace   PE51 form editor',
          'Report RPCEDTx0, PC00_M99_CEDT',
          'Copy a form to a Z name, then activate',
        ].join('\n') },
      ],
    },
    {
      title: 'HR ABAP AND KEY TRANSACTIONS',
      color: 'indigo',
      items: [
        { label: 'Logical database', code: [
          'TABLES pernr.   INFOTYPES 0008.',
          'GET pernr (PNP)   GET peras (PNPCE)',
          'PROVIDE * FROM p0008 BETWEEN',
          '  pn-begda AND pn-endda.  ENDPROVIDE.',
        ].join('\n') },
        { label: 'Macros, function modules', code: [
          'RP-READ-INFOTYPE   RP_PROVIDE_FROM_LAST',
          'RP_UPDATE   HR_READ_INFOTYPE',
          'HR_INFOTYPE_OPERATION with',
          'BAPI_EMPLOYEE_ENQUEUE / _DEQUEUE',
        ].join('\n') },
        { label: 'Other transactions', code: [
          'SU21 objects  PFCG roles  SE37  SE36',
          'PU12 Interface Toolbox',
        ].join('\n') },
      ],
    },
    {
      title: 'SUCCESSFACTORS ODATA API',
      color: 'green',
      items: [
        { label: 'Entities', code: [
          'PerPerson (personIdExternal)',
          'EmpEmployment (personIdExternal, userId)',
          'EmpJob (userId, startDate, seqNumber)',
          'User   navigation: employmentNav, jobInfoNav',
        ].join('\n') },
        { label: 'Effective dating', code: [
          '...odata/v2/EmpJob?$filter=userId eq',
          "  '00001234'&asOfDate=2025-06-30",
          '  or fromDate=...&toDate=... (not both)',
          'POST .../odata/v2/upsert (eventReason)',
        ].join('\n') },
        { label: 'Paging', text: 'At most 1,000 records a query: $top, $skip, or paging=cursor, paging=snapshot.' },
      ],
    },
    {
      title: 'RUNNING EXAMPLE',
      color: 'orange',
      items: [
        { label: 'Example Trading Co.', code: [
          'Company code EX01, EUR, payroll area E1',
          '00001234 Ana Torres  4,000.00 EUR  AA',
          '00001235 Ben Okoye   2,400.00 EUR  AA',
          '00001236 Chloe Martin 14.00 EUR/h  AB',
        ].join('\n') },
        { label: 'Ana, March 2026 payslip', code: [
          'Gross 1000  4,000.00   Social 3000  800.00',
          'Tax 3100  15% of 3,200 = 480.00',
          'Net 2,720.00   Employer 3500  840.00',
        ].join('\n') },
      ],
    },
  ],
};
