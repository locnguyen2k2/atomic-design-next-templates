export type AttributeType = 'STRING' | 'BOOLEAN' | 'NUMBER';

export interface Attribute {
  id: string;
  key: string;
  label: string;
  data_type: AttributeType;
  description: string;
  entity_type: string;
  category: 'SUBJECT' | 'RESOURCE' | 'ENVIRONMENT';
}

export type PolicyEffect = 'ALLOW' | 'DENY';

export interface PolicyRule {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: string | string[] | number | boolean;
}

export interface AbacPolicy {
  id: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  action: string;
  resource: string;
  condition: any;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AbacData {
  subjectAttributes: Attribute[];
  resourceAttributes: Attribute[];
  environmentAttributes: Attribute[];
  actions: string[];
  policies: AbacPolicy[];
}

export interface EvalLogEntry {
  id: string;
  ts: string;
  subject: string;
  action: string;
  resource: string;
  result: PolicyEffect;
  policies: string[];
}
