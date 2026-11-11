// Figures of the Grafana guide G19, "Users, teams and folder permissions" (guide-users-teams-and-permissions.adoc).
// Facts: guides-brief/grafana-facts.md sections 1 (navigation tree), 2 (folder page), 0 (sign-in) and 13 (user, team and
// service account forms). A figure shows the screen the step starts from, with the control to act on highlighted; a typing
// step shows the typed value. Callout numbers are the step numbers of the page. Colours are theme tokens only.
// NOT VERIFIED in the lab, so not drawn: the user page (organization role), the team page (members), the folder
// permissions dialog and the service account forms and token dialog; their steps name the controls generically.
import { FW, lbl, box, btn, ico, mark, marks, grafanaFrame, G_NAV_W } from '../lib/shells.mjs';

const NW = 264;
const NAV_BASE = [['Bookmarks', 'star'], ['Starred', 'star'], ['Dashboards', 'dashboard'], ['Explore', 'explore'], ['Drilldown', 'search'], ['AI', 'apps'], ['Alerting', 'bell'], ['Connections', 'database'], ['Administration', 'gear']];
const ADMIN_KIDS = [
  { label: 'General', indent: 1 }, { label: 'Plugins and data', indent: 1 }, { label: 'Users and access', indent: 1 },
  { label: 'Users', indent: 2 }, { label: 'Teams', indent: 2 }, { label: 'Service accounts', indent: 2 },
  { label: 'Authentication', indent: 1 }, { label: 'Advisor', indent: 1 },
];

// The Grafana window with the docked navigation and one group open; `children` may be a function of the nav row boxes.
function navFrame({ h, crumbs, open, kids = [], active, children = [] }) {
  const items = [];
  const rows = {};
  let i = 0;
  for (const [label, icon] of NAV_BASE) {
    rows[label] = { x: 8, y: 48 + i * 34, w: NW - 16, h: 32 };
    i += 1;
    items.push({ label, icon, ...(label === open ? { chevron: 'down' } : {}) });
    if (label === open) {
      for (const k of kids) { rows[k.label] = { x: 8, y: 48 + i * 34, w: NW - 16, h: 32 }; i += 1; items.push(k); }
    }
  }
  const body = typeof children === 'function' ? children(rows) : children;
  return [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [
    { block: 'nav', x: 0, y: 0, w: NW, h, logo: 'si:grafana', title: 'Grafana', items, active },
    { block: 'toolbar', x: NW, y: 0, w: FW - NW, crumbs },
    ...body,
  ] }];
}
const head = (x, title, sub, subBox = 800) => [lbl(x, 104, title, { size: 'heading', weight: 500, box: 560 }), ...(sub ? [lbl(x, 132, sub, { tone: 'textMuted', box: subBox })] : [])];

const figures = [];

// 01: Administration > Users and access > Users, New user (steps 1 and 2)
{
  let newUser;
  figures.push({
    id: '01-users',
    alt: 'Users page of Grafana 13.3 with the Administration group of the navigation open: callout 1 marks Users under Users and access, and callout 2 marks the New user button; the group also lists Teams and Service accounts',
    width: FW, height: 660,
    nodes: navFrame({ h: 660, crumbs: ['Administration', 'Users and access', 'Users'], open: 'Administration', kids: ADMIN_KIDS, active: 'Users', children: (rows) => {
      newUser = { x: FW - 16 - 120, y: 70, w: 120, h: 32 };
      return [
        ...head(NW + 16, 'Users'),
        btn(newUser.x, newUser.y, 120, 'New user', 'primary', 'plus'),
        ...marks([[rows.Users, 1], [newUser, 2]]),
      ];
    } }),
  });
}

// 02: the New user form (steps 3 to 7)
{
  const g = { name: { x: 16, y: 170, w: 480, h: 32 }, email: { x: 16, y: 238, w: 480, h: 32 }, user: { x: 16, y: 306, w: 480, h: 32 }, pass: { x: 16, y: 374, w: 480, h: 32 }, create: { x: 16, y: 450, w: 130, h: 32 } };
  figures.push({
    id: '02-new-user',
    alt: 'New user form: the field Name holds Guide Viewer (callout 3), Email holds guide.viewer@example.com (callout 4), Username holds guide-viewer (callout 5), Password holds dots (callout 6) and the Create user button is marked by callout 7',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Administration', 'Users and access', 'Users', 'New user'], children: [
      ...head(16, 'New user', 'Create a new Grafana user.'),
      { block: 'field', x: 16, y: 150, w: 480, label: 'Name *', value: 'Guide Viewer' },
      { block: 'field', x: 16, y: 218, w: 480, label: 'Email', value: 'guide.viewer@example.com' },
      { block: 'field', x: 16, y: 286, w: 480, label: 'Username', value: 'guide-viewer' },
      { block: 'field', x: 16, y: 354, w: 480, label: 'Password *', value: '••••••••••' },
      btn(g.create.x, g.create.y, 130, 'Create user', 'primary'),
      ...marks([[g.name, 3], [g.email, 4], [g.user, 5], [g.pass, 6], [g.create, 7]]),
    ] }),
  });
}

// 03: the New team form (steps 10 to 12)
{
  const g = { name: { x: 16, y: 170, w: 480, h: 32 }, folder: { x: 16, y: 378, w: 270, h: 22 }, create: { x: 16, y: 450, w: 100, h: 32 } };
  figures.push({
    id: '03-new-team',
    alt: 'New team form: the field Name holds guide-team (callout 10), the Team folder option Auto-create a team folder is switched off (callout 11) and the Create button is marked by callout 12',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Administration', 'Users and access', 'Teams', 'New team'], children: [
      ...head(16, 'New team', 'Create a new team. Teams let you grant permissions to a group of users.'),
      { block: 'field', x: 16, y: 150, w: 480, label: 'Name *', value: 'guide-team' },
      { block: 'field', x: 16, y: 218, w: 480, label: 'Email', placeholder: '', hint: 'This is optional and is primarily used for allowing custom team avatars' },
      lbl(16, 332, 'Team folder', { weight: 500, box: 200 }),
      lbl(16, 354, 'This creates a folder associated with the team, where users can add resources like dashboards and schedules with the right permissions.', { size: 'small', tone: 'textMuted', box: 1000 }),
      { block: 'toggle', x: 16, y: 380, label: 'Auto-create a team folder', on: false, box: 230 },
      btn(g.create.x, g.create.y, 100, 'Create', 'primary'),
      ...marks([[g.name, 10], [g.folder, 11], [g.create, 12]]),
    ] }),
  });
}

// 04: the folder page and Folder actions (step 14)
{
  const actions = { x: FW - 16 - 8 - 70 - 8 - 150, y: 70, w: 150, h: 32 };
  figures.push({
    id: '04-folder-actions',
    alt: 'Folder page Guides with the tabs Dashboards, Panels and Alert rules and the dashboard Bookshelf (guides) listed; the Folder actions button at the top right is marked by callout 14',
    width: FW, height: 340,
    nodes: grafanaFrame({ h: 340, crumbs: ['Dashboards', 'Guides'], children: [
      lbl(16, 104, 'Guides', { size: 'heading', weight: 500, box: 300 }), ico(130, 88, 'edit'),
      btn(actions.x - 8 - 150, 70, 150, 'Recently deleted'), btn(actions.x, actions.y, 150, 'Folder actions', 'secondary', 'chevronDown'), btn(FW - 16 - 70, 70, 70, 'New', 'primary', 'chevronDown'),
      { block: 'tabs', x: 16, y: 148, w: 420, tabs: ['Dashboards', 'Panels', 'Alert rules'], active: 0 },
      { block: 'table', x: 16, y: 204, w: 1048, columns: [{ title: 'Name', w: 1 }], rows: [['Bookshelf (guides)']] },
      ...mark(actions, 14),
    ] }),
  });
}

// 05: the sign-in page with the new user (steps 18 to 20)
{
  const fx = 325, fw = 430;
  figures.push({
    id: '05-sign-in',
    alt: 'Sign-in page of Grafana 13.3 in a private window: the field Email or username holds guide-viewer (callout 18), the field Password holds dots (callout 19) and the Log in button is marked by callout 20',
    width: FW, height: 470,
    nodes: [{ block: 'window', x: 0, y: 0, w: FW, h: 470, radius: 0, children: [
      { block: 'logo', x: 514, y: 24, size: 52, key: 'si:grafana' },
      box(301, 96, 478, 350, { fill: 'surface', stroke: 'border', radius: 10 }),
      lbl(FW / 2, 144, 'Welcome to Grafana', { size: 'heading', anchor: 'middle', box: 420 }),
      { block: 'field', x: fx, y: 172, w: fw, label: 'Email or username', value: 'guide-viewer' },
      { block: 'field', x: fx, y: 238, w: fw, label: 'Password', value: '••••••••••' },
      btn(fx, 312, fw, 'Log in', 'primary'),
      lbl(FW / 2, 376, 'Forgot your password?', { size: 'small', tone: 'link', anchor: 'middle', box: 200 }),
      ...marks([[{ x: fx, y: 192, w: fw, h: 32 }, 18], [{ x: fx, y: 258, w: fw, h: 32 }, 19], [{ x: fx, y: 312, w: fw, h: 32 }, 20]]),
    ] }],
  });
}

// 06: the Dashboards page of the new user (steps 21 and 22)
{
  const row = { x: 244, y: 236 + 30 * 3, w: 800, h: 30 };
  figures.push({
    id: '06-dashboards-as-user',
    alt: 'Dashboards page of Grafana 13.3 signed in as guide-viewer: callout 21 marks Dashboards in the navigation, and callout 22 marks the folder Guides in the list, which has no folder bookshelf',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Dashboards'], nav: true, navActive: 'Dashboards', children: [
      lbl(244, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 140, 'Create and manage dashboards to visualize your data', { tone: 'textMuted', box: 520 }),
      { block: 'field', x: 244, y: 176, w: 420, placeholder: 'Search for dashboards and folders' },
      { block: 'table', x: 244, y: 236, w: 800, columns: [{ title: 'Name', w: 1 }], rows: [['Shared with me'], ['My team folders'], ['Guides']] },
      ...marks([[{ x: 8, y: 116, w: G_NAV_W - 16, h: 32 }, 21], [row, 22]]),
    ] }),
  });
}

// 07: Service accounts, empty (steps 24 and 25)
{
  const add = { x: 480, y: 290, w: 170, h: 32 };
  figures.push({
    id: '07-service-accounts',
    alt: 'Service accounts page with the filters All, With expired tokens and Disabled and the empty state You have not created any service accounts yet; the Add service account button is marked by callout 25',
    width: FW, height: 420,
    nodes: grafanaFrame({ h: 420, crumbs: ['Administration', 'Users and access', 'Service accounts'], children: [
      ...head(16, 'Service accounts', 'Service accounts and their tokens can be used to authenticate against the Grafana API.', 900),
      { block: 'chip', x: 16, y: 156, str: 'All' }, { block: 'chip', x: 56, y: 156, str: 'With expired tokens' }, { block: 'chip', x: 190, y: 156, str: 'Disabled' },
      lbl(FW / 2, 250, "You haven't created any service accounts yet", { weight: 500, anchor: 'middle', box: 420 }),
      btn(add.x + 0, add.y, 170, 'Add service account', 'primary', 'plus'),
      ...mark(add, 25),
    ] }),
  });
}

// 08: the dashboard seen by the new user, without Edit (What you build)
{
  const share = { x: FW - 16 - 90, y: 58, w: 90, h: 32 };
  figures.push({
    id: '08-result',
    alt: 'The dashboard Bookshelf (guides) seen by guide-viewer: the panel Requests per second by status is shown and the toolbar offers the time range, Refresh and Share but no Edit button',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      btn(share.x, 58, 90, 'Share', 'secondary', 'share'), btn(share.x - 8 - 110, 58, 110, 'Refresh', 'secondary', 'refresh'), btn(share.x - 8 - 110 - 8 - 150, 58, 150, 'Last 6 hours', 'secondary', 'clock'),
      { block: 'panel', x: 16, y: 106, w: 640, h: 300, title: 'Requests per second by status' },
      { block: 'line', x: 24, y: 132, w: 624, h: 270, series: [{ name: '200', points: [8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2, 8.6] }, { name: '404', points: [1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3, 1.2] }], min: 0, max: 10, yLabels: ['0', '2', '4', '6', '8', '10'], xLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] },
    ] }),
  });
}

export default { product: 'grafana', guide: 'g19', figures };
