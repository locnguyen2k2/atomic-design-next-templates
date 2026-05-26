"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AbacPolicy, PolicyEffect } from "@/types/abac";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Select } from "@/components/atoms/Select";
import { ModalDrawer } from "@/components/organisms/ModalDrawer/ModalDrawer";
import { SelectWithCursor } from "@/components/molecules";
import { RecentActivityTab } from "@/components/molecules/RecentActivityTab/RecentActivityTab";
import { useResourceTypesCursor } from "@/hooks";

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
  const [resourceTypeSearch, setResourceTypeSearch] = useState("");
  const { data: resourceTypePages, fetchNextPage: fetchNextResourceType, hasNextPage: hasNextResourceType, isFetchingNextPage: isFetchingNextResourceType, isLoading: isResourceTypesLoading } = useResourceTypesCursor({ keyword: resourceTypeSearch });

  const resourceTypes = useMemo(() => resourceTypePages?.pages.flatMap((page) => page.data).map((rt) => ({ id: rt.slug, name: rt.name })) || [], [resourceTypePages]);

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

  const handleResourceTypeChange = (resourceTypeId: string) => {
    setFormData({ ...formData, resource: resourceTypeId });
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
                  <Select value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} options={availableActions.map((a) => ({ value: a, label: a }))} />
                </div>
              </div>

              <div className="space-y-1.5">
                <SelectWithCursor
                  label="Resource Type"
                  placeholder="Select Resource Type"
                  items={resourceTypes}
                  isLoading={isResourceTypesLoading || isFetchingNextResourceType}
                  hasMore={!!hasNextResourceType}
                  onLoadMore={() => fetchNextResourceType()}
                  onSearch={(query) => setResourceTypeSearch(query)}
                  onSelect={(item) => handleResourceTypeChange(item.id)}
                  selectedId={formData.resource}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="flex justify-between">
                    Logic Condition (JsonLogic)
                    <span className="text-primary/60 lowercase font-normal italic">e.g. {'{"==": [{"var": "user.id"}, {"var": "resource.owner_id"}]}'}</span>
                  </Label>
                  <Textarea className="bg-[#050505] font-mono text-xs min-h-[300px]" value={jsonInputs.condition} onChange={(e) => setJsonInputs({ ...jsonInputs, condition: e.target.value })} />
                </div>
              </div>
            </>
          )}

          {activeTab === "recent_activity" && (
            <RecentActivityTab
              entityId={policy?.id}
              createdAt={policy?.created_at}
              updatedAt={policy?.updated_at}
            />
          )}
        </div>
      )}
    </ModalDrawer>
  );
};
