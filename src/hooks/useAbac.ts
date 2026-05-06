'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AbacData, AbacPolicy, PolicyEffect, Attribute } from '@/types/abac';
import { useAppStore } from '@/stores/appStore';
import { policiesApi } from '@/api/policies';
import { attributesApi } from '@/api/attributes';
import { BasePageOptionDto } from '@/types';
import { useUser } from './useUser';

export function useAbac() {
  const currentOrg = useAppStore((state) => state.currentOrg);
  const { data: user } = useUser();
  const addToast = useAppStore((state) => state.addToast);

  const [policies, setPolicies] = useState<AbacPolicy[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [pagination, setPagination] = useState(new BasePageOptionDto());
  const [attrPagination, setAttrPagination] = useState(new BasePageOptionDto());
  const [isLoading, setIsLoading] = useState(false);
  const [isAttrsLoading, setIsAttrsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('policies');

  // Evaluator state
  const [evalForm, setEvalForm] = useState({
    subject_role: '',
    subject_dept: '',
    subject_clearance: 0,
    subject_mfa: false,
    subject_subscription: '',
    subject_location: '',
    resource_org: '',
    resource_project: '',
    resource_type: '',
    resource_sensitivity: '',
    resource_env: '',
    resource_feature: '',
    resource_owner: user?.id || '',
    action: '',
    env_time: '',
    env_network: '',
    env_risk: '',
  });
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evalLog, setEvalLog] = useState<any[]>([]);

  // Policies filters
  const [policyFilter, setPolicyFilter] = useState<'all' | 'ALLOW' | 'DENY'>('all');
  const [policySearch, setPolicySearch] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    return { from, to };
  });
  const [sort, setSort] = useState({ field: 'updated_at', order: 'desc' as 'asc' | 'desc' });
  const [page, setPage] = useState(1);

  // Attributes filters
  const [attrSearch, setAttrSearch] = useState('');
  const [attrDateRange, setAttrDateRange] = useState<{ from?: Date; to?: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    return { from, to };
  });
  const [attrPage, setAttrPage] = useState(1);
  const [attrSort, setAttrSort] = useState({ field: 'created_at', order: 'desc' as 'asc' | 'desc' });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<AbacPolicy | null>(null);

  const fetchPolicies = useCallback(async () => {
    if (!currentOrg) return;

    setIsLoading(true);
    try {
      const response = await policiesApi.list(currentOrg, {
        page,
        take: 10,
        keyword: policySearch,
        sort: sort.field,
        sorted: sort.order,
        from_date: dateRange.from?.toISOString().split('T')[0],
        to_date: dateRange.to?.toISOString().split('T')[0],
      });

      let data = response.data;
      if (policyFilter !== 'all') {
        data = data.filter(p => p.effect === policyFilter);
      }

      setPolicies(data);
      setPagination(response.paginated);
    } catch (error) {
      addToast({ message: 'Failed to fetch policies', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentOrg, page, policySearch, sort, dateRange, policyFilter, addToast]);

  const fetchAttributes = useCallback(async () => {
    if (!currentOrg) return;

    setIsAttrsLoading(true);
    try {
      const response = await attributesApi.list(currentOrg, {
        page: attrPage,
        take: 10,
        keyword: attrSearch,
        sort: attrSort.field,
        sorted: attrSort.order,
        from_date: attrDateRange.from?.toISOString().split('T')[0],
        to_date: attrDateRange.to?.toISOString().split('T')[0],
      });

      setAttributes(response.data);
      setAttrPagination(response.paginated);
    } catch (error) {
      addToast({ message: 'Failed to fetch attributes', type: 'error' });
    } finally {
      setIsAttrsLoading(false);
    }
  }, [currentOrg, attrPage, attrSearch, attrSort, attrDateRange, addToast]);

  useEffect(() => {
    if (activeTab === 'policies') {
      fetchPolicies();
    } else if (activeTab === 'attributes') {
      fetchAttributes();
    }
  }, [fetchPolicies, fetchAttributes, activeTab]);

  const openDrawer = (policy?: AbacPolicy) => {
    setSelectedPolicy(policy || null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPolicy(null);
  };

  const savePolicy = async (policy: Partial<AbacPolicy>) => {
    if (!currentOrg) return;

    try {
      if (selectedPolicy) {
        await policiesApi.update(currentOrg, selectedPolicy.id, policy);
        addToast({ message: 'Policy updated successfully', type: 'success' });
      } else {
        await policiesApi.create(currentOrg, policy);
        addToast({ message: 'Policy created successfully', type: 'success' });
      }
      fetchPolicies();
      closeDrawer();
    } catch (error) {
      addToast({ message: 'Failed to save policy', type: 'error' });
    }
  };

  const deletePolicy = async (id: string) => {
    if (!currentOrg) return;

    try {
      await policiesApi.delete(currentOrg, id);
      addToast({ message: 'Policy deleted successfully', type: 'success' });
      fetchPolicies();
    } catch (error) {
      addToast({ message: 'Failed to delete policy', type: 'error' });
    }
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSort({ field, order });
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setPolicySearch(query);
    setPage(1);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setPage(1);
  };

  const handleAttrSort = (field: string, order: 'asc' | 'desc') => {
    setAttrSort({ field, order });
    setAttrPage(1);
  };

  const handleAttrSearch = (query: string) => {
    setAttrSearch(query);
    setAttrPage(1);
  };

  const handleAttrDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setAttrDateRange(range);
    setAttrPage(1);
  };

  const runEvaluation = async () => {
    if (!evalForm.resource_org) {
      addToast({ message: 'Please select an organization', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const body = {
        subject: {
          role: evalForm.subject_role,
          department: evalForm.subject_dept,
          clearance: evalForm.subject_clearance,
          mfa_verified: evalForm.subject_mfa === 'true' || evalForm.subject_mfa === true,
          subscription: evalForm.subject_subscription,
          location: evalForm.subject_location,
        },
        resource: {
          type: evalForm.resource_type,
          id: evalForm.resource_feature,
          sensitivity: evalForm.resource_sensitivity,
          environment: evalForm.resource_env,
        },
        action: evalForm.action,
        context: {
          network: evalForm.env_network,
          risk_score: parseInt(evalForm.env_risk) || 0,
        },
        organization_id: evalForm.resource_org,
      };

      const response = await policiesApi.evaluate(evalForm.resource_org, body);
      const data = response.data;
      const decision = data.decision;
      const appliedPolicy = data.evaluated_policies.find((p: any) => p.status === 'APPLIED');

      const result = {
        decision,
        reason: appliedPolicy
          ? `Policy "${appliedPolicy.name}" matched and returned ${decision}.`
          : `Evaluation resulted in ${decision}.`,
        matchedPolicies: data.evaluated_policies.map((p: any) => ({
          ...p,
          applied: p.status === 'APPLIED'
        })),
        context: {
          'subject.id': data.context.subject.id,
          'subject.email': data.context.subject.email,
          'resource.id': data.context.resource.id,
          'resource.slug': data.context.resource.slug,
          'action': data.context.action,
          'env.network': data.context.env.network,
          'env.risk_score': data.context.env.risk_score,
        }
      };

      setEvalResult(result);

      const newLogEntry = {
        id: `log-${Date.now()}`,
        ts: new Date().toISOString(),
        subject: data.context.subject.email || `user@${evalForm.subject_dept}`,
        action: data.context.action,
        resource: `${data.context.resource.type}:${data.context.resource.slug}`,
        result: decision,
        policy: appliedPolicy ? appliedPolicy.name : 'Implicit Deny',
        duration_ms: Math.floor(Math.random() * 10) + 2,
      };

      setEvalLog(prev => [newLogEntry, ...prev.slice(0, 19)]);
      addToast({
        message: `Evaluation: ${decision}`,
        type: decision === 'ALLOW' ? 'success' : 'error'
      });
    } catch (error) {
      addToast({ message: 'Failed to run evaluation', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const subjectAttributes = useMemo(() => attributes.filter(a => a.category === 'SUBJECT'), [attributes]);
  const resourceAttributes = useMemo(() => attributes.filter(a => a.category === 'RESOURCE'), [attributes]);
  const environmentAttributes = useMemo(() => attributes.filter(a => a.category === 'ENVIRONMENT'), [attributes]);

  return {
    metadata: {
      subjectAttributes,
      resourceAttributes,
      environmentAttributes,
      actions: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE', '*'],
    },
    attributes,
    isAttrsLoading,
    attrPagination: {
      currentPage: attrPagination.page,
      totalPages: attrPagination.pages,
      totalItems: attrPagination.number_records,
      itemsPerPage: attrPagination.take,
    },
    attrSearch,
    setAttrSearch: handleAttrSearch,
    attrDateRange,
    setAttrDateRange: handleAttrDateRangeChange,
    onAttrSort: handleAttrSort,
    setAttrPage,
    policies,
    isLoading,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.pages,
      totalItems: pagination.number_records,
      itemsPerPage: pagination.take,
    },
    activeTab,
    setActiveTab,
    policyFilter,
    setPolicyFilter,
    policySearch,
    setPolicySearch: handleSearch,
    dateRange,
    setDateRange: handleDateRangeChange,
    sort,
    onSort: handleSort,
    page,
    setPage,
    isDrawerOpen,
    selectedPolicy,
    openDrawer,
    closeDrawer,
    savePolicy,
    deletePolicy,
    // Evaluator
    evalForm,
    setEvalForm: (form: any) => setEvalForm(form),
    updateEvalForm: (key: string, value: any) => setEvalForm(prev => ({ ...prev, [key]: value })),
    evalResult,
    setEvalResult,
    runEvaluation,
    evalLog,
  };
}
