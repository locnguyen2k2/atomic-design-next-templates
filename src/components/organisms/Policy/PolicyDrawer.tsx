"use client";

import React, { useState, useEffect } from "react";
import { AbacPolicy, PolicyEffect } from "@/types/abac";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Select } from "@/components/atoms/Select";
import { ModalDrawer } from "@/components/organisms/ModalDrawer/ModalDrawer";

interface PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: Partial<AbacPolicy>) => void;
  policy: AbacPolicy | null;
}

export const PolicyDrawer: React.FC<PolicyDrawerProps> = ({ isOpen, onClose, onSave, policy }) => {
  const [formData, setFormData] = useState<Partial<AbacPolicy>>({
    name: "",
    description: "",
    effect: "ALLOW",
    action: "READ",
    resource: "*",
    condition: {},
  });

  const [jsonInputs, setJsonInputs] = useState({
    condition: "{}",
  });

  useEffect(() => {
    if (policy) {
      setFormData(policy);
      setJsonInputs({
        condition: JSON.stringify(policy.condition, null, 2),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        effect: "ALLOW",
        action: "READ",
        resource: "*",
        condition: {},
      });
      setJsonInputs({
        condition: "{}",
      });
    }
  }, [policy, isOpen]);

  const handleSave = () => {
    try {
      const finalPolicy = {
        ...formData,
        condition: JSON.parse(jsonInputs.condition),
      };
      onSave(finalPolicy);
    } catch (e) {
      alert("Invalid JSON in condition");
    }
  };

  const availableActions = ["READ", "CREATE", "UPDATE", "DELETE", "MANAGE", "*"];

  return (
    <ModalDrawer open={isOpen} mode={policy ? "edit" : "create"} entity="policy" data={policy as any} onClose={onClose} onSave={handleSave}>
      {({ activeTab }) => (
        <div className="space-y-6">
          {activeTab === "general" && (
            <>
              <div className="space-y-1.5">
                <Label required>Policy Name</Label>
                <Input placeholder="e.g. Developer Read Access" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-secondary/30 border-border/50 h-11 text-sm font-medium" />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea placeholder="Describe what this policy allows or denies..." className="min-h-[80px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label required>Effect</Label>
                  <Select
                    value={formData.effect}
                    onChange={(e) => setFormData({ ...formData, effect: e.target.value as PolicyEffect })}
                    options={[
                      { value: "ALLOW", label: "Allow" },
                      { value: "DENY", label: "Deny" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label required>Action</Label>
                  <Select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    options={availableActions.map((a) => ({ value: a, label: a }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label required>Resource</Label>
                <Input
                  placeholder="e.g. Project, *, or ResourceType"
                  value={formData.resource}
                  onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                  className="bg-secondary/30 border-border/50 h-11 text-sm font-medium"
                />
              </div>
            </>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="flex justify-between">
                  Logic Condition (JsonLogic)
                  <span className="text-primary/60 lowercase font-normal italic">e.g. {'{"==": [{"var": "user.id"}, {"var": "resource.owner_id"}]}'}</span>
                </Label>
                <Textarea className="bg-[#050505] font-mono text-xs min-h-[300px]" value={jsonInputs.condition} onChange={(e) => setJsonInputs({ ...jsonInputs, condition: e.target.value })} />
              </div>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="p-8 text-center bg-secondary/10 rounded-xl border border-dashed border-border">
              <Icon name="history" size="lg" className="mx-auto mb-4 text-text-muted" />
              <p className="text-sm text-text-secondary">Policy history and metadata will be displayed here.</p>
              {policy && (
                <div className="mt-6 space-y-2 text-left text-xs font-mono text-text-muted">
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span>ID</span>
                    <span>{policy.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span>Organization ID</span>
                    <span>{policy.organization_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span>Created At</span>
                    <span>{new Date(policy.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated At</span>
                    <span>{new Date(policy.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </ModalDrawer>
  );
};
