/* ═══════════════════════════════════════════════════
   NEXUSIAM — MODAL / DRAWER SYSTEM
   Draggable, resizable, tabbed create/view/edit drawer
═══════════════════════════════════════════════════ */

const Modal = {
  mode: 'create',       // 'create' | 'view' | 'edit'
  entity: null,         // 'organization' | 'project' | 'feature' | 'role'
  data: null,           // current record
  currentTab: 'general',
  isDragging: false,
  dragStartX: 0,
  drawerStartWidth: 0,
  pendingDelete: null,
  onSaveCallback: null,
  onDeleteCallback: null,
};

/* ─── OPEN / CLOSE ─── */
function openModal(mode, entity, record = null, opts = {}) {
  Modal.mode = mode;
  Modal.entity = entity;
  Modal.data = record ? { ...record } : {};
  Modal.currentTab = 'general';
  Modal.onSaveCallback = opts.onSave || null;
  Modal.onDeleteCallback = opts.onDelete || null;

  const overlay = document.getElementById('modalOverlay');
  const drawer = document.getElementById('modalDrawer');

  // Reset drawer width
  drawer.style.width = '';

  updateModalHeader();
  renderModalBody();
  setupModalTabs();

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus first input
  setTimeout(() => {
    const first = drawer.querySelector('input:not([readonly]):not([disabled])');
    if (first) first.focus();
  }, 350);
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const drawer = document.getElementById('modalDrawer');
  drawer.style.animation = 'none';
  drawer.style.transform = 'translateX(100%)';
  drawer.style.opacity = '0';
  drawer.style.transition = 'transform 0.25s ease, opacity 0.25s ease';

  setTimeout(() => {
    overlay.classList.remove('open');
    drawer.style.transform = '';
    drawer.style.opacity = '';
    drawer.style.transition = '';
    drawer.style.animation = '';
    document.body.style.overflow = '';
    Modal.data = null;
    Modal.entity = null;
  }, 250);
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

/* ─── HEADER ─── */
function updateModalHeader() {
  const badge = document.getElementById('modalModeBadge');
  const title = document.getElementById('modalTitle');
  const subtitle = document.getElementById('modalSubtitle');
  const saveBtn = document.getElementById('modalSaveBtn');
  const saveLbl = document.getElementById('modalSaveBtnLabel');
  const deleteBtn = document.getElementById('modalDeleteBtn');
  const entityLabel = Modal.entity ? Modal.entity.charAt(0).toUpperCase() + Modal.entity.slice(1) : 'Record';

  badge.className = 'modal-mode-badge mode-' + Modal.mode;
  badge.textContent = Modal.mode.toUpperCase();

  if (Modal.mode === 'create') {
    title.textContent = `Create ${entityLabel}`;
    subtitle.textContent = `Fill in the details to create a new ${Modal.entity}`;
    saveBtn.style.display = '';
    saveLbl.textContent = 'Create';
    deleteBtn.style.display = 'none';
  } else if (Modal.mode === 'view') {
    title.textContent = Modal.data.name || entityLabel;
    subtitle.textContent = Modal.data.slug ? `/${Modal.data.slug}` : `Viewing ${Modal.entity} details`;
    saveBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
  } else if (Modal.mode === 'edit') {
    title.textContent = `Edit ${entityLabel}`;
    subtitle.textContent = Modal.data.name || `Update ${Modal.entity} details`;
    saveBtn.style.display = '';
    saveLbl.textContent = 'Save Changes';
    deleteBtn.style.display = '';
  }
}

/* ─── TABS ─── */
function setupModalTabs() {
  const permTab = document.getElementById('permissionsTab');
  permTab.style.display = Modal.entity === 'role' ? '' : 'none';
  switchModalTab('general');
}

function switchModalTab(tab) {
  Modal.currentTab = tab;

  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  renderModalBody();
}

/* ─── BODY RENDERING ─── */
function renderModalBody() {
  const body = document.getElementById('modalBody');
  const tab = Modal.currentTab;

  if (tab === 'metadata') {
    body.innerHTML = renderMetadataTab();
    return;
  }

  if (tab === 'permissions' && Modal.entity === 'role') {
    body.innerHTML = renderPermissionsTab();
    attachPermissionChecks();
    return;
  }

  // General tab
  switch (Modal.entity) {
    case 'organization': body.innerHTML = renderOrgForm(); break;
    case 'project':      body.innerHTML = renderProjectForm(); break;
    case 'feature':      body.innerHTML = renderFeatureForm(); break;
    case 'role':         body.innerHTML = renderRoleForm(); break;
    default:             body.innerHTML = '<p style="color:var(--text-muted)">Unknown entity</p>';
  }

  if (Modal.mode === 'view') {
    body.querySelectorAll('input, textarea, select').forEach(el => {
      el.setAttribute('readonly', 'true');
      el.setAttribute('disabled', 'true');
      el.classList.add('readonly');
    });
  }

  // Auto-generate slug from name input
  if (Modal.mode === 'create') {
    const nameInput = body.querySelector('#field-name');
    const slugInput = body.querySelector('#field-slug');
    if (nameInput && slugInput) {
      nameInput.addEventListener('input', () => {
        slugInput.value = generateSlug(nameInput.value);
        Modal.data.slug = slugInput.value;
      });
    }
  }

  // Sync inputs to Modal.data
  body.querySelectorAll('[id^="field-"]').forEach(input => {
    const key = input.id.replace('field-', '');
    input.addEventListener('input', () => { Modal.data[key] = input.value; });
    input.addEventListener('change', () => { Modal.data[key] = input.value; });
  });
}

/* ─── FORM TEMPLATES ─── */
function renderOrgForm() {
  const d = Modal.data;
  const ro = Modal.mode === 'view' ? 'readonly disabled class="form-input readonly"' : 'class="form-input"';
  const rota = Modal.mode === 'view' ? 'readonly disabled class="form-textarea readonly"' : 'class="form-textarea"';

  return `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Organization Name</label>
        <div class="form-input-icon-wrapper">
          <i class="fa-solid fa-building form-input-icon"></i>
          <input id="field-name" type="text" ${ro} value="${d.name || ''}" placeholder="e.g. Acme Corp" style="${Modal.mode !== 'view' ? 'padding-left:34px' : 'padding-left:34px'}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Slug</label>
        <div class="form-slug-wrapper">
          <span class="form-slug-prefix">/</span>
          <input id="field-slug" type="text" ${ro} value="${d.slug || ''}" placeholder="acme-corp" style="padding-left:18px;font-family:var(--font-mono);font-size:12px">
        </div>
        ${Modal.mode !== 'view' ? '<span class="form-hint">Auto-generated from name. URL-safe characters only.</span>' : ''}
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Description</label>
        <textarea id="field-description" ${rota} placeholder="Describe this organization…">${d.description || ''}</textarea>
      </div>
    </div>`;
}

function renderProjectForm() {
  const d = Modal.data;
  const ro = Modal.mode === 'view' ? 'readonly disabled class="form-input readonly"' : 'class="form-input"';
  const rota = Modal.mode === 'view' ? 'readonly disabled class="form-textarea readonly"' : 'class="form-textarea"';

  const orgOptions = DB.organizations.map(o =>
    `<option value="${o.id}" ${d.organization_id === o.id ? 'selected' : ''}>${o.name}</option>`
  ).join('');

  return `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Project Name</label>
        <div class="form-input-icon-wrapper">
          <i class="fa-solid fa-folder-open form-input-icon"></i>
          <input id="field-name" type="text" ${ro} value="${d.name || ''}" placeholder="e.g. Helios Platform" style="padding-left:34px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Slug</label>
        <div class="form-slug-wrapper">
          <span class="form-slug-prefix">/</span>
          <input id="field-slug" type="text" ${ro} value="${d.slug || ''}" placeholder="helios-platform" style="padding-left:18px;font-family:var(--font-mono);font-size:12px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Organization</label>
        <select id="field-organization_id" class="form-select${Modal.mode === 'view' ? ' readonly' : ''}" ${Modal.mode === 'view' ? 'disabled' : ''}>
          <option value="">Select organization…</option>
          ${orgOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Description</label>
        <textarea id="field-description" ${rota} placeholder="Describe this project…">${d.description || ''}</textarea>
      </div>
      ${Modal.mode !== 'create' ? `
      <div class="form-grid form-grid-2col">
        <div class="form-group">
          <label class="form-label">Created By</label>
          <input type="text" readonly disabled class="form-input readonly" value="${d.created_by || '—'}">
        </div>
        <div class="form-group">
          <label class="form-label">Updated By</label>
          <input type="text" readonly disabled class="form-input readonly" value="${d.updated_by || '—'}">
        </div>
      </div>` : ''}
    </div>`;
}

function renderFeatureForm() {
  const d = Modal.data;
  const ro = Modal.mode === 'view' ? 'readonly disabled class="form-input readonly"' : 'class="form-input"';
  const rota = Modal.mode === 'view' ? 'readonly disabled class="form-textarea readonly"' : 'class="form-textarea"';

  const orgOptions = DB.organizations.map(o =>
    `<option value="${o.id}" ${d.organization_id === o.id ? 'selected' : ''}>${o.name}</option>`
  ).join('');

  return `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Feature Name</label>
        <div class="form-input-icon-wrapper">
          <i class="fa-solid fa-flag form-input-icon"></i>
          <input id="field-name" type="text" ${ro} value="${d.name || ''}" placeholder="e.g. Dark Mode" style="padding-left:34px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Slug</label>
        <div class="form-slug-wrapper">
          <span class="form-slug-prefix">/</span>
          <input id="field-slug" type="text" ${ro} value="${d.slug || ''}" placeholder="dark-mode" style="padding-left:18px;font-family:var(--font-mono);font-size:12px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Organization</label>
        <select id="field-organization_id" class="form-select${Modal.mode === 'view' ? ' readonly' : ''}" ${Modal.mode === 'view' ? 'disabled' : ''}>
          <option value="">Select organization…</option>
          ${orgOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Description</label>
        <textarea id="field-description" ${rota} placeholder="Describe this feature flag…">${d.description || ''}</textarea>
      </div>
    </div>`;
}

function renderRoleForm() {
  const d = Modal.data;
  const ro = Modal.mode === 'view' ? 'readonly disabled class="form-input readonly"' : 'class="form-input"';
  const rota = Modal.mode === 'view' ? 'readonly disabled class="form-textarea readonly"' : 'class="form-textarea"';

  const orgOptions = DB.organizations.map(o =>
    `<option value="${o.id}" ${d.organization_id === o.id ? 'selected' : ''}>${o.name}</option>`
  ).join('');

  return `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Role Name</label>
        <div class="form-input-icon-wrapper">
          <i class="fa-solid fa-shield-halved form-input-icon"></i>
          <input id="field-name" type="text" ${ro} value="${d.name || ''}" placeholder="e.g. Project Manager" style="padding-left:34px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Slug</label>
        <div class="form-slug-wrapper">
          <span class="form-slug-prefix">/</span>
          <input id="field-slug" type="text" ${ro} value="${d.slug || ''}" placeholder="project-manager" style="padding-left:18px;font-family:var(--font-mono);font-size:12px">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Organization</label>
        <select id="field-organization_id" class="form-select${Modal.mode === 'view' ? ' readonly' : ''}" ${Modal.mode === 'view' ? 'disabled' : ''}>
          <option value="">Select organization…</option>
          ${orgOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label ${Modal.mode !== 'view' ? 'form-label-required' : ''}">Description</label>
        <textarea id="field-description" ${rota} placeholder="Describe this role's responsibilities…">${d.description || ''}</textarea>
      </div>
    </div>`;
}

/* ─── METADATA TAB ─── */
function renderMetadataTab() {
  const d = Modal.data;
  if (!d.id) {
    return `<div class="empty-state">
      <div class="empty-state-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
      <div class="empty-state-title">No Metadata</div>
      <div class="empty-state-message">Save this record first to view metadata and audit information.</div>
    </div>`;
  }

  return `
    <div class="meta-list">
      <div class="meta-item">
        <span class="meta-key">Record ID</span>
        <span class="meta-value copy-pill" onclick="copyToClipboard('${d.id}')" title="Click to copy">
          <i class="fa-solid fa-copy"></i> ${d.id}
        </span>
      </div>
      <div class="meta-divider"></div>
      <div class="meta-item">
        <span class="meta-key">Slug</span>
        <span class="meta-value" style="font-family:var(--font-mono)">${d.slug || '—'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-key">Organization</span>
        <span class="meta-value">${d.organization_id ? getOrgName(d.organization_id) : '—'}</span>
      </div>
      <div class="meta-divider"></div>
      <div class="meta-item">
        <span class="meta-key">Created At</span>
        <span class="meta-value">${formatDateTime(d.created_at)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-key">Updated At</span>
        <span class="meta-value">${formatDateTime(d.updated_at)}</span>
      </div>
      ${d.created_by ? `
      <div class="meta-divider"></div>
      <div class="meta-item">
        <span class="meta-key">Created By</span>
        <span class="meta-value">${d.created_by}</span>
      </div>
      <div class="meta-item">
        <span class="meta-key">Updated By</span>
        <span class="meta-value">${d.updated_by || '—'}</span>
      </div>` : ''}
    </div>`;
}

/* ─── PERMISSIONS TAB ─── */
function renderPermissionsTab() {
  const roleId = Modal.data.id;
  const matrix = DB.permissions.matrix[roleId] || {};
  const resources = DB.permissions.resources;
  const actions = DB.permissions.actions;

  return `
    <div>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">
        ${Modal.mode === 'view' ? 'Permissions assigned to this role.' : 'Toggle permissions for this role across all resources.'}
      </p>
      <div class="permission-matrix">
        <table class="permission-table">
          <thead>
            <tr>
              <th>Resource</th>
              ${actions.map(a => `<th>${a.charAt(0).toUpperCase() + a.slice(1)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${resources.map(res => `
              <tr>
                <td>${res.charAt(0).toUpperCase() + res.slice(1)}</td>
                ${actions.map(act => {
                  const hasIt = matrix[res] && matrix[res].includes(act);
                  const disabled = Modal.mode === 'view' ? 'style="cursor:not-allowed"' : `onclick="togglePerm('${roleId}','${res}','${act}',this)"`;
                  return `<td>
                    <div class="perm-check ${hasIt ? 'checked' : ''}" ${disabled} data-role="${roleId}" data-res="${res}" data-act="${act}">
                      ${hasIt ? '<i class="fa-solid fa-check"></i>' : ''}
                    </div>
                  </td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function attachPermissionChecks() {}

function togglePerm(roleId, resource, action, el) {
  if (!DB.permissions.matrix[roleId]) DB.permissions.matrix[roleId] = {};
  if (!DB.permissions.matrix[roleId][resource]) DB.permissions.matrix[roleId][resource] = [];
  const arr = DB.permissions.matrix[roleId][resource];
  const idx = arr.indexOf(action);

  if (idx > -1) {
    arr.splice(idx, 1);
    el.classList.remove('checked');
    el.innerHTML = '';
  } else {
    arr.push(action);
    el.classList.add('checked');
    el.innerHTML = '<i class="fa-solid fa-check"></i>';
  }
}

/* ─── SAVE / DELETE ─── */
function handleModalSave() {
  const d = Modal.data;

  // Basic validation
  if (!d.name || !d.name.trim()) {
    showToast('Name is required', 'error');
    const nameInput = document.getElementById('field-name');
    if (nameInput) { nameInput.classList.add('error'); nameInput.focus(); }
    return;
  }

  if (!d.slug || !d.slug.trim()) {
    d.slug = generateSlug(d.name);
  }

  const now = new Date().toISOString();

  if (Modal.mode === 'create') {
    const newRecord = {
      ...d,
      id: generateId(Modal.entity.substring(0, 4)),
      created_at: now,
      updated_at: now,
    };

    const table = Modal.entity === 'organization' ? 'organizations' :
                  Modal.entity === 'project' ? 'projects' :
                  Modal.entity === 'feature' ? 'features' : 'roles';
    DB[table].unshift(newRecord);
    showToast(`${Modal.entity} created successfully!`, 'success');
  } else if (Modal.mode === 'edit') {
    const table = Modal.entity === 'organization' ? 'organizations' :
                  Modal.entity === 'project' ? 'projects' :
                  Modal.entity === 'feature' ? 'features' : 'roles';
    const idx = DB[table].findIndex(r => r.id === d.id);
    if (idx > -1) {
      DB[table][idx] = { ...DB[table][idx], ...d, updated_at: now };
      showToast(`${Modal.entity} updated!`, 'success');
    }
  }

  if (Modal.onSaveCallback) Modal.onSaveCallback();
  closeModal();
  // Refresh current page
  setTimeout(() => navigateTo(App.currentPage), 100);
}

function handleModalDelete() {
  openConfirm(
    `Delete ${Modal.entity}`,
    `Are you sure you want to delete "${Modal.data.name}"? This action cannot be undone.`,
    () => {
      const table = Modal.entity === 'organization' ? 'organizations' :
                    Modal.entity === 'project' ? 'projects' :
                    Modal.entity === 'feature' ? 'features' : 'roles';
      const idx = DB[table].findIndex(r => r.id === Modal.data.id);
      if (idx > -1) DB[table].splice(idx, 1);
      showToast(`${Modal.entity} deleted.`, 'warning');
      closeModal();
      setTimeout(() => navigateTo(App.currentPage), 100);
    }
  );
}

/* ─── CONFIRM DIALOG ─── */
let _confirmCallback = null;

function openConfirm(title, message, onConfirm) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmOverlay').classList.add('open');
  _confirmCallback = onConfirm;
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  _confirmCallback = null;
}

function confirmDelete() {
  if (_confirmCallback) _confirmCallback();
  closeConfirm();
}

/* ─── DRAG TO RESIZE ─── */
function initDragHandle() {
  const handle = document.getElementById('modalDragHandle');
  const drawer = document.getElementById('modalDrawer');

  handle.addEventListener('mousedown', e => {
    Modal.isDragging = true;
    Modal.dragStartX = e.clientX;
    Modal.drawerStartWidth = drawer.offsetWidth;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', e => {
    if (!Modal.isDragging) return;
    const delta = Modal.dragStartX - e.clientX;
    const newWidth = Math.min(800, Math.max(360, Modal.drawerStartWidth + delta));
    drawer.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (Modal.isDragging) {
      Modal.isDragging = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });
}

/* ─── KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown', e => {
  if (document.getElementById('modalOverlay').classList.contains('open')) {
    if (e.key === 'Escape') closeModal();
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (Modal.mode !== 'view') handleModalSave();
    }
  }
  if (document.getElementById('confirmOverlay').classList.contains('open')) {
    if (e.key === 'Escape') closeConfirm();
    if (e.key === 'Enter') confirmDelete();
  }
});

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', initDragHandle);
