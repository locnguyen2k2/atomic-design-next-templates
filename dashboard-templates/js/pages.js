/* ═══════════════════════════════════════════════════
   NEXUSIAM — PAGE RENDERERS
   Dashboard, Organizations, Projects, Features,
   Roles, Permissions, Profile pages
═══════════════════════════════════════════════════ */

const Pages = {};

/* ═══════════════════════════════════
   DASHBOARD
═══════════════════════════════════ */
Pages.dashboard = function() {
  const orgs = DB.organizations.length;
  const projs = DB.projects.length;
  const feats = DB.features.length;
  const roles = DB.roles.length;
  const currentOrgProjs = DB.projects.filter(p => p.organization_id === DB.currentOrg).length;
  const currentOrgFeats = DB.features.filter(f => f.organization_id === DB.currentOrg).length;

  const weekBars = [40, 65, 45, 80, 72, 55, 90].map((h, i) => `
    <div class="chart-bar-col">
      <div class="chart-bar-fill" style="height:0;background:var(--primary);transition:height 1.${i}s ease;border-radius:3px 3px 0 0" data-h="${h}"></div>
      <div class="chart-bar-label">${['M','T','W','T','F','S','S'][i]}</div>
    </div>`).join('');

  const activityHTML = DB.activity.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:var(--${a.color}-dim);color:var(--${a.color})">
        <i class="${a.icon}"></i>
      </div>
      <div class="activity-body">
        <div class="activity-title">${a.type.charAt(0).toUpperCase()+a.type.slice(1)} <strong>${a.name}</strong></div>
        <div class="activity-subtitle">${a.entity} · by ${a.user}</div>
      </div>
      <div class="activity-time">${a.time}</div>
    </div>`).join('');

  return `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back, ${DB.currentUser.first_name}! Here's what's happening across your systems.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary btn-sm" onclick="showToast('Refreshing data…','info')">
          <i class="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid stagger-children">
      ${statCard('fa-building','Organizations', orgs, 'primary', 78, '+2 this month')}
      ${statCard('fa-folder-open','Projects', projs, 'accent', 62, `${currentOrgProjs} in current org`)}
      ${statCard('fa-flag','Features', feats, 'success', 55, `${currentOrgFeats} in current org`)}
      ${statCard('fa-shield-halved','Roles', roles, 'violet', 90, 'ABAC configured')}
      ${statCard('fa-users','Active Users', 24, 'warning', 72, '+3 new this week')}
      ${statCard('fa-circle-dot','API Health', '99.8%', 'success', 99, 'All systems normal')}
    </div>

    <!-- Charts + Activity -->
    <div class="content-grid content-grid-2col">
      <!-- Weekly Activity Chart -->
      <div class="card animate-fade-up">
        <div class="card-header">
          <div>
            <div class="card-title">Weekly Activity</div>
            <div class="card-subtitle">API requests & events this week</div>
          </div>
          <span class="badge badge--success"><span class="status-dot status-dot--active"></span>Live</span>
        </div>
        <div class="card-body">
          <div class="chart-bars" id="weekBars">${weekBars}</div>
          <div style="display:flex;gap:16px;margin-top:14px;font-size:11px;color:var(--text-muted)">
            <span><span style="color:var(--primary)">●</span> Requests</span>
            <span style="margin-left:auto">Peak: Thursday</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card animate-fade-up">
        <div class="card-header">
          <div>
            <div class="card-title">Recent Activity</div>
            <div class="card-subtitle">Latest actions across all entities</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Full audit log coming soon','info')">
            View all <i class="fa-solid fa-arrow-right" style="font-size:10px"></i>
          </button>
        </div>
        <div class="card-body card-body--flush">
          <div class="activity-list" style="padding:4px 20px">${activityHTML}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card animate-fade-up" style="margin-top:20px">
      <div class="card-header">
        <div class="card-title">Quick Actions</div>
        <div class="card-subtitle">Jump straight to common tasks</div>
      </div>
      <div class="card-body">
        <div class="quick-actions-grid">
          ${quickAction('fa-building','New Org','primary',"openModal('create','organization')")}
          ${quickAction('fa-folder-plus','New Project','accent',"openModal('create','project')")}
          ${quickAction('fa-flag','New Feature','success',"openModal('create','feature')")}
          ${quickAction('fa-shield-halved','New Role','violet',"openModal('create','role')")}
          ${quickAction('fa-users','Manage Users','warning',"showToast('User management coming soon','info')")}
          ${quickAction('fa-key','Permissions','danger',"navigateTo('permissions')")}
        </div>
      </div>
    </div>`;
};

function statCard(icon, label, value, color, pct, hint) {
  return `
    <div class="stat-card animate-fade-up">
      <div class="stat-card-header">
        <div class="stat-card-icon stat-card-icon--${color}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <span class="stat-card-trend stat-card-trend--up">
          <i class="fa-solid fa-arrow-trend-up"></i> ${hint}
        </span>
      </div>
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
      <div class="stat-card-bar">
        <div class="stat-card-bar-fill" style="width:0" data-w="${pct}"></div>
      </div>
    </div>`;
}

function quickAction(icon, label, color, onclick) {
  return `
    <div class="quick-action-card" onclick="${onclick}">
      <div class="quick-action-icon" style="background:var(--${color}-dim);color:var(--${color})">
        <i class="fa-solid ${icon}"></i>
      </div>
      <span class="quick-action-label">${label}</span>
    </div>`;
}

/* ═══════════════════════════════════
   REUSABLE IAM LIST PAGE
═══════════════════════════════════ */
Pages._listState = {};

function renderListPage(config) {
  const { entity, title, subtitle, icon, color, columns, getData, badgeField } = config;

  const state = Pages._listState[entity] || { search: '', page: 1, limit: 6, sort: 'name', order: 'asc', orgFilter: '' };
  Pages._listState[entity] = state;

  let data = getData(state.orgFilter);
  data = filterBySearch(data, state.search);

  // Sort
  data = [...data].sort((a, b) => {
    const va = a[state.sort] || '';
    const vb = b[state.sort] || '';
    const cmp = va.localeCompare(vb);
    return state.order === 'asc' ? cmp : -cmp;
  });

  const paginated = paginateArray(data, state.page, state.limit);

  const showOrgFilter = (entity === 'projects' || entity === 'features');
  const orgFilterOptions = showOrgFilter ? DB.organizations.map(o =>
    `<option value="${o.id}" ${state.orgFilter === o.id ? 'selected' : ''}>${o.name}</option>`
  ).join('') : '';

  const skeletonRows = paginated.data.length === 0 ? '' :
    paginated.data.map(row => renderTableRow(row, entity, columns, badgeField)).join('');

  const emptyState = paginated.data.length === 0 ? `
    <tr><td colspan="${columns.length + 1}" style="padding:0">
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="empty-state-title">No ${title} Found</div>
        <div class="empty-state-message">${state.search ? `No results for "${state.search}". Try a different query.` : `No ${title.toLowerCase()} yet. Create your first one!`}</div>
        ${!state.search ? `<button class="btn btn-primary btn-sm" onclick="openModal('create','${entity.replace(/s$/, '')}')"><i class="fa-solid fa-plus"></i> Create ${entity.replace(/s$/, '')}</button>` : ''}
      </div>
    </td></tr>` : '';

  const colHeaders = columns.map(c =>
    `<th class="${c.sortable ? 'sortable' : ''}" onclick="${c.sortable ? `sortList('${entity}','${c.key}')` : ''}">${c.label}${c.sortable ? (state.sort === c.key ? (state.order==='asc' ? ' ↑' : ' ↓') : '') : ''}</th>`
  ).join('');

  const pageButtons = buildPageButtons(paginated);

  return `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title" style="display:flex;align-items:center;gap:10px">
          <span style="color:var(--${color})"><i class="fa-solid ${icon}"></i></span>
          ${title}
        </h1>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary btn-sm" onclick="refreshList('${entity}')">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
        <button class="btn btn-primary" onclick="openModal('create','${entity.replace(/s$/,'')}')">
          <i class="fa-solid fa-plus"></i> Create ${entity.replace(/s$/,'')}
        </button>
      </div>
    </div>

    <div class="data-table-wrapper">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-search">
          <i class="fa-solid fa-magnifying-glass toolbar-search-icon"></i>
          <input type="text" class="toolbar-search-input" id="search-${entity}"
            placeholder="Search ${title.toLowerCase()}…"
            value="${state.search}"
            oninput="searchList('${entity}',this.value)">
        </div>
        ${showOrgFilter ? `
        <select class="toolbar-select" onchange="filterListOrg('${entity}',this.value)">
          <option value="">All Organizations</option>
          ${orgFilterOptions}
        </select>` : ''}
        <select class="toolbar-select" onchange="changeSortList('${entity}',this.value)">
          <option value="name" ${state.sort==='name'?'selected':''}>Sort: Name</option>
          <option value="created_at" ${state.sort==='created_at'?'selected':''}>Sort: Created</option>
          <option value="updated_at" ${state.sort==='updated_at'?'selected':''}>Sort: Updated</option>
        </select>
        <select class="toolbar-select" onchange="changeOrderList('${entity}',this.value)">
          <option value="asc" ${state.order==='asc'?'selected':''}>↑ Ascending</option>
          <option value="desc" ${state.order==='desc'?'selected':''}>↓ Descending</option>
        </select>
        <div class="toolbar-spacer"></div>
        <span class="toolbar-results">${paginated.total} record${paginated.total!==1?'s':''}</span>
      </div>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr>
            ${colHeaders}
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${skeletonRows}
          ${emptyState}
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Showing ${Math.min((paginated.page-1)*paginated.limit+1, paginated.total)}–${Math.min(paginated.page*paginated.limit, paginated.total)} of ${paginated.total}
        </div>
        <div class="pagination-controls">${pageButtons}</div>
      </div>
    </div>`;
}

function renderTableRow(row, entity, columns, badgeField) {
  const cells = columns.map(col => {
    let val = row[col.key] || '—';

    if (col.type === 'slug') {
      return `<td><div class="table-cell-meta">
        <span class="table-cell-name">${row.name || '—'}</span>
        <span class="table-cell-slug">/${row.slug || ''}</span>
      </div></td>`;
    }

    if (col.type === 'org') {
      return `<td><span class="badge badge--primary">${getOrgName(val)}</span></td>`;
    }

    if (col.type === 'date') {
      return `<td><span class="table-cell-date">${formatDate(val)}</span></td>`;
    }

    if (col.type === 'desc') {
      return `<td style="max-width:260px;color:var(--text-secondary);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${val}</td>`;
    }

    return `<td>${val}</td>`;
  }).join('');

  const entitySingular = entity.replace(/s$/, '');

  return `
    <tr>
      ${cells}
      <td>
        <div class="table-cell-actions">
          <button class="table-action-btn table-action-btn--primary" title="View" onclick="openModal('view','${entitySingular}',getRecord('${entity}','${row.id}'))">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="table-action-btn" title="Edit" onclick="openModal('edit','${entitySingular}',getRecord('${entity}','${row.id}'))">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="table-action-btn" title="Copy ID" onclick="copyToClipboard('${row.id}')">
            <i class="fa-solid fa-copy"></i>
          </button>
          <button class="table-action-btn table-action-btn--danger" title="Delete" onclick="deleteRecord('${entity}','${row.id}','${row.name}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
}

function buildPageButtons(paginated) {
  let html = `<button class="page-btn" onclick="goToPage('${Pages._currentEntity}',${paginated.page-1})" ${!paginated.has_prev ? 'disabled' : ''}>
    <i class="fa-solid fa-chevron-left"></i>
  </button>`;

  for (let i = 1; i <= paginated.pages; i++) {
    if (paginated.pages > 7) {
      if (i > 2 && i < paginated.pages - 1 && Math.abs(i - paginated.page) > 1) {
        if (i === 3 || i === paginated.pages - 2) html += `<span class="page-btn" style="cursor:default">…</span>`;
        continue;
      }
    }
    html += `<button class="page-btn ${i === paginated.page ? 'active' : ''}" onclick="goToPage('${Pages._currentEntity}',${i})">${i}</button>`;
  }

  html += `<button class="page-btn" onclick="goToPage('${Pages._currentEntity}',${paginated.page+1})" ${!paginated.has_next ? 'disabled' : ''}>
    <i class="fa-solid fa-chevron-right"></i>
  </button>`;
  return html;
}

/* ─── LIST CONTROLS ─── */
let _searchTimeout;
function searchList(entity, val) {
  clearTimeout(_searchTimeout);
  _searchTimeout = setTimeout(() => {
    Pages._listState[entity] = { ...Pages._listState[entity], search: val, page: 1 };
    renderPage(entity);
  }, 280);
}

function sortList(entity, field) {
  const s = Pages._listState[entity];
  Pages._listState[entity] = { ...s, sort: field, order: s.sort === field && s.order === 'asc' ? 'desc' : 'asc', page: 1 };
  renderPage(entity);
}

function changeSortList(entity, val) {
  Pages._listState[entity] = { ...Pages._listState[entity], sort: val, page: 1 };
  renderPage(entity);
}

function changeOrderList(entity, val) {
  Pages._listState[entity] = { ...Pages._listState[entity], order: val, page: 1 };
  renderPage(entity);
}

function filterListOrg(entity, val) {
  Pages._listState[entity] = { ...Pages._listState[entity], orgFilter: val, page: 1 };
  renderPage(entity);
}

function goToPage(entity, page) {
  if (!entity) entity = Pages._currentEntity;
  Pages._listState[entity] = { ...Pages._listState[entity], page };
  renderPage(entity);
}

function refreshList(entity) {
  renderPage(entity);
  showToast('Refreshed', 'success');
}

/* ═══════════════════════════════════
   ORGANIZATIONS PAGE
═══════════════════════════════════ */
Pages.organizations = function() {
  Pages._currentEntity = 'organizations';
  return renderListPage({
    entity: 'organizations',
    title: 'Organizations',
    subtitle: 'Manage your multi-tenant organizations. All other resources are scoped to organizations.',
    icon: 'fa-building',
    color: 'primary',
    columns: [
      { key: 'name', label: 'Name / Slug', type: 'slug', sortable: true },
      { key: 'description', label: 'Description', type: 'desc', sortable: false },
      { key: 'created_at', label: 'Created', type: 'date', sortable: true },
      { key: 'updated_at', label: 'Updated', type: 'date', sortable: true },
    ],
    getData: () => DB.organizations
  });
};

/* ═══════════════════════════════════
   PROJECTS PAGE
═══════════════════════════════════ */
Pages.projects = function() {
  Pages._currentEntity = 'projects';
  return renderListPage({
    entity: 'projects',
    title: 'Projects',
    subtitle: 'Manage projects scoped to organizations. Projects group features and team resources.',
    icon: 'fa-folder-open',
    color: 'accent',
    columns: [
      { key: 'name', label: 'Name / Slug', type: 'slug', sortable: true },
      { key: 'organization_id', label: 'Organization', type: 'org', sortable: false },
      { key: 'description', label: 'Description', type: 'desc', sortable: false },
      { key: 'created_at', label: 'Created', type: 'date', sortable: true },
    ],
    getData: (orgFilter) => orgFilter ? DB.projects.filter(p => p.organization_id === orgFilter) : DB.projects
  });
};

/* ═══════════════════════════════════
   FEATURES PAGE
═══════════════════════════════════ */
Pages.features = function() {
  Pages._currentEntity = 'features';
  return renderListPage({
    entity: 'features',
    title: 'Features',
    subtitle: 'Manage feature flags scoped to organizations. Control feature rollouts and experiments.',
    icon: 'fa-flag',
    color: 'success',
    columns: [
      { key: 'name', label: 'Name / Slug', type: 'slug', sortable: true },
      { key: 'organization_id', label: 'Organization', type: 'org', sortable: false },
      { key: 'description', label: 'Description', type: 'desc', sortable: false },
      { key: 'created_at', label: 'Created', type: 'date', sortable: true },
    ],
    getData: (orgFilter) => orgFilter ? DB.features.filter(f => f.organization_id === orgFilter) : DB.features
  });
};

/* ═══════════════════════════════════
   ROLES PAGE
═══════════════════════════════════ */
Pages.roles = function() {
  Pages._currentEntity = 'roles';
  return renderListPage({
    entity: 'roles',
    title: 'Roles',
    subtitle: 'Define roles for your RBAC system. Assign permissions to roles and roles to users.',
    icon: 'fa-shield-halved',
    color: 'violet',
    columns: [
      { key: 'name', label: 'Name / Slug', type: 'slug', sortable: true },
      { key: 'organization_id', label: 'Organization', type: 'org', sortable: false },
      { key: 'description', label: 'Description', type: 'desc', sortable: false },
      { key: 'created_at', label: 'Created', type: 'date', sortable: true },
    ],
    getData: () => DB.roles
  });
};

/* ═══════════════════════════════════
   PERMISSIONS PAGE — ABAC
═══════════════════════════════════ */

/* ── ABAC State ── */
const ABAC = {
  activeTab: 'policies',
  policySearch: '',
  policyFilter: 'all',   // all | allow | deny | active | draft
  evalForm: {
    subject_role: 'developer',
    subject_dept: 'engineering',
    subject_clearance: 'internal',
    subject_mfa: 'true',
    subject_subscription: 'pro',
    subject_location: 'US',
    resource_type: 'feature',
    resource_sensitivity: 'medium',
    resource_env: 'staging',
    resource_owner: 'org-001',
    action: 'update',
    env_time: 'business_hours',
    env_network: 'corporate',
    env_risk: '20',
  },
  evalResult: null,
};

Pages.permissions = function() {
  Pages._currentEntity = 'permissions';
  return renderAbacPage();
};

function renderAbacPage() {
  const abac = DB.abac;
  const totalPolicies = abac.policies.length;
  const activePolicies = abac.policies.filter(p => p.status === 'active').length;
  const denyPolicies = abac.policies.filter(p => p.effect === 'deny').length;
  const allowPolicies = abac.policies.filter(p => p.effect === 'allow').length;

  const tabs = [
    { id: 'policies',     label: 'Policies',         icon: 'fa-scroll' },
    { id: 'attributes',   label: 'Attributes',       icon: 'fa-tags' },
    { id: 'evaluator',    label: 'Policy Evaluator',  icon: 'fa-flask' },
    { id: 'evallog',      label: 'Evaluation Log',    icon: 'fa-list-check' },
  ];

  const tabHTML = tabs.map(t => `
    <button class="abac-tab ${ABAC.activeTab === t.id ? 'abac-tab--active' : ''}"
      onclick="abacSwitchTab('${t.id}')">
      <i class="fa-solid ${t.icon}"></i>
      <span>${t.label}</span>
    </button>`).join('');

  let tabContent = '';
  if (ABAC.activeTab === 'policies')   tabContent = renderAbacPolicies();
  if (ABAC.activeTab === 'attributes') tabContent = renderAbacAttributes();
  if (ABAC.activeTab === 'evaluator')  tabContent = renderAbacEvaluator();
  if (ABAC.activeTab === 'evallog')    tabContent = renderAbacEvalLog();

  return `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title" style="display:flex;align-items:center;gap:10px">
          <span style="color:var(--primary)"><i class="fa-solid fa-shield-halved"></i></span>
          Permissions
          <span class="abac-arch-badge"><i class="fa-solid fa-tag"></i> ABAC</span>
        </h1>
        <p class="page-subtitle">Attribute-Based Access Control — define fine-grained policies using subject, resource, action, and context attributes.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary btn-sm" onclick="renderPage('permissions')">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
        <button class="btn btn-primary" onclick="abacOpenCreatePolicy()">
          <i class="fa-solid fa-plus"></i> New Policy
        </button>
      </div>
    </div>

    <!-- ABAC Stats Row -->
    <div class="abac-stats-row">
      ${abacStatPill('fa-scroll','Total Policies', totalPolicies, 'primary')}
      ${abacStatPill('fa-circle-check','Active', activePolicies, 'success')}
      ${abacStatPill('fa-circle-xmark','Deny Rules', denyPolicies, 'danger')}
      ${abacStatPill('fa-circle-plus','Allow Rules', allowPolicies, 'accent')}
      ${abacStatPill('fa-tags','Subject Attrs', abac.subjectAttributes.length, 'violet')}
      ${abacStatPill('fa-database','Resource Attrs', abac.resourceAttributes.length, 'warning')}
    </div>

    <!-- Tab Navigation -->
    <div class="abac-tabs-bar">
      ${tabHTML}
    </div>

    <!-- Tab Content -->
    <div class="abac-tab-content">
      ${tabContent}
    </div>`;
}

function abacStatPill(icon, label, val, color) {
  return `
    <div class="abac-stat-pill">
      <div class="abac-stat-pill-icon" style="background:var(--${color}-dim);color:var(--${color})">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="abac-stat-pill-body">
        <div class="abac-stat-pill-val">${val}</div>
        <div class="abac-stat-pill-label">${label}</div>
      </div>
    </div>`;
}

function abacSwitchTab(tab) {
  ABAC.activeTab = tab;
  renderPage('permissions');
}

/* ─── POLICIES TAB ─── */
function renderAbacPolicies() {
  let policies = [...DB.abac.policies];

  // Filter
  if (ABAC.policyFilter === 'allow')  policies = policies.filter(p => p.effect === 'allow');
  if (ABAC.policyFilter === 'deny')   policies = policies.filter(p => p.effect === 'deny');
  if (ABAC.policyFilter === 'active') policies = policies.filter(p => p.status === 'active');
  if (ABAC.policyFilter === 'draft')  policies = policies.filter(p => p.status === 'draft');

  // Search
  if (ABAC.policySearch) {
    const q = ABAC.policySearch.toLowerCase();
    policies = policies.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }

  // Sort by priority desc
  policies.sort((a, b) => b.priority - a.priority);

  const filterBtns = [
    { val:'all',    label:'All' },
    { val:'active', label:'Active' },
    { val:'draft',  label:'Draft' },
    { val:'allow',  label:'Allow' },
    { val:'deny',   label:'Deny' },
  ].map(f => `
    <button class="abac-filter-btn ${ABAC.policyFilter === f.val ? 'active' : ''}"
      onclick="abacSetPolicyFilter('${f.val}')">
      ${f.label}
    </button>`).join('');

  const policyCards = policies.length === 0
    ? `<div class="abac-empty"><i class="fa-solid fa-scroll"></i><div>No policies match your filter</div></div>`
    : policies.map(p => renderAbacPolicyCard(p)).join('');

  return `
    <div class="abac-toolbar">
      <div class="abac-toolbar-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search policies…" value="${ABAC.policySearch}"
          oninput="abacSearchPolicies(this.value)" />
      </div>
      <div class="abac-filter-group">${filterBtns}</div>
      <span class="abac-result-count">${policies.length} polic${policies.length !== 1 ? 'ies' : 'y'}</span>
    </div>
    <div class="abac-policy-list">
      ${policyCards}
    </div>`;
}

function renderAbacPolicyCard(p) {
  const effectClass = p.effect === 'allow' ? 'allow' : 'deny';
  const effectIcon  = p.effect === 'allow' ? 'fa-circle-check' : 'fa-circle-xmark';
  const statusClass = p.status === 'active' ? 'success' : 'muted';

  const subjectTags = p.subjects.map(s =>
    `<span class="abac-condition-tag abac-condition-tag--subject">
      <i class="fa-solid fa-user-tag"></i> ${s.attribute} ${s.operator} <strong>${Array.isArray(s.value) ? s.value.join(', ') : s.value}</strong>
    </span>`
  ).join('');

  const resourceTags = p.resources.map(r =>
    `<span class="abac-condition-tag abac-condition-tag--resource">
      <i class="fa-solid fa-database"></i> ${r.attribute} ${r.operator} <strong>${Array.isArray(r.value) ? r.value.join(', ') : r.value}</strong>
    </span>`
  ).join('');

  const conditionTags = p.conditions.length > 0
    ? p.conditions.map(c =>
        `<span class="abac-condition-tag abac-condition-tag--env">
          <i class="fa-solid fa-clock"></i> ${c.attribute} ${c.operator} <strong>${Array.isArray(c.value) ? c.value.join(', ') : c.value}</strong>
        </span>`
      ).join('')
    : `<span class="abac-condition-tag abac-condition-tag--none"><i class="fa-solid fa-minus"></i> No conditions</span>`;

  const actionBadges = p.actions.map(a =>
    `<span class="abac-action-badge abac-action-badge--${a}">${a}</span>`
  ).join('');

  return `
    <div class="abac-policy-card abac-policy-card--${effectClass}">
      <!-- Card Header -->
      <div class="abac-policy-card-header">
        <div class="abac-policy-effect-indicator abac-policy-effect-indicator--${effectClass}">
          <i class="fa-solid ${effectIcon}"></i>
          <span>${p.effect.toUpperCase()}</span>
        </div>
        <div class="abac-policy-title-group">
          <div class="abac-policy-name">${p.name}</div>
          <div class="abac-policy-desc">${p.description}</div>
        </div>
        <div class="abac-policy-meta-right">
          <div class="abac-priority-badge">
            <i class="fa-solid fa-arrow-up-9-1"></i> P${p.priority}
          </div>
          <span class="badge badge--${statusClass}" style="font-size:10px">${p.status}</span>
        </div>
        <div class="abac-policy-actions">
          <button class="table-action-btn table-action-btn--primary" title="Edit policy"
            onclick="abacEditPolicy('${p.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="table-action-btn" title="Duplicate"
            onclick="abacDuplicatePolicy('${p.id}')">
            <i class="fa-solid fa-copy"></i>
          </button>
          <button class="table-action-btn table-action-btn--danger" title="Delete"
            onclick="abacDeletePolicy('${p.id}','${p.name.replace(/'/g,"\\'") }')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- Card Body -->
      <div class="abac-policy-card-body">
        <!-- Subject Block -->
        <div class="abac-policy-block">
          <div class="abac-policy-block-label">
            <i class="fa-solid fa-user-tag"></i> Subject Attributes
          </div>
          <div class="abac-condition-tags">${subjectTags}</div>
        </div>

        <!-- Resource Block -->
        <div class="abac-policy-block">
          <div class="abac-policy-block-label">
            <i class="fa-solid fa-database"></i> Resource Attributes
          </div>
          <div class="abac-condition-tags">${resourceTags}</div>
        </div>

        <!-- Actions Block -->
        <div class="abac-policy-block">
          <div class="abac-policy-block-label">
            <i class="fa-solid fa-bolt"></i> Permitted Actions
          </div>
          <div class="abac-action-badges">${actionBadges}</div>
        </div>

        <!-- Conditions Block -->
        <div class="abac-policy-block">
          <div class="abac-policy-block-label">
            <i class="fa-solid fa-filter"></i> Context Conditions
          </div>
          <div class="abac-condition-tags">${conditionTags}</div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="abac-policy-card-footer">
        <span><i class="fa-solid fa-id-badge"></i> ${p.id}</span>
        <span><i class="fa-solid fa-user"></i> ${p.created_by}</span>
        <span><i class="fa-solid fa-calendar-days"></i> ${formatDate(p.updated_at)}</span>
        <button class="abac-simulate-btn" onclick="abacSimulatePolicy('${p.id}')">
          <i class="fa-solid fa-flask"></i> Simulate
        </button>
      </div>
    </div>`;
}

/* ─── ATTRIBUTES TAB ─── */
function renderAbacAttributes() {
  const renderAttrTable = (attrs, type, color, icon) => {
    const rows = attrs.map(a => `
      <tr>
        <td>
          <div class="abac-attr-name">
            <code class="abac-code">${a.name}</code>
          </div>
        </td>
        <td><span style="color:var(--text-primary);font-weight:600">${a.label}</span></td>
        <td>
          <span class="abac-type-badge abac-type-badge--${a.type}">${a.type}</span>
        </td>
        <td style="max-width:220px">
          ${a.values.length > 0
            ? a.values.map(v => `<span class="abac-val-chip">${v}</span>`).join('')
            : '<span style="color:var(--text-muted);font-size:11px">Free-form value</span>'
          }
        </td>
        <td style="color:var(--text-secondary);font-size:12px;max-width:200px">${a.description}</td>
        <td>
          <div class="table-cell-actions">
            <button class="table-action-btn table-action-btn--primary" title="Edit"
              onclick="showToast('Attribute editor coming soon','info')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="table-action-btn" title="Copy name"
              onclick="copyToClipboard('${a.name}')">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </td>
      </tr>`).join('');

    return `
      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div>
            <div class="card-title" style="display:flex;align-items:center;gap:8px">
              <span style="color:var(--${color})"><i class="fa-solid ${icon}"></i></span>
              ${type} Attributes
            </div>
            <div class="card-subtitle">Define the ${type.toLowerCase()} attributes used in ABAC policy rules</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Add attribute coming soon','info')">
            <i class="fa-solid fa-plus"></i> Add Attribute
          </button>
        </div>
        <div class="card-body card-body--flush" style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Attribute Key</th>
                <th>Display Label</th>
                <th>Type</th>
                <th>Allowed Values</th>
                <th>Description</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  };

  return `
    ${renderAttrTable(DB.abac.subjectAttributes,     'Subject',     'primary', 'fa-user-tag')}
    ${renderAttrTable(DB.abac.resourceAttributes,    'Resource',    'accent',  'fa-database')}
    ${renderAttrTable(DB.abac.environmentAttributes, 'Environment', 'warning', 'fa-cloud')}`;
}

/* ─── EVALUATOR TAB ─── */
function renderAbacEvaluator() {
  const f = ABAC.evalForm;

  const subjectAttrs = DB.abac.subjectAttributes;
  const resourceAttrs = DB.abac.resourceAttributes;
  const envAttrs = DB.abac.environmentAttributes;

  const resultHTML = ABAC.evalResult ? renderEvalResult(ABAC.evalResult) : `
    <div class="abac-eval-placeholder">
      <i class="fa-solid fa-flask"></i>
      <p>Fill in the attributes and click <strong>Evaluate</strong> to simulate a policy decision.</p>
    </div>`;

  function selField(key, label, values, currentVal) {
    const opts = values.map(v => `<option value="${v}" ${currentVal === v ? 'selected':''}>${v}</option>`).join('');
    return `
      <div class="abac-eval-field">
        <label class="abac-eval-label">${label}</label>
        <select class="abac-eval-select" onchange="abacEvalSet('${key}',this.value)">
          ${opts}
        </select>
      </div>`;
  }

  function txtField(key, label, placeholder, val) {
    return `
      <div class="abac-eval-field">
        <label class="abac-eval-label">${label}</label>
        <input type="text" class="abac-eval-input" placeholder="${placeholder}"
          value="${val}" oninput="abacEvalSet('${key}',this.value)" />
      </div>`;
  }

  return `
    <div class="abac-evaluator-layout">
      <!-- Input Panel -->
      <div class="abac-eval-panel">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fa-solid fa-user-tag" style="color:var(--primary)"></i> Subject Attributes</div>
              <div class="card-subtitle">Who is making the request?</div>
            </div>
          </div>
          <div class="card-body">
            ${selField('subject_role',         'Role',            DB.abac.subjectAttributes[0].values, f.subject_role)}
            ${selField('subject_dept',         'Department',      DB.abac.subjectAttributes[1].values, f.subject_dept)}
            ${selField('subject_clearance',    'Clearance Level', DB.abac.subjectAttributes[2].values, f.subject_clearance)}
            ${selField('subject_mfa',          'MFA Verified',    ['true','false'],                    f.subject_mfa)}
            ${selField('subject_subscription', 'Subscription',    DB.abac.subjectAttributes[4].values, f.subject_subscription)}
            ${txtField('subject_location',     'Location',        'e.g. US, EU, APAC',                f.subject_location)}
          </div>
        </div>

        <div class="card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fa-solid fa-database" style="color:var(--accent)"></i> Resource Attributes</div>
              <div class="card-subtitle">What resource is being accessed?</div>
            </div>
          </div>
          <div class="card-body">
            ${selField('resource_type',        'Resource Type',  DB.abac.resourceAttributes[0].values, f.resource_type)}
            ${selField('resource_sensitivity', 'Sensitivity',    DB.abac.resourceAttributes[1].values, f.resource_sensitivity)}
            ${selField('resource_env',         'Environment',    DB.abac.resourceAttributes[4].values, f.resource_env)}
            ${txtField('resource_owner',       'Owner Org ID',   'e.g. org-001',                       f.resource_owner)}
          </div>
        </div>

        <div class="card" style="margin-top:16px">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fa-solid fa-bolt" style="color:var(--warning)"></i> Action & Context</div>
              <div class="card-subtitle">What action and environment context?</div>
            </div>
          </div>
          <div class="card-body">
            ${selField('action',       'Action',        DB.abac.actions,                              f.action)}
            ${selField('env_time',     'Time of Day',   DB.abac.environmentAttributes[0].values,      f.env_time)}
            ${selField('env_network',  'Network Zone',  DB.abac.environmentAttributes[2].values,      f.env_network)}
            ${txtField('env_risk',     'Risk Score',    '0–100',                                      f.env_risk)}
          </div>
        </div>

        <button class="btn btn-primary" style="width:100%;margin-top:16px;justify-content:center;padding:12px"
          onclick="abacRunEvaluator()">
          <i class="fa-solid fa-flask"></i> Evaluate Policy Decision
        </button>
      </div>

      <!-- Result Panel -->
      <div class="abac-eval-result-panel">
        <div class="card" style="height:100%">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fa-solid fa-scale-balanced" style="color:var(--violet)"></i> Decision Engine Output</div>
              <div class="card-subtitle">Real-time ABAC policy evaluation result</div>
            </div>
            ${ABAC.evalResult ? `<button class="btn btn-ghost btn-sm" onclick="ABAC.evalResult=null;renderPage('permissions')"><i class="fa-solid fa-xmark"></i> Clear</button>` : ''}
          </div>
          <div class="card-body">
            ${resultHTML}
          </div>
        </div>
      </div>
    </div>`;
}

function renderEvalResult(result) {
  const isAllow = result.decision === 'allow';
  return `
    <div class="abac-eval-result abac-eval-result--${isAllow ? 'allow' : 'deny'}">
      <div class="abac-eval-result-icon">
        <i class="fa-solid ${isAllow ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
      </div>
      <div class="abac-eval-result-decision">${result.decision.toUpperCase()}</div>
      <div class="abac-eval-result-reason">${result.reason}</div>
    </div>

    ${result.matchedPolicies.length > 0 ? `
    <div class="abac-eval-matched">
      <div class="abac-eval-matched-title">
        <i class="fa-solid fa-list-check"></i> Evaluated Policies (${result.matchedPolicies.length} matched)
      </div>
      ${result.matchedPolicies.map(m => `
        <div class="abac-eval-match-row abac-eval-match-row--${m.effect}">
          <span class="abac-eval-match-effect"><i class="fa-solid ${m.effect === 'allow' ? 'fa-check' : 'fa-xmark'}"></i> ${m.effect}</span>
          <span class="abac-eval-match-name">${m.name}</span>
          <span class="abac-eval-match-priority">P${m.priority}</span>
          ${m.applied ? '<span class="abac-eval-applied-badge">Applied</span>' : ''}
        </div>`).join('')}
    </div>` : ''}

    <div class="abac-eval-context">
      <div class="abac-eval-context-title"><i class="fa-solid fa-info-circle"></i> Evaluation Context</div>
      <div class="abac-eval-context-grid">
        ${Object.entries(result.context).map(([k,v]) => `
          <div class="abac-eval-ctx-row">
            <span class="abac-eval-ctx-key">${k}</span>
            <span class="abac-eval-ctx-val">${v}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ─── EVAL LOG TAB ─── */
function renderAbacEvalLog() {
  const rows = DB.abac.evalLog.map(l => {
    const isAllow = l.result === 'allow';
    return `
      <tr>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${formatDateTime(l.ts)}</td>
        <td><strong style="color:var(--text-primary)">${l.subject}</strong></td>
        <td><span class="abac-action-badge abac-action-badge--${l.action}">${l.action}</span></td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary)">${l.resource}</td>
        <td>
          <span class="abac-eval-log-result abac-eval-log-result--${l.result}">
            <i class="fa-solid ${isAllow ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${l.result.toUpperCase()}
          </span>
        </td>
        <td>
          <span class="badge badge--muted" style="font-size:10px">${l.policy}</span>
        </td>
        <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${l.duration_ms}ms</td>
      </tr>`;
  }).join('');

  const allow = DB.abac.evalLog.filter(l => l.result === 'allow').length;
  const deny  = DB.abac.evalLog.filter(l => l.result === 'deny').length;
  const avgMs = Math.round(DB.abac.evalLog.reduce((s,l) => s + l.duration_ms, 0) / DB.abac.evalLog.length);

  return `
    <div class="abac-stats-row" style="margin-bottom:16px">
      ${abacStatPill('fa-circle-check', 'Allow Decisions', allow, 'success')}
      ${abacStatPill('fa-circle-xmark', 'Deny Decisions', deny, 'danger')}
      ${abacStatPill('fa-clock', 'Avg Latency', avgMs+'ms', 'primary')}
      ${abacStatPill('fa-list', 'Total Evaluated', DB.abac.evalLog.length, 'violet')}
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title"><i class="fa-solid fa-list-check" style="color:var(--violet)"></i> Policy Evaluation Log</div>
          <div class="card-subtitle">Real-time access decision audit trail — each request evaluated against ABAC policies</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Exporting log…','info')">
          <i class="fa-solid fa-download"></i> Export
        </button>
      </div>
      <div class="card-body card-body--flush" style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Subject</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Decision</th>
              <th>Matched Policy</th>
              <th style="text-align:right">Latency</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <!-- ABAC Architecture Info -->
    <div class="card" style="margin-top:20px">
      <div class="card-header">
        <div class="card-title"><i class="fa-solid fa-diagram-project" style="color:var(--primary)"></i> ABAC Architecture</div>
        <div class="card-subtitle">How the policy decision engine evaluates access requests</div>
      </div>
      <div class="card-body">
        <div class="abac-arch-diagram">
          ${abacArchStep('fa-user','Subject','role, dept, clearance, mfa, subscription','primary')}
          <div class="abac-arch-arrow"><i class="fa-solid fa-plus"></i></div>
          ${abacArchStep('fa-database','Resource','type, sensitivity, environment, owner','accent')}
          <div class="abac-arch-arrow"><i class="fa-solid fa-plus"></i></div>
          ${abacArchStep('fa-bolt','Action','create, read, update, delete, export, admin','warning')}
          <div class="abac-arch-arrow"><i class="fa-solid fa-plus"></i></div>
          ${abacArchStep('fa-cloud','Environment','time, network zone, ip range, risk score','violet')}
          <div class="abac-arch-arrow"><i class="fa-solid fa-arrow-right"></i></div>
          ${abacArchStep('fa-scale-balanced','PDP Engine','evaluates policies, returns ALLOW or DENY','success')}
        </div>
      </div>
    </div>`;
}

function abacArchStep(icon, title, desc, color) {
  return `
    <div class="abac-arch-step">
      <div class="abac-arch-step-icon" style="background:var(--${color}-dim);color:var(--${color})">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="abac-arch-step-title">${title}</div>
      <div class="abac-arch-step-desc">${desc}</div>
    </div>`;
}

/* ─── ABAC CONTROL HANDLERS ─── */
function abacSearchPolicies(val) {
  ABAC.policySearch = val;
  renderPage('permissions');
}

function abacSetPolicyFilter(val) {
  ABAC.policyFilter = val;
  renderPage('permissions');
}

function abacEvalSet(key, val) {
  ABAC.evalForm[key] = val;
}

function abacRunEvaluator() {
  const f = ABAC.evalForm;
  const context = {
    'subject.role':         f.subject_role,
    'subject.department':   f.subject_dept,
    'subject.clearance':    f.subject_clearance,
    'subject.mfa_verified': f.subject_mfa,
    'subject.subscription': f.subject_subscription,
    'resource.type':        f.resource_type,
    'resource.sensitivity': f.resource_sensitivity,
    'resource.environment': f.resource_env,
    'resource.owner_org':   f.resource_owner,
    'action':               f.action,
    'env.time_of_day':      f.env_time,
    'env.network_zone':     f.env_network,
    'env.risk_score':       f.env_risk,
  };

  const policies = [...DB.abac.policies]
    .filter(p => p.status === 'active')
    .sort((a, b) => b.priority - a.priority);

  const matchedPolicies = [];
  let finalDecision = null;
  let appliedPolicy  = null;

  for (const pol of policies) {
    // Check if action matches
    if (!pol.actions.includes(f.action)) continue;

    // Simple attribute matching simulation
    const subjectMatch  = pol.subjects.every(s  => simulateAttrMatch(s,  f, 'subject'));
    const resourceMatch = pol.resources.every(r  => simulateAttrMatch(r,  f, 'resource'));
    const conditionMatch = pol.conditions.length === 0 ||
                           pol.conditions.every(c => simulateEnvMatch(c, f));

    const matched = subjectMatch && resourceMatch && conditionMatch;
    matchedPolicies.push({ ...pol, matched, applied: false });

    if (matched && !finalDecision) {
      finalDecision = pol.effect;
      appliedPolicy  = pol;
    }
  }

  // Mark applied
  if (appliedPolicy) {
    const idx = matchedPolicies.findIndex(m => m.id === appliedPolicy.id);
    if (idx > -1) matchedPolicies[idx].applied = true;
  }

  const filteredMatched = matchedPolicies.filter(m => m.matched);
  const decision = finalDecision || 'deny';
  const reason = appliedPolicy
    ? `Policy "${appliedPolicy.name}" (${appliedPolicy.id}) matched and returned ${decision.toUpperCase()}.`
    : 'No matching policy found. Default decision: DENY (implicit deny).';

  ABAC.evalResult = { decision, reason, matchedPolicies: filteredMatched, context };

  // Add to log
  DB.abac.evalLog.unshift({
    id: `log-${Date.now()}`,
    ts: new Date().toISOString(),
    subject: `${f.subject_role}@${f.subject_dept}`,
    action: f.action,
    resource: `${f.resource_type}:sim-${Math.random().toString(36).slice(2,7)}`,
    result: decision,
    policy: appliedPolicy ? appliedPolicy.id : 'none',
    duration_ms: Math.floor(Math.random() * 8) + 2,
  });
  if (DB.abac.evalLog.length > 20) DB.abac.evalLog.pop();

  renderPage('permissions');
  showToast(`Decision: ${decision.toUpperCase()} — ${appliedPolicy ? appliedPolicy.name : 'Implicit deny'}`,
    decision === 'allow' ? 'success' : 'error');
}

function simulateAttrMatch(rule, f, prefix) {
  const attrMap = {
    'role':          f.subject_role,
    'department':    f.subject_dept,
    'clearance':     f.subject_clearance,
    'mfa_verified':  f.subject_mfa,
    'subscription':  f.subject_subscription,
    'resource_type': f.resource_type,
    'sensitivity':   f.resource_sensitivity,
    'environment':   f.resource_env,
    'owner_org':     f.resource_owner,
    'status':        'active',
  };
  const val = attrMap[rule.attribute];
  if (val === undefined) return true; // attribute not simulated → skip

  const ruleVal = rule.value;
  if (rule.value && typeof rule.value === 'string' && rule.value.startsWith('${')) return true; // dynamic ref, skip

  switch (rule.operator) {
    case 'equals':     return val === ruleVal;
    case 'not_equals': return val !== ruleVal;
    case 'in':         return Array.isArray(ruleVal) && ruleVal.includes(val);
    case 'not_in':     return Array.isArray(ruleVal) && !ruleVal.includes(val);
    default:           return true;
  }
}

function simulateEnvMatch(rule, f) {
  const envMap = {
    'time_of_day':   f.env_time,
    'network_zone':  f.env_network,
    'ip_range':      '10.0.0.0/8',
    'risk_score':    f.env_risk,
    'mfa_verified':  f.subject_mfa,
  };
  const val = envMap[rule.attribute];
  if (val === undefined) return true;

  switch (rule.operator) {
    case 'equals':     return String(val) === String(rule.value);
    case 'not_equals': return String(val) !== String(rule.value);
    case 'in':         return Array.isArray(rule.value) && rule.value.includes(val);
    default:           return true;
  }
}

function abacOpenCreatePolicy() {
  openAbacPolicyModal('create', null);
}

function abacEditPolicy(id) {
  const pol = DB.abac.policies.find(p => p.id === id);
  if (pol) openAbacPolicyModal('edit', pol);
}

function abacDuplicatePolicy(id) {
  const orig = DB.abac.policies.find(p => p.id === id);
  if (!orig) return;
  const clone = JSON.parse(JSON.stringify(orig));
  clone.id = `pol-${Math.random().toString(36).slice(2,9)}`;
  clone.name = `${orig.name} (Copy)`;
  clone.status = 'draft';
  clone.created_at = new Date().toISOString();
  clone.updated_at = new Date().toISOString();
  DB.abac.policies.push(clone);
  showToast(`Policy duplicated as draft`, 'success');
  renderPage('permissions');
}

function abacDeletePolicy(id, name) {
  openConfirm(
    'Delete Policy',
    `Are you sure you want to delete policy "${name}"? This action cannot be undone.`,
    () => {
      const idx = DB.abac.policies.findIndex(p => p.id === id);
      if (idx > -1) DB.abac.policies.splice(idx, 1);
      showToast(`Policy deleted`, 'warning');
      renderPage('permissions');
    }
  );
}

function abacSimulatePolicy(id) {
  ABAC.activeTab = 'evaluator';
  renderPage('permissions');
  showToast('Switched to Policy Evaluator — configure attributes and evaluate', 'info');
}

function openAbacPolicyModal(mode, pol) {
  const isEdit = mode === 'edit';
  const effects = ['allow','deny'].map(e =>
    `<option value="${e}" ${pol && pol.effect === e ? 'selected':''}>${e.charAt(0).toUpperCase()+e.slice(1)}</option>`
  ).join('');
  const statuses = ['active','draft'].map(s =>
    `<option value="${s}" ${pol && pol.status === s ? 'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
  ).join('');
  const actions = DB.abac.actions.map(a =>
    `<label class="abac-check-label">
      <input type="checkbox" value="${a}" ${pol && pol.actions.includes(a) ? 'checked':''} id="pol-act-${a}">
      <span>${a}</span>
    </label>`
  ).join('');

  const bodyHTML = `
    <div class="form-group">
      <label class="form-label">Policy Name *</label>
      <input type="text" class="form-input" id="pol-name"
        placeholder="e.g. Developer Read Access" value="${isEdit ? pol.name : ''}">
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-input form-textarea" id="pol-desc"
        placeholder="Describe what this policy allows or denies…" rows="2">${isEdit ? pol.description : ''}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Effect *</label>
        <select class="form-input form-select" id="pol-effect">${effects}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-input form-select" id="pol-status">${statuses}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority (0–100)</label>
        <input type="number" class="form-input" id="pol-priority" min="0" max="100"
          value="${isEdit ? pol.priority : 50}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Permitted Actions</label>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">${actions}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Subject Rule (JSON array)</label>
      <textarea class="form-input form-textarea form-textarea--mono" id="pol-subjects" rows="3"
        placeholder='[{"attribute":"role","operator":"equals","value":"developer"}]'>${isEdit ? JSON.stringify(pol.subjects, null, 2) : ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Resource Rule (JSON array)</label>
      <textarea class="form-input form-textarea form-textarea--mono" id="pol-resources" rows="3"
        placeholder='[{"attribute":"resource_type","operator":"in","value":["project","feature"]}]'>${isEdit ? JSON.stringify(pol.resources, null, 2) : ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Context Conditions (JSON array)</label>
      <textarea class="form-input form-textarea form-textarea--mono" id="pol-conditions" rows="3"
        placeholder='[{"attribute":"mfa_verified","operator":"equals","value":"true"}]'>${isEdit ? JSON.stringify(pol.conditions, null, 2) : ''}</textarea>
    </div>`;

  // Use existing modal infrastructure
  document.getElementById('modalModeBadge').textContent = isEdit ? 'EDIT' : 'CREATE';
  document.getElementById('modalTitle').textContent = isEdit ? 'Edit ABAC Policy' : 'Create ABAC Policy';
  document.getElementById('modalSubtitle').textContent = isEdit
    ? `Editing: ${pol.name}` : 'Define a new attribute-based access control policy';
  document.getElementById('modalTabs').style.display = 'none';
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalDeleteBtn').style.display = isEdit ? 'block' : 'none';
  document.getElementById('modalSaveBtnLabel').textContent = isEdit ? 'Update Policy' : 'Create Policy';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Override save
  window._abacSavePol = function() {
    const name = document.getElementById('pol-name').value.trim();
    if (!name) { showToast('Policy name is required', 'error'); return; }

    let subjects, resources, conditions;
    try {
      subjects   = JSON.parse(document.getElementById('pol-subjects').value   || '[]');
      resources  = JSON.parse(document.getElementById('pol-resources').value  || '[]');
      conditions = JSON.parse(document.getElementById('pol-conditions').value || '[]');
    } catch(e) {
      showToast('Invalid JSON in rules or conditions', 'error');
      return;
    }

    const selectedActions = DB.abac.actions.filter(a =>
      document.getElementById(`pol-act-${a}`)?.checked
    );
    if (selectedActions.length === 0) { showToast('Select at least one action', 'error'); return; }

    const now = new Date().toISOString();
    if (isEdit) {
      Object.assign(pol, {
        name,
        description: document.getElementById('pol-desc').value.trim(),
        effect:      document.getElementById('pol-effect').value,
        status:      document.getElementById('pol-status').value,
        priority:    parseInt(document.getElementById('pol-priority').value) || 50,
        actions:     selectedActions,
        subjects,
        resources,
        conditions,
        updated_at:  now,
      });
      showToast('Policy updated', 'success');
    } else {
      DB.abac.policies.push({
        id:          `pol-${Math.random().toString(36).slice(2,9)}`,
        name,
        description: document.getElementById('pol-desc').value.trim(),
        effect:      document.getElementById('pol-effect').value,
        status:      document.getElementById('pol-status').value,
        priority:    parseInt(document.getElementById('pol-priority').value) || 50,
        actions:     selectedActions,
        subjects,
        resources,
        conditions,
        created_at:  now,
        updated_at:  now,
        created_by:  DB.currentUser.username,
      });
      showToast('Policy created', 'success');
    }

    closeModal();
    renderPage('permissions');
  };

  document.getElementById('modalSaveBtn').onclick = window._abacSavePol;
  if (isEdit) {
    document.getElementById('modalDeleteBtn').onclick = () => {
      closeModal();
      abacDeletePolicy(pol.id, pol.name);
    };
  }
}

function getResourceIcon(res) {
  const map = { organizations:'fa-building', projects:'fa-folder-open', features:'fa-flag', roles:'fa-shield-halved', users:'fa-users' };
  return map[res] || 'fa-circle';
}

/* ═══════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════ */
Pages.profile = function() {
  Pages._currentEntity = 'profile';
  const u = DB.currentUser;

  return `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">Profile</h1>
        <p class="page-subtitle">Your account details and session information.</p>
      </div>
    </div>

    <div class="profile-hero">
      <div class="profile-avatar">${u.first_name[0]}${u.last_name[0]}</div>
      <div class="profile-info">
        <div class="profile-name">${u.first_name} ${u.last_name}</div>
        <div class="profile-email">${u.email}</div>
        <div class="profile-badges">
          <span class="badge badge--primary"><i class="fa-solid fa-shield-halved"></i> ${u.role}</span>
          <span class="badge badge--success"><span class="status-dot status-dot--active"></span>${u.status}</span>
          <span class="badge badge--muted"><i class="fa-solid fa-at"></i> ${u.username}</span>
        </div>
      </div>
      <button class="btn btn-secondary" style="margin-left:auto;z-index:1" onclick="showToast('Profile editing coming soon','info')">
        <i class="fa-solid fa-pen"></i> Edit Profile
      </button>
    </div>

    <div class="content-grid content-grid-2col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Account Details</div>
        </div>
        <div class="card-body">
          <div class="meta-list">
            <div class="meta-item"><span class="meta-key">User ID</span><span class="meta-value copy-pill" onclick="copyToClipboard('${u.id}')" title="Copy"><i class="fa-solid fa-copy"></i> ${u.id}</span></div>
            <div class="meta-divider"></div>
            <div class="meta-item"><span class="meta-key">Username</span><span class="meta-value">@${u.username}</span></div>
            <div class="meta-item"><span class="meta-key">Email</span><span class="meta-value">${u.email}</span></div>
            <div class="meta-item"><span class="meta-key">First Name</span><span class="meta-value">${u.first_name}</span></div>
            <div class="meta-item"><span class="meta-key">Last Name</span><span class="meta-value">${u.last_name}</span></div>
            <div class="meta-divider"></div>
            <div class="meta-item"><span class="meta-key">Status</span><span class="badge badge--success">${u.status}</span></div>
            <div class="meta-item"><span class="meta-key">Role</span><span class="badge badge--primary">${u.role}</span></div>
            <div class="meta-divider"></div>
            <div class="meta-item"><span class="meta-key">Joined</span><span class="meta-value">${formatDateTime(u.created_at)}</span></div>
            <div class="meta-item"><span class="meta-key">Last Updated</span><span class="meta-value">${formatDateTime(u.updated_at)}</span></div>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><div class="card-title">Session</div></div>
          <div class="card-body">
            <div class="meta-list">
              <div class="meta-item"><span class="meta-key">API Base</span><span class="meta-value" style="font-family:var(--font-mono);font-size:10px">localhost:3004/apis/v1</span></div>
              <div class="meta-item"><span class="meta-key">Auth</span><span class="badge badge--success">Bearer JWT</span></div>
              <div class="meta-item"><span class="meta-key">Token Status</span><span class="badge badge--success"><span class="status-dot status-dot--active"></span>Valid</span></div>
              <div class="meta-item"><span class="meta-key">Expires In</span><span class="meta-value">3600s</span></div>
            </div>
            <button class="btn btn-secondary btn-sm" style="margin-top:14px;width:100%" onclick="showToast('Token refreshed!','success')">
              <i class="fa-solid fa-arrows-rotate"></i> Refresh Token
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Current Context</div></div>
          <div class="card-body">
            <div class="meta-list">
              <div class="meta-item"><span class="meta-key">Organization</span><span class="badge badge--primary">${getOrgName(DB.currentOrg)}</span></div>
              <div class="meta-item"><span class="meta-key">Org ID</span><span class="meta-value copy-pill" onclick="copyToClipboard('${DB.currentOrg}')"><i class="fa-solid fa-copy"></i> ${DB.currentOrg}</span></div>
              <div class="meta-item"><span class="meta-key">Projects</span><span class="meta-value">${DB.projects.filter(p=>p.organization_id===DB.currentOrg).length}</span></div>
              <div class="meta-item"><span class="meta-key">Features</span><span class="meta-value">${DB.features.filter(f=>f.organization_id===DB.currentOrg).length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

/* ─── HELPERS for pages ─── */
function getRecord(entity, id) {
  return DB[entity].find(r => r.id === id) || null;
}

function deleteRecord(entity, id, name) {
  openConfirm(
    `Delete ${entity.replace(/s$/, '')}`,
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    () => {
      const idx = DB[entity].findIndex(r => r.id === id);
      if (idx > -1) DB[entity].splice(idx, 1);
      showToast(`${entity.replace(/s$/, '')} deleted.`, 'warning');
      renderPage(App.currentPage);
    }
  );
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Could not copy', 'error');
  });
}
