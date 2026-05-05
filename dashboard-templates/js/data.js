/* ═══════════════════════════════════════════════════
   NEXUSIAM — MOCK DATA
   Simulated API response data for all IAM entities
═══════════════════════════════════════════════════ */

const DB = {
  currentOrg: 'org-001',
  currentUser: {
    id: 'usr-001',
    username: 'johndoe',
    email: 'john.doe@acmecorp.com',
    first_name: 'John',
    last_name: 'Doe',
    status: 'active',
    role: 'Super Admin',
    created_at: '2024-01-10T08:00:00.000Z',
    updated_at: '2025-03-15T14:22:00.000Z'
  },

  organizations: [
    { id: 'org-001', name: 'Acme Corp', slug: 'acme-corp', description: 'Global technology solutions provider and innovation leader.', created_at: '2024-01-10T08:00:00.000Z', updated_at: '2025-02-20T10:00:00.000Z' },
    { id: 'org-002', name: 'Nexus Labs', slug: 'nexus-labs', description: 'Research and development organization focused on AI systems.', created_at: '2024-02-15T09:30:00.000Z', updated_at: '2025-01-10T12:00:00.000Z' },
    { id: 'org-003', name: 'StarBridge', slug: 'starbridge', description: 'Cloud infrastructure and DevOps automation company.', created_at: '2024-03-01T11:00:00.000Z', updated_at: '2025-03-01T09:00:00.000Z' },
    { id: 'org-004', name: 'Quantum IO', slug: 'quantum-io', description: 'Quantum computing services and consulting firm.', created_at: '2024-04-18T14:00:00.000Z', updated_at: '2025-02-28T16:30:00.000Z' },
    { id: 'org-005', name: 'DataStream', slug: 'datastream', description: 'Real-time data analytics and streaming platform.', created_at: '2024-06-05T10:00:00.000Z', updated_at: '2025-03-10T11:00:00.000Z' },
  ],

  projects: [
    { id: 'prj-001', name: 'Helios Platform', slug: 'helios-platform', description: 'Core SaaS platform for enterprise customers.', organization_id: 'org-001', created_by: 'johndoe', updated_by: 'johndoe', created_at: '2024-02-01T10:00:00.000Z', updated_at: '2025-03-01T14:00:00.000Z' },
    { id: 'prj-002', name: 'Iris Analytics', slug: 'iris-analytics', description: 'Business intelligence and reporting suite.', organization_id: 'org-001', created_by: 'johndoe', updated_by: 'alice', created_at: '2024-03-10T11:00:00.000Z', updated_at: '2025-02-15T09:00:00.000Z' },
    { id: 'prj-003', name: 'Nexus AI Engine', slug: 'nexus-ai-engine', description: 'ML pipeline and model serving infrastructure.', organization_id: 'org-002', created_by: 'alice', updated_by: 'alice', created_at: '2024-04-05T08:30:00.000Z', updated_at: '2025-01-20T16:00:00.000Z' },
    { id: 'prj-004', name: 'CloudForge', slug: 'cloudforge', description: 'Infrastructure automation and IaC toolkit.', organization_id: 'org-003', created_by: 'bob', updated_by: 'bob', created_at: '2024-05-12T13:00:00.000Z', updated_at: '2025-03-05T11:00:00.000Z' },
    { id: 'prj-005', name: 'DataStream Core', slug: 'datastream-core', description: 'Event streaming engine built on Kafka.', organization_id: 'org-005', created_by: 'carol', updated_by: 'carol', created_at: '2024-07-01T09:00:00.000Z', updated_at: '2025-02-28T15:00:00.000Z' },
    { id: 'prj-006', name: 'Quantum SDK', slug: 'quantum-sdk', description: 'Developer SDK for quantum circuit programming.', organization_id: 'org-004', created_by: 'dave', updated_by: 'dave', created_at: '2024-08-20T10:30:00.000Z', updated_at: '2025-03-12T13:00:00.000Z' },
  ],

  features: [
    { id: 'feat-001', name: 'Dark Mode', slug: 'dark-mode', description: 'Enable dark mode theme across all interfaces.', organization_id: 'org-001', created_at: '2024-02-10T10:00:00.000Z', updated_at: '2025-01-15T14:00:00.000Z' },
    { id: 'feat-002', name: 'AI Assistant', slug: 'ai-assistant', description: 'Contextual AI suggestions and auto-completion features.', organization_id: 'org-001', created_at: '2024-03-01T11:00:00.000Z', updated_at: '2025-02-20T10:00:00.000Z' },
    { id: 'feat-003', name: 'Advanced Analytics', slug: 'advanced-analytics', description: 'Deep data exploration with custom dashboards.', organization_id: 'org-002', created_at: '2024-04-15T09:00:00.000Z', updated_at: '2025-01-10T12:00:00.000Z' },
    { id: 'feat-004', name: 'Multi-tenancy', slug: 'multi-tenancy', description: 'Full multi-tenant isolation with per-org storage.', organization_id: 'org-001', created_at: '2024-01-25T14:00:00.000Z', updated_at: '2025-03-01T08:00:00.000Z' },
    { id: 'feat-005', name: 'Audit Logs', slug: 'audit-logs', description: 'Immutable audit trail for all user and system actions.', organization_id: 'org-003', created_at: '2024-05-10T10:00:00.000Z', updated_at: '2025-02-10T16:00:00.000Z' },
    { id: 'feat-006', name: 'SSO Integration', slug: 'sso-integration', description: 'Single Sign-On via SAML 2.0 and OIDC protocols.', organization_id: 'org-002', created_at: '2024-06-20T09:30:00.000Z', updated_at: '2025-03-08T11:00:00.000Z' },
    { id: 'feat-007', name: 'Webhook Events', slug: 'webhook-events', description: 'Real-time webhook delivery for all entity events.', organization_id: 'org-001', created_at: '2024-07-05T13:00:00.000Z', updated_at: '2025-02-25T14:00:00.000Z' },
  ],

  roles: [
    { id: 'role-001', name: 'Super Admin', slug: 'super-admin', description: 'Full unrestricted access to all resources and operations.', organization_id: 'org-001', created_at: '2024-01-10T08:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
    { id: 'role-002', name: 'Org Admin', slug: 'org-admin', description: 'Administrative access limited to a single organization.', organization_id: 'org-001', created_at: '2024-01-15T09:00:00.000Z', updated_at: '2025-01-20T10:00:00.000Z' },
    { id: 'role-003', name: 'Project Manager', slug: 'project-manager', description: 'Create and manage projects within assigned organization.', organization_id: 'org-001', created_at: '2024-02-01T10:00:00.000Z', updated_at: '2025-02-15T12:00:00.000Z' },
    { id: 'role-004', name: 'Developer', slug: 'developer', description: 'Read access to projects plus feature flag management.', organization_id: 'org-001', created_at: '2024-02-10T11:00:00.000Z', updated_at: '2025-03-01T09:00:00.000Z' },
    { id: 'role-005', name: 'Viewer', slug: 'viewer', description: 'Read-only access to all resources within scope.', organization_id: 'org-001', created_at: '2024-03-01T08:00:00.000Z', updated_at: '2025-02-28T14:00:00.000Z' },
  ],

  /* ── ABAC (Attribute-Based Access Control) ── */
  abac: {

    /* Subject Attributes — who is making the request */
    subjectAttributes: [
      { id: 'sa-001', name: 'role',          label: 'Role',            type: 'enum',    values: ['super_admin','org_admin','project_manager','developer','viewer'], description: 'System role assigned to the user' },
      { id: 'sa-002', name: 'department',    label: 'Department',      type: 'enum',    values: ['engineering','finance','marketing','operations','security'],      description: 'Organizational department of the user' },
      { id: 'sa-003', name: 'clearance',     label: 'Clearance Level', type: 'enum',    values: ['public','internal','confidential','secret'],                     description: 'Data clearance level granted to the user' },
      { id: 'sa-004', name: 'mfa_verified',  label: 'MFA Verified',    type: 'boolean', values: [],                                                               description: 'Whether user completed multi-factor authentication' },
      { id: 'sa-005', name: 'subscription',  label: 'Subscription',    type: 'enum',    values: ['free','starter','pro','enterprise'],                            description: 'User account subscription tier' },
      { id: 'sa-006', name: 'location',      label: 'Location',        type: 'string',  values: [],                                                               description: 'Geo-location of the request (country/region)' },
    ],

    /* Resource Attributes — what resource is being accessed */
    resourceAttributes: [
      { id: 'ra-001', name: 'resource_type',  label: 'Resource Type',  type: 'enum',    values: ['organization','project','feature','role','user','audit_log'],   description: 'Type of entity being accessed' },
      { id: 'ra-002', name: 'sensitivity',    label: 'Sensitivity',    type: 'enum',    values: ['low','medium','high','critical'],                               description: 'Sensitivity classification of the resource' },
      { id: 'ra-003', name: 'owner_org',      label: 'Owner Org',      type: 'string',  values: [],                                                               description: 'Organization that owns the resource' },
      { id: 'ra-004', name: 'status',         label: 'Status',         type: 'enum',    values: ['active','inactive','archived','draft'],                         description: 'Current lifecycle status of the resource' },
      { id: 'ra-005', name: 'environment',    label: 'Environment',    type: 'enum',    values: ['production','staging','development','testing'],                  description: 'Deployment environment of the resource' },
    ],

    /* Environment / Context Attributes */
    environmentAttributes: [
      { id: 'ea-001', name: 'time_of_day',    label: 'Time of Day',    type: 'enum',    values: ['business_hours','off_hours','weekend'],                         description: 'Current time window of the access request' },
      { id: 'ea-002', name: 'ip_range',       label: 'IP Range',       type: 'string',  values: [],                                                               description: 'CIDR block or IP range of the requestor' },
      { id: 'ea-003', name: 'network_zone',   label: 'Network Zone',   type: 'enum',    values: ['corporate','vpn','public','trusted_partner'],                   description: 'Network zone from which request originates' },
      { id: 'ea-004', name: 'risk_score',     label: 'Risk Score',     type: 'number',  values: [],                                                               description: 'Computed risk score (0–100) of the request context' },
    ],

    /* Actions available */
    actions: ['create', 'read', 'update', 'delete', 'export', 'admin'],

    /* Policies — the core ABAC rules */
    policies: [
      {
        id: 'pol-001',
        name: 'Super Admin Full Access',
        description: 'Grants unrestricted access to all resources for super administrators.',
        effect: 'allow',
        priority: 100,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'equals', value: 'super_admin' }],
        resources: [{ attribute: 'resource_type', operator: 'in', value: ['organization','project','feature','role','user','audit_log'] }],
        actions: ['create','read','update','delete','export','admin'],
        conditions: [],
        created_at: '2024-01-10T08:00:00.000Z',
        updated_at: '2025-03-01T10:00:00.000Z',
        created_by: 'johndoe'
      },
      {
        id: 'pol-002',
        name: 'Org Admin Scoped Access',
        description: 'Org admins can manage projects and features within their own organization.',
        effect: 'allow',
        priority: 80,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'equals', value: 'org_admin' }],
        resources: [
          { attribute: 'resource_type', operator: 'in', value: ['project','feature'] },
          { attribute: 'owner_org', operator: 'equals', value: '${subject.org_id}' }
        ],
        actions: ['create','read','update','delete'],
        conditions: [{ attribute: 'mfa_verified', operator: 'equals', value: 'true' }],
        created_at: '2024-01-15T09:00:00.000Z',
        updated_at: '2025-02-10T11:00:00.000Z',
        created_by: 'johndoe'
      },
      {
        id: 'pol-003',
        name: 'Developer Read + Feature Update',
        description: 'Developers can read all projects and update feature flags in non-production environments.',
        effect: 'allow',
        priority: 60,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'equals', value: 'developer' }],
        resources: [
          { attribute: 'resource_type', operator: 'in', value: ['project','feature'] },
          { attribute: 'environment', operator: 'not_equals', value: 'production' }
        ],
        actions: ['read','update'],
        conditions: [
          { attribute: 'network_zone', operator: 'in', value: ['corporate','vpn'] },
          { attribute: 'time_of_day', operator: 'equals', value: 'business_hours' }
        ],
        created_at: '2024-02-10T11:00:00.000Z',
        updated_at: '2025-03-10T09:00:00.000Z',
        created_by: 'alice'
      },
      {
        id: 'pol-004',
        name: 'Finance Department Audit Read',
        description: 'Finance department members can read audit logs for compliance purposes.',
        effect: 'allow',
        priority: 50,
        status: 'active',
        subjects: [
          { attribute: 'department', operator: 'equals', value: 'finance' },
          { attribute: 'clearance', operator: 'in', value: ['confidential','secret'] }
        ],
        resources: [{ attribute: 'resource_type', operator: 'equals', value: 'audit_log' }],
        actions: ['read','export'],
        conditions: [{ attribute: 'mfa_verified', operator: 'equals', value: 'true' }],
        created_at: '2024-03-01T10:00:00.000Z',
        updated_at: '2025-01-20T14:00:00.000Z',
        created_by: 'johndoe'
      },
      {
        id: 'pol-005',
        name: 'Deny Public Network Production Access',
        description: 'Deny all access to production resources originating from public networks.',
        effect: 'deny',
        priority: 90,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'not_equals', value: 'super_admin' }],
        resources: [{ attribute: 'environment', operator: 'equals', value: 'production' }],
        actions: ['create','update','delete','admin'],
        conditions: [{ attribute: 'network_zone', operator: 'equals', value: 'public' }],
        created_at: '2024-03-15T08:00:00.000Z',
        updated_at: '2025-02-28T16:00:00.000Z',
        created_by: 'johndoe'
      },
      {
        id: 'pol-006',
        name: 'Viewer Global Read',
        description: 'Viewers can read all non-sensitive resources across any environment.',
        effect: 'allow',
        priority: 30,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'equals', value: 'viewer' }],
        resources: [{ attribute: 'sensitivity', operator: 'in', value: ['low','medium'] }],
        actions: ['read'],
        conditions: [],
        created_at: '2024-03-10T09:00:00.000Z',
        updated_at: '2025-03-05T11:00:00.000Z',
        created_by: 'alice'
      },
      {
        id: 'pol-007',
        name: 'MFA Required for Critical Resources',
        description: 'Any access to critical-sensitivity resources requires verified MFA.',
        effect: 'deny',
        priority: 95,
        status: 'active',
        subjects: [{ attribute: 'role', operator: 'not_equals', value: 'super_admin' }],
        resources: [{ attribute: 'sensitivity', operator: 'equals', value: 'critical' }],
        actions: ['create','read','update','delete','export','admin'],
        conditions: [{ attribute: 'mfa_verified', operator: 'equals', value: 'false' }],
        created_at: '2024-04-01T08:00:00.000Z',
        updated_at: '2025-03-12T10:00:00.000Z',
        created_by: 'johndoe'
      },
      {
        id: 'pol-008',
        name: 'Enterprise Subscription Export',
        description: 'Only Enterprise subscribers can export data from any resource.',
        effect: 'allow',
        priority: 70,
        status: 'draft',
        subjects: [{ attribute: 'subscription', operator: 'equals', value: 'enterprise' }],
        resources: [{ attribute: 'resource_type', operator: 'in', value: ['project','feature','audit_log'] }],
        actions: ['export'],
        conditions: [{ attribute: 'mfa_verified', operator: 'equals', value: 'true' }],
        created_at: '2024-05-20T10:00:00.000Z',
        updated_at: '2025-02-15T09:00:00.000Z',
        created_by: 'bob'
      },
    ],

    /* Policy Evaluation Log (simulated) */
    evalLog: [
      { id: 'log-001', ts: '2025-04-17T09:12:00.000Z', subject: 'johndoe', action: 'delete', resource: 'project:prj-003', result: 'allow', policy: 'pol-001', duration_ms: 4 },
      { id: 'log-002', ts: '2025-04-17T09:10:00.000Z', subject: 'alice',   action: 'update', resource: 'feature:feat-002', result: 'allow', policy: 'pol-003', duration_ms: 6 },
      { id: 'log-003', ts: '2025-04-17T09:08:00.000Z', subject: 'bob',     action: 'export', resource: 'audit_log:al-099', result: 'deny',  policy: 'pol-004', duration_ms: 3 },
      { id: 'log-004', ts: '2025-04-17T09:05:00.000Z', subject: 'carol',   action: 'create', resource: 'project:prj-007', result: 'deny',  policy: 'pol-005', duration_ms: 5 },
      { id: 'log-005', ts: '2025-04-17T08:58:00.000Z', subject: 'dave',    action: 'read',   resource: 'organization:org-001', result: 'allow', policy: 'pol-006', duration_ms: 2 },
      { id: 'log-006', ts: '2025-04-17T08:45:00.000Z', subject: 'johndoe', action: 'admin',  resource: 'role:role-003', result: 'allow', policy: 'pol-001', duration_ms: 4 },
      { id: 'log-007', ts: '2025-04-17T08:30:00.000Z', subject: 'alice',   action: 'delete', resource: 'feature:feat-005', result: 'deny',  policy: 'pol-007', duration_ms: 7 },
    ]
  },

  activity: [
    { type: 'create', entity: 'project', name: 'Quantum SDK', user: 'johndoe', time: '2 min ago', icon: 'fa-solid fa-folder-plus', color: 'success' },
    { type: 'update', entity: 'feature', name: 'AI Assistant', user: 'alice', time: '15 min ago', icon: 'fa-solid fa-flag', color: 'warning' },
    { type: 'create', entity: 'role', name: 'Developer', user: 'johndoe', time: '1 hr ago', icon: 'fa-solid fa-shield-halved', color: 'primary' },
    { type: 'delete', entity: 'organization', name: 'Old Corp', user: 'admin', time: '3 hrs ago', icon: 'fa-solid fa-building', color: 'danger' },
    { type: 'update', entity: 'project', name: 'Helios Platform', user: 'bob', time: '5 hrs ago', icon: 'fa-solid fa-folder-open', color: 'accent' },
    { type: 'create', entity: 'feature', name: 'Webhook Events', user: 'carol', time: '1 day ago', icon: 'fa-solid fa-flag', color: 'violet' },
  ]
};

/* ─── HELPERS ─── */
function getOrgName(orgId) {
  const org = DB.organizations.find(o => o.id === orgId);
  return org ? org.name : orgId;
}

function getOrgInitials(orgId) {
  const name = getOrgName(orgId);
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function getRoleName(roleId) {
  const role = DB.roles.find(r => r.id === roleId);
  return role ? role.name : roleId;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2,9)}`;
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ─── FILTERED DATA HELPERS ─── */
function getProjectsForOrg(orgId) {
  if (!orgId) return DB.projects;
  return DB.projects.filter(p => p.organization_id === orgId);
}

function getFeaturesForOrg(orgId) {
  if (!orgId) return DB.features;
  return DB.features.filter(f => f.organization_id === orgId);
}

function filterBySearch(arr, search, fields = ['name', 'slug', 'description']) {
  if (!search) return arr;
  const q = search.toLowerCase();
  return arr.filter(item => fields.some(f => item[f] && item[f].toLowerCase().includes(q)));
}

function paginateArray(arr, page = 1, limit = 5) {
  const total = arr.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = arr.slice(start, start + limit);
  return { data, total, pages, page, limit, has_prev: page > 1, has_next: page < pages };
}
