// Figures of the Kibana guide K18, "Spaces, roles and users" (guide-spaces-roles-and-users.adoc).
// Facts: guides-brief/kibana-facts.md sections 1 and 13 (Kibana 9.5.6). Verified there: the primary navigation with the
// Management section, the Create space page (Name, Description, URL identifier, Select solution view, Set feature visibility
// with the group counts), the Create role page (Role name, Role description, Index privileges, Application layer - Kibana,
// Assign to space, Create role) and the Create user page (Profile, Password, Privileges). NOT VERIFIED there (drawn
// generically): the solution view options, the Assign to space flyout and its privilege choices, the Saved objects list and
// its copy-to-space action, the account menu, and the Observability navigation of a space as a signed-in user. Callout numbers
// are the step numbers of the page; a figure shows the screen as the step starts, with the control to act on highlighted.
import { FW, lbl, box, btn, mark, marks, menu, segmented, kibanaFrame } from '../lib/shells.mjs';

const figures = [];

// A Kibana page with a heading and an optional lead line; `build` returns the nodes of the body.
function page({ h, crumbs, title, lead, body, actions }) {
  const fr = kibanaFrame({ h, crumbs, actions });
  const n = [lbl(16, 136, title, { size: 'heading', weight: 500, tone: 'textStrong', box: 500 })];
  if (lead) n.push(lbl(16, 160, lead, { tone: 'textMuted', box: 1000 }));
  const out = body(fr.geo);
  fr.nodes[0].children.push(...n, ...(Array.isArray(out) ? out : out.nodes));
  return { nodes: fr.nodes, geo: fr.geo, extra: out };
}

// 01: the primary navigation, Management section (steps 1 and 2)
{
  const fr = kibanaFrame({ h: 650, crumbs: ['Home'] });
  const items = [
    { label: 'Home', icon: 'home' }, { label: 'Analytics' }, { label: 'Elasticsearch' }, { label: 'Observability' }, { label: 'Security' }, { label: 'Management' },
    { label: 'Dev Tools', indent: 1 }, { label: 'Workflows', indent: 1 }, { label: 'Integrations', indent: 1 }, { label: 'Fleet', indent: 1 }, { label: 'Osquery', indent: 1 },
    { label: 'Stack Monitoring', indent: 1 }, { label: 'Cloud Connect', indent: 1 }, { label: 'Stack Management', indent: 1 }, { label: 'Streams', indent: 1 },
  ];
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 248, h: 534, items },
    ...marks([[fr.geo.menu, 1], [{ x: 8, y: 96 + 8 + 13 * 34, w: 232, h: 32 }, 2]]),
  );
  figures.push({
    id: '01-primary-navigation',
    alt: 'Kibana 9.5 with the primary navigation open and the Management section listing Dev Tools, Workflows, Integrations, Fleet, Osquery, Stack Monitoring, Cloud Connect, Stack Management and Streams; callout 1 marks the menu button of the second bar and callout 2 marks Stack Management',
    width: FW, height: 650, nodes: fr.nodes,
  });
}

// 02: Create space, Describe this space (steps 4 and 5)
{
  const nameBox = { x: 16, y: 226, w: 560, h: 32 };
  const idBox = { x: 16, y: 372, w: 560, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Spaces', 'Create'], title: 'Create space', lead: 'Organize Kibana into spaces with dedicated navigation, privileges and objects.',
    body: () => [
      lbl(16, 192, 'Describe this space', { size: 'title', weight: 600, box: 400 }),
      { block: 'field', x: 16, y: 206, w: 560, label: 'Name', value: 'Guide ops' },
      { block: 'field', x: 16, y: 272, w: 560, label: 'Description (Optional)', h: 40 },
      { block: 'field', x: 16, y: 352, w: 560, label: 'URL identifier', value: 'guide-ops', hint: "You can't change the URL identifier once created." },
      ...marks([[nameBox, 4], [idBox, 5]]),
    ],
  });
  figures.push({
    id: '02-describe-space',
    alt: 'Create space page of Kibana 9.5 with the section Describe this space: the Name field holding Guide ops is marked by callout 4, the URL identifier field holding guide-ops with the hint that it cannot be changed is marked by callout 5',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 03: Select solution view (step 6)
{
  const sel = { x: 16, y: 272, w: 400, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Spaces', 'Create'], title: 'Create space',
    body: () => [
      lbl(16, 200, 'Select solution view', { size: 'title', weight: 600, box: 300 }),
      { block: 'chip', x: 220, y: 184, str: 'NEW' },
      lbl(16, 226, 'Focus the navigation and menus of this space on a specific solution.', { tone: 'textMuted', box: 800 }),
      { block: 'dropdown', x: 16, y: 252, w: 400, label: 'Solution view', value: 'Observability', open: true, options: ['Observability', 'Security', 'Search'], selected: 0 },
      ...mark(sel, 6),
    ],
  });
  figures.push({
    id: '03-solution-view',
    alt: 'Create space page of Kibana 9.5 with the section Select solution view and the Solution view select open with the choices Observability, Security and Search; the select is marked by callout 6',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 04: feature visibility and the create button (step 7)
{
  const groups = [['Analytics', '10/10'], ['Alerting V2', '4/4'], ['Elasticsearch', '6/6'], ['Observability', '8/8'], ['Security', '9/9'], ['Management', '26/26']];
  const create = { x: 16, y: 450, w: 140, h: 32 };
  const p = page({
    h: 540, crumbs: ['Stack Management', 'Spaces', 'Create'], title: 'Create space',
    body: () => [
      lbl(16, 200, 'Set feature visibility', { size: 'title', weight: 600, box: 400 }),
      btn(FW - 16 - 120, 180, 120, 'Hide all'),
      ...groups.flatMap(([g, c], i) => {
        const cx = 16 + (i % 3) * 352, cy = 226 + Math.floor(i / 3) * 70;
        return [box(cx, cy, 336, 56, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(cx + 16, cy + 33, g, { weight: 500, box: 220 }), lbl(cx + 320, cy + 33, c, { anchor: 'end', tone: 'textMuted', box: 80 })];
      }),
      btn(create.x, create.y, create.w, 'Create space', 'primary'), btn(172, 450, 90, 'Cancel'),
      ...mark(create, 7),
    ],
  });
  figures.push({
    id: '04-feature-visibility',
    alt: 'Create space page of Kibana 9.5 with the section Set feature visibility listing the groups Analytics 10 of 10, Alerting V2 4 of 4, Elasticsearch 6 of 6, Observability 8 of 8, Security 9 of 9 and Management 26 of 26; the Create space button is marked by callout 7',
    width: FW, height: 540, nodes: p.nodes,
  });
}

// 05: Create role, name and description (steps 9 and 10)
{
  const nameBox = { x: 16, y: 206, w: 560, h: 32 };
  const descBox = { x: 16, y: 302, w: 560, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Roles', 'Create'], title: 'Create role', lead: 'Set privileges on your Elasticsearch data and control access to your Project spaces.',
    body: () => [
      { block: 'field', x: 16, y: 186, w: 560, label: 'Role name', value: 'guide-bookshelf-viewer', hint: 'Once the role is created you can no longer edit its name.' },
      { block: 'field', x: 16, y: 282, w: 560, label: 'Role description', value: 'Read the Bookshelf logs' },
      ...marks([[nameBox, 9], [descBox, 10]]),
    ],
  });
  figures.push({
    id: '05-role-name',
    alt: 'Create role page of Kibana 9.5 with the Role name field holding guide-bookshelf-viewer, marked by callout 9, and the Role description field holding Read the Bookshelf logs, marked by callout 10',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 06: index privileges (steps 11 to 14)
{
  const addBtn = { x: 16, y: 232, w: 190, h: 32 };
  const ind = { x: 16, y: 150, w: 480, h: 32 };
  const prv = { x: 508, y: 150, w: 540, h: 32 };
  const assign = { x: 16, y: 400, w: 160, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Roles', 'Create'], title: 'Create role',
    body: () => [
      lbl(16, 192, 'Index privileges', { size: 'title', weight: 600, box: 300 }),
      lbl(16, 218, 'Indices', { size: 'small', weight: 500, box: 200 }), lbl(528, 218, 'Privileges', { size: 'small', weight: 500, box: 200 }),
      { block: 'field', x: 16, y: 222, w: 470, value: 'logs-generic.otel-default' },
      { block: 'field', x: 528, y: 222, w: 520, value: 'read, view_index_metadata' },
      { block: 'checkbox', x: 16, y: 270, label: 'Grant access to specific fields', box: 280 },
      { block: 'checkbox', x: 340, y: 270, label: 'Grant read privileges to specific documents', box: 400 },
      btn(addBtn.x, 310, addBtn.w, 'Add index privilege', 'secondary', 'plus'),
      box(16, 358, 1048, 1, { fill: 'border' }),
      lbl(16, 386, 'Application layer - Kibana', { size: 'title', weight: 600, box: 400 }),
      lbl(16, 414, 'This role does not grant access to Kibana', { tone: 'textMuted', box: 500 }),
      btn(assign.x, 430, assign.w, 'Assign to space'),
      ...marks([[{ ...addBtn, y: 310 }, 11], [{ x: 16, y: 222, w: 470, h: 32 }, 12], [{ x: 528, y: 222, w: 520, h: 32 }, 13], [{ ...assign, y: 430 }, 14]]),
    ],
  });
  void ind; void prv;
  figures.push({
    id: '06-index-privileges',
    alt: 'Create role page of Kibana 9.5 with the Index privileges section: the button Add index privilege is marked by callout 11, the Indices field holding logs-generic.otel-default by callout 12 and the Privileges field holding read and view_index_metadata by callout 13; below, in the Application layer - Kibana section, the button Assign to space is marked by callout 14',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 07: the Assign to space flyout (steps 15 to 17)
{
  const fx = 584, fw = 496, ix = fx + 20, iw = fw - 40;
  const spaces = { x: ix, y: 186, w: iw, h: 32 };
  const seg = segmented({ x: ix, y: 266, items: ['None', 'Read', 'All'], w: 100, active: 1 });
  const assign = { x: fx + fw - 20 - 90, y: 440, w: 90, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Roles', 'Create'], title: 'Create role',
    body: () => [
      { block: 'flyout', x: fx, y: 96, w: fw, h: 424, title: 'Assign role to space' },
      { block: 'field', x: ix, y: 166, w: iw, label: 'Spaces', value: 'Guide ops' },
      lbl(ix, 252, 'Privileges', { size: 'small', weight: 500, box: 300 }),
      ...seg.nodes,
      btn(fx + fw - 20 - 90 - 8 - 84, 440, 84, 'Cancel'), btn(assign.x, assign.y, assign.w, 'Assign', 'primary'),
      ...marks([[{ ...spaces, y: 186 }, 15], [seg.boxes[1], 16], [assign, 17]]),
    ],
  });
  figures.push({
    id: '07-assign-to-space',
    alt: 'Flyout Assign role to space on the Create role page of Kibana 9.5: the Spaces field holding Guide ops is marked by callout 15, the privilege choice Read is marked by callout 16 and the Assign button is marked by callout 17',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 08: the Kibana section after the assignment; Create role (step 18)
{
  const create = { x: 16, y: 400, w: 130, h: 32 };
  const p = page({
    h: 520, crumbs: ['Stack Management', 'Roles', 'Create'], title: 'Create role',
    body: () => [
      lbl(16, 192, 'Application layer - Kibana', { size: 'title', weight: 600, box: 400 }),
      { block: 'table', x: 16, y: 210, w: 1048, columns: [{ title: 'Spaces', w: 3 }, { title: 'Privileges', w: 3 }], rows: [['Guide ops', 'Read']] },
      btn(16, 280, 160, 'Assign to space'),
      btn(create.x, create.y, create.w, 'Create role', 'primary'), btn(162, 400, 90, 'Cancel'),
      ...mark(create, 18),
    ],
  });
  figures.push({
    id: '08-create-role',
    alt: 'Create role page of Kibana 9.5 after the assignment: the Application layer - Kibana section lists the space Guide ops with the privilege Read; the Create role button is marked by callout 18',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 09: Create user (steps 20 to 25)
{
  const g = { user: { x: 16, y: 210, w: 500, h: 32 }, full: { x: 16, y: 274, w: 500, h: 32 }, pw: { x: 548, y: 210, w: 500, h: 32 }, pw2: { x: 548, y: 300, w: 500, h: 32 }, roles: { x: 548, y: 406, w: 500, h: 32 }, create: { x: 16, y: 480, w: 130, h: 32 } };
  const p = page({
    h: 560, crumbs: ['Stack Management', 'Users', 'Create'], title: 'Create user',
    body: () => [
      lbl(16, 180, 'Profile', { size: 'title', weight: 600, box: 300 }), lbl(548, 180, 'Password', { size: 'title', weight: 600, box: 300 }),
      { block: 'field', x: 16, y: 190, w: 500, label: 'Username', value: 'guide-viewer' },
      { block: 'field', x: 16, y: 254, w: 500, label: 'Full name', value: 'Guide Viewer' },
      { block: 'field', x: 16, y: 318, w: 500, label: 'Email address', placeholder: '' },
      { block: 'field', x: 548, y: 190, w: 500, label: 'Password', value: '*********************', hint: 'Password must be at least 6 characters.' },
      { block: 'field', x: 548, y: 280, w: 500, label: 'Confirm password', value: '*********************' },
      lbl(548, 376, 'Privileges', { size: 'title', weight: 600, box: 300 }),
      { block: 'field', x: 548, y: 386, w: 500, label: 'Roles', value: 'guide-bookshelf-viewer' },
      btn(g.create.x, g.create.y, g.create.w, 'Create user', 'primary'), btn(162, 480, 90, 'Cancel'),
      ...marks([[g.user, 20], [g.full, 21], [g.pw, 22], [g.pw2, 23], [g.roles, 24], [g.create, 25]]),
    ],
  });
  figures.push({
    id: '09-create-user',
    alt: 'Create user page of Kibana 9.5 with the Profile section (Username guide-viewer marked by callout 20, Full name Guide Viewer marked by callout 21), the Password section (Password marked by callout 22 and Confirm password marked by callout 23), the Privileges section with the role guide-bookshelf-viewer in the Roles field marked by callout 24, and the Create user button marked by callout 25',
    width: FW, height: 560, nodes: p.nodes,
  });
}

// 10: Saved objects, copy the data view to the space (steps 26 and 27)
{
  const act = { x: 946, y: 294, w: 44, h: 26 };
  const p = page({
    h: 440, crumbs: ['Stack Management', 'Saved objects'], title: 'Saved objects',
    body: () => [
      { block: 'field', x: 16, y: 176, w: 420, placeholder: 'Search...' },
      { block: 'table', x: 16, y: 232, w: 1048, columns: [{ title: 'Type', w: 2 }, { title: 'Title', w: 6 }, { title: 'Actions', w: 1 }], rows: [['dashboard', 'Bookshelf (guides)', '...'], ['data view', 'Bookshelf logs (guides)', '...']], selectedRow: 1 },
      ...mark(act, 27),
    ],
  });
  figures.push({
    id: '10-saved-objects',
    alt: 'Saved objects page of Kibana 9.5 listing the dashboard Bookshelf (guides) and the data view Bookshelf logs (guides); the Actions cell of the data view row is marked by callout 27',
    width: FW, height: 440, nodes: p.nodes,
  });
}

// 11: the account menu (step 29)
{
  const fr = kibanaFrame({ h: 340, crumbs: ['Home'] });
  const m = menu({ x: FW - 16 - 220, y: 52, w: 220, heading: 'elastic', items: ['Log out'], hot: 0 });
  fr.nodes[0].children.push(
    box(FW - 56, 8, 32, 32, { fill: 'series.1', radius: 16 }),
    lbl(FW - 40, 29, 'e', { weight: 600, anchor: 'middle', tone: 'textStrong', box: 20 }),
    ...m.nodes,
    ...mark(m.rows[0], 29),
  );
  figures.push({
    id: '11-account-menu',
    alt: 'Account menu of Kibana 9.5 open from the avatar at the right of the first bar with the user name elastic and the entry Log out, which is marked by callout 29',
    width: FW, height: 340, nodes: fr.nodes,
  });
}

// 12: the signed-in viewer in the space with the Observability navigation (What you build)
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Discover'] });
  const items = [
    { label: 'Overview' }, { label: 'Alerts' }, { label: 'SLOs' }, { label: 'Cases' }, { label: 'Streams' },
    { label: 'Logs', chevron: 'down' }, { label: 'Discover', indent: 1, active: true }, { label: 'Infrastructure', chevron: 'right' }, { label: 'Applications', chevron: 'right' },
  ];
  fr.nodes[0].children.push(
    box(48, 58, 28, 28, { fill: 'series.1', radius: 4 }),
    lbl(62, 78, 'G', { weight: 600, anchor: 'middle', tone: 'textStrong', box: 20 }),
    { block: 'nav', x: 0, y: 96, w: 220, h: 424, items, title: 'Observability' },
    { block: 'dropdown', x: 244, y: 112, w: 240, value: 'Bookshelf logs (guides)' },
    lbl(244, 176, 'Guide ops space, signed in as guide-viewer', { tone: 'textMuted', box: 500 }),
    { block: 'table', x: 244, y: 198, w: 820, columns: [{ title: '@timestamp', w: 2 }, { title: 'body.text', w: 4 }, { title: 'severity_text', w: 2 }], rows: [['10:42:07.114', 'Served /api/search', 'INFO'], ['10:42:06.882', 'Served /api/books', 'INFO'], ['10:42:06.351', 'Served /api/loans', 'INFO']] },
  );
  figures.push({
    id: '12-result',
    alt: 'Kibana 9.5 in the space Guide ops for the user guide-viewer: the left navigation is the Observability navigation with Overview, Alerts, SLOs, Cases, Streams, Logs, Infrastructure and Applications, and Discover shows the log records of the data view Bookshelf logs (guides)',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

void FW;
export default { product: 'kibana', guide: 'k18', figures };
