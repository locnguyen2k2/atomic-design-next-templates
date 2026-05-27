"use client";

import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";
import { useAppStore, useAuthStore } from "@/stores";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumb: { label: string; href?: string }[];
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar, currentOrg, setCurrentOrg } = useAppStore();
  const { setUser, user: baseInfo, isLoading } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  // const { data: userData, isLoading } = useMe();

  const organizations = useMemo(() => {
    if (baseInfo?.organizations) {
      return baseInfo.organizations.map((orgRole) => ({
        id: orgRole?.organization_id || orgRole.id,
        name: orgRole.name,
      }));
    }
    return [];
  }, [baseInfo]);

  const currentOrgData = useMemo(() => {
    if (baseInfo?.status === "ACTIVE") {
      if (organizations.length === 0) return { id: "", name: "No Organization" };

      const found = organizations.find((o) => o.id === currentOrg);
      if (found) return found;

      return organizations[0];
    }
    return { id: "", name: "No Organization" };
  }, [baseInfo?.status, organizations, currentOrg]);

  useEffect(() => {
    if (baseInfo?.status === "INACTIVE") {
      router.push("/email-confirmation");
      return;
    }
    if (baseInfo) {
      setUser(baseInfo);
    }
  }, [baseInfo, router, setUser]);

  useEffect(() => {
    if (baseInfo?.status === "ACTIVE") {
      if (organizations.length > 0 && !currentOrg) {
        setCurrentOrg(organizations[0].id);
      } else if (organizations.length > 0 && currentOrg) {
        const found = organizations.find((o) => o.id === currentOrg);
        if (!found) {
          setCurrentOrg(organizations[0].id);
        }
      }
    }
  }, [organizations, currentOrg, setCurrentOrg, baseInfo?.status]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [breadcrumb]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("globalSearch")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOrgSwitch = (orgId: string) => {
    setCurrentOrg(orgId);
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const user = {
    first_name: baseInfo?.first_name || "User",
    last_name: baseInfo?.last_name || "",
    role: baseInfo?.organizations?.find((o) => o.id === currentOrg)?.roles?.[0]?.name || "Member",
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg transition-colors duration-300">
      <Sidebar currentOrg={currentOrgData} organizations={organizations} onOrgSwitch={handleOrgSwitch} collapsed={sidebarCollapsed} onToggle={toggleSidebar} mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} user={user} />
      <div className={cn("flex-1 transition-all duration-300 min-w-0", sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[260px]")}>
        <Header breadcrumb={breadcrumb} theme={theme} onThemeToggle={toggleTheme} onSearch={handleSearch} user={user} onMobileToggle={() => setMobileSidebarOpen(true)} onSidebarToggle={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <main className="pt-16 p-4 sm:p-6 min-h-screen top-[64px] relative text-text-primary">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
