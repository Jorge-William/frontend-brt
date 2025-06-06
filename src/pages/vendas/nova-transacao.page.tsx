import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // <-- Update this path if the file is located elsewhere, e.g. "@/components/form" or "@/components/form/ui"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define form schema with validation rules
const formSchema = z.object({
  cliente: z.string({
    required_error: "Por favor selecione um cliente",
  }),
  servico: z.string({
    required_error: "Por favor selecione um serviço",
  }),
  valor: z.string().min(1, "Por favor digite o valor"),
  pagamento: z.enum(["dinheiro", "debito", "credito", "pix"], {
    required_error: "Por favor selecione o método de pagamento",
  }),
});

// Type inference from schema
type FormValues = z.infer<typeof formSchema>;

export default function NovaTransacaoPage() {
  // Initialize form with validation schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      servico: "",
      valor: "",
      pagamento: undefined,
    },
  });

  // Form submission handler
  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    // TODO: Implement API call
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Page Header with Breadcrumbs */}
        <PageHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/" },
            { title: "Vendas", href: "/vendas" },
            { title: "Nova Transação" },
          ]}
        />

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Cliente Select Field */}
                  <FormField
                    control={form.control}
                    name="cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">João Silva</SelectItem>
                            <SelectItem value="2">Maria Santos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Serviço Select Field */}
                  <FormField
                    control={form.control}
                    name="servico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviço</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="corte">
                              Corte de Cabelo
                            </SelectItem>
                            <SelectItem value="barba">Barba</SelectItem>
                            <SelectItem value="combo">
                              Combo (Corte + Barba)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Valor Input Field */}
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Método de Pagamento Select Field */}
                  <FormField
                    control={form.control}
                    name="pagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pagamento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="debito">
                              Cartão de Débito
                            </SelectItem>
                            <SelectItem value="credito">
                              Cartão de Crédito
                            </SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Finalizar Transação
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
