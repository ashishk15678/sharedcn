import { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
