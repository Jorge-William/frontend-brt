import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  HandCoins,
  LayoutDashboard,
  Map,
  PackageOpen,
  PieChart,
  SquareScissors,
  UserRoundCog,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Jorge William",
    email: "jorge_william_cardoso@yahoo.com.br",
    avatar: "/avatars/shadcn.jpg",
  },
  filiais: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Fila de Espera",
      url: "/fila-de-espera",
      icon: Users2,
    },
    {
      title: "Vendas",
      url: "#",
      icon: HandCoins,
      items: [
        {
          title: "Nova transação",
          url: "/vendas/nova-transacao",
          icon: HandCoins,
        },
        {
          title: "Reembolso",
          url: "/vendas/reembolso",
        },
        {
          title: "Histórico",
          url: "/vendas/historico",
          icon: LayoutDashboard,
        },
        {
          title: "Comanda",
          url: "#",
        },
      ],
    },
    {
      title: "Estoque",
      url: "/estoque",
      icon: PackageOpen,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: UserRoundCog,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: SquareScissors,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar( { ...props }: React.ComponentProps<typeof Sidebar> ) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.filiais} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
