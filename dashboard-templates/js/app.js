/* ═══════════════════════════════════════════════════
   NEXUSIAM — APP CONTROLLER
   Navigation, Theme, Sidebar, Org Switcher, Toast, Init
═══════════════════════════════════════════════════ */

const App = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  theme: 'dark',
};

/* ─── NAVIGATION ─── */
function navigateTo(page) {
  if (!Pages[page]) {
    showToast(`Page "${page}" not found`, 'error');
    return;
  }

  App.currentPage = page;
  Pages._currentEntity = page;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update breadcrumb
  const labels = {
    dashboard: 'Dashboard',
    organizations: 'Organizations',
    projects: 'Projects',
    features: 'Features',
    roles: 'Roles',
    permissions: 'Permissions',
    profile: 'Profile',
  };

  document.getElementById('breadcrumbCurrent').textContent = labels[page] || page;

  // Render page
  renderPage(page);

  // Close mobile sidebar
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }

  // Close org dropdown
  closeOrgDropdown();
}

function renderPage(page) {
  const content = document.getElementById('pageContent');
  if (!Pages[page]) return;

  content.innerHTML = Pages[page]();

  // Run animations after render
  requestAnimationFrame(() => {
    animateStatBars();
    animateChartBars();
  });
}

/* ─── ANIMATIONS POST RENDER ─── */
function animateStatBars() {
  document.querySelectorAll('.stat-card-bar-fill[data-w]').forEach(el => {
    const w = el.dataset.w;
    setTimeout(() => { el.style.width = w + '%'; }, 100);
  });
}

function animateChartBars() {
  document.querySelectorAll('#weekBars .chart-bar-fill[data-h]').forEach((el, i) => {
    const h = el.dataset.h;
    setTimeout(() => { el.style.height = h + '%'; }, 200 + i * 60);
  });
}

/* ─── SIDEBAR ─── */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
  } else {
    App.sidebarCollapsed = !App.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', App.sidebarCollapsed);
  }
}

/* ─── THEME ─── */
function toggleTheme() {
  App.theme = App.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', App.theme);

  const btn = document.getElementById('themeToggleBtn');
  btn.innerHTML = App.theme === 'dark'
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';

  showToast(`Switched to ${App.theme} mode`, 'info');
}

/* ─── ORG SWITCHER ─── */
function buildOrgDropdown() {
  const list = document.getElementById('orgDropdownList');
  list.innerHTML = DB.organizations.map(org => `
    <div class="org-dropdown-item ${org.id === DB.currentOrg ? 'active' : ''}"
      onclick="switchOrg('${org.id}')">
      <div class="org-dropdown-item-avatar">${getOrgInitials(org.id)}</div>
      <div class="org-dropdown-item-name">${org.name}</div>
      ${org.id === DB.currentOrg ? '<i class="fa-solid fa-check" style="color:var(--primary);margin-left:auto;font-size:11px"></i>' : ''}
    </div>`).join('');
}

function toggleOrgDropdown() {
  const dropdown = document.getElementById('orgDropdown');
  const chevron = document.getElementById('orgChevron');
  const isOpen = dropdown.classList.contains('open');

  if (!isOpen) {
    buildOrgDropdown();
    dropdown.classList.add('open');
    chevron.classList.add('open');
  } else {
    closeOrgDropdown();
  }
}

function closeOrgDropdown() {
  document.getElementById('orgDropdown').classList.remove('open');
  document.getElementById('orgChevron').classList.remove('open');
}

function switchOrg(orgId) {
  DB.currentOrg = orgId;
  const org = DB.organizations.find(o => o.id === orgId);
  if (!org) return;

  document.getElementById('orgName').textContent = org.name;
  document.getElementById('orgAvatar').textContent = getOrgInitials(orgId);
  document.getElementById('orgAvatar').style.background = `linear-gradient(135deg, var(--accent), var(--primary))`;

  // Update header profile org
  const profileOrg = document.querySelector('.header-profile-org');
  if (profileOrg) profileOrg.textContent = org.name;

  closeOrgDropdown();
  showToast(`Switched to ${org.name}`, 'success');
  updateNavBadges();

  // Refresh page if on org-scoped page
  if (['projects', 'features'].includes(App.currentPage)) {
    renderPage(App.currentPage);
  }
}

/* ─── NAV BADGES ─── */
function updateNavBadges() {
  const el = id => document.getElementById(`badge-${id}`);

  if (el('organizations')) el('organizations').textContent = DB.organizations.length;
  if (el('projects'))      el('projects').textContent      = DB.projects.length;
  if (el('features'))      el('features').textContent      = DB.features.length;
  if (el('roles'))         el('roles').textContent         = DB.roles.length;
  if (el('permissions'))   el('permissions').textContent   = DB.abac.policies.filter(p => p.status === 'active').length;
}

/* ─── GLOBAL SEARCH ─── */
function handleSearch(val) {
  if (!val.trim()) return;

  // Optionally: redirect to search results
  // For now, show toast shortcut
  clearTimeout(App._searchDebounce);
  App._searchDebounce = setTimeout(() => {
    if (val.trim().length > 1) {
      // If on a list page, apply search
      const listPages = ['organizations', 'projects', 'features', 'roles'];
      if (listPages.includes(App.currentPage)) {
        searchList(App.currentPage, val);
        const si = document.getElementById(`search-${App.currentPage}`);
        if (si) si.value = val;
      }
    }
  }, 300);
}

/* ─── TOAST NOTIFICATIONS ─── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-message">${message}</div>
    </div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

/* ─── KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown', e => {
  // ⌘K / Ctrl+K — focus global search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
    document.getElementById('globalSearch').select();
  }

  // Escape — close search focus
  if (e.key === 'Escape') {
    const search = document.getElementById('globalSearch');
    if (document.activeElement === search) search.blur();
  }
});

/* ─── CLOSE DROPDOWNS ON OUTSIDE CLICK ─── */
document.addEventListener('click', e => {
  const switcher = document.getElementById('orgSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    closeOrgDropdown();
  }
});

/* ─── INIT ─── */
function initApp() {
  // Init org context
  const currentOrg = DB.organizations.find(o => o.id === DB.currentOrg);
  if (currentOrg) {
    document.getElementById('orgName').textContent = currentOrg.name;
    document.getElementById('orgAvatar').textContent = getOrgInitials(DB.currentOrg);
  }

  // Init nav badges
  updateNavBadges();

  // Init theme
  const savedTheme = localStorage.getItem('nexusiam-theme') || 'dark';
  App.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = App.theme === 'dark'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }

  // Navigate to initial page
  navigateTo('dashboard');

  // Welcome toast
  setTimeout(() => {
    showToast(`Welcome back, ${DB.currentUser.first_name}! 👋`, 'success');
  }, 800);
}

// Save theme on change
const _origToggleTheme = toggleTheme;
window.toggleTheme = function() {
  _origToggleTheme();
  localStorage.setItem('nexusiam-theme', App.theme);
};

document.addEventListener('DOMContentLoaded', initApp);
