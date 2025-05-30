import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUpIcon,
  Users2Icon,
  UserPlusIcon,
  UserMinusIcon
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ClientesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/" },
            { title: "Clientes" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-2xl font-semibold">
              Clientes
            </CardTitle>
            <CardDescription>
              Gerencie seus clientes e visualize suas informações.
            </CardDescription>
          </CardHeader> */}

          {/* Updated container with responsive grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Revenue Card */}
            <Card className="w-full">
              <CardHeader className="relative">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  $1,250.00
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                    <TrendingUpIcon className="size-3" />
                    +12.5%
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Trending up this month <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>

            {/* Total Clients Card */}
            <Card className="w-full">
              <CardHeader className="relative">
                <CardDescription>Total Clientes</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  1,234
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                    <Users2Icon className="size-3" />
                    Total
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Clientes ativos <Users2Icon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Base total de clientes
                </div>
              </CardFooter>
            </Card>

            {/* New Clients Card */}
            <Card className="w-full">
              <CardHeader className="relative">
                <CardDescription>Novos Clientes</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  56
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                    <UserPlusIcon className="size-3" />
                    +8.3%
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Crescimento mensal <UserPlusIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Novos clientes este mês
                </div>
              </CardFooter>
            </Card>

            {/* Churn Rate Card */}
            <Card className="w-full">
              <CardHeader className="relative">
                <CardDescription>Taxa de Perda</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  2.4%
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                    <UserMinusIcon className="size-3" />
                    -1.2%
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Redução na perda <UserMinusIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Taxa de churn mensal
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </SidebarInset>
    </SidebarProvider >
  )
}
