import { SidebarBrandCard } from "./sidebar-brand-card";

export function SidebarRail() {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
      <SidebarBrandCard />
    </div>
  );
}
