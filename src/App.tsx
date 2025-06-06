import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/dashboard.page";
import ClientesPage from "./pages/clientes/clientes.page";
import NovaTransacaoPage from "./pages/vendas/nova-transacao.page";
import CriarContaPage from "./pages/onboarding/criando-conta.page";
import VerificarCodigoPage from "./pages/onboarding/valida-codigo/verificar-codigo.page";
import PagamentoPage from "./pages/assinatura/pagamento.page";
import { Toaster } from "@/components/ui/sonner";
import ConfigBarbearia from "./pages/onboarding/barbershop-setup/config-barbearia.page";
import { PrimeReactProvider } from "primereact/api";

function App() {
  return (
    <PrimeReactProvider value={{ unstyled: true }}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard/clientes" element={<ClientesPage />} />
          <Route
            path="/vendas/nova-transacao"
            element={<NovaTransacaoPage />}
          />
          <Route path="/onboarding/novo-usuario" element={<CriarContaPage />} />
          <Route
            path="/onboarding/verificar-codigo"
            element={<VerificarCodigoPage />}
          />
          <Route
            path="/onboarding/assinatura"
            element={<PagamentoPage />}
          />
          <Route
            path="/onboarding/barbershop-setup"
            element={<ConfigBarbearia />}
          />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
