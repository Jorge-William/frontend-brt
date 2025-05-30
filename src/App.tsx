import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/dashboard/dashboard.page'
import ClientesPage from './pages/clientes/clientes.page'
import NovaTransacaoPage from './pages/vendas/nova-transacao.page'
import CriarContaPage from './pages/onboarding/criando-conta.page'
import VerificarCodigoPage from './pages/onboarding/verificar-codigo.page'
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/vendas/nova-transacao" element={<NovaTransacaoPage />} />
        <Route path="/onboarding" element={<CriarContaPage />} />
        <Route path="/verificar-codigo" element={<VerificarCodigoPage />} />
        <Route path="/vendas" element={<div>Vendas Page</div>} />
        <Route path="/vendas/reembolso" element={<div>Reembolso Page</div>} />
        <Route path="/vendas/historico" element={<div>Histórico Page</div>} />
        <Route path="/vendas/comanda" element={<div>Comanda Page</div>} />
        <Route path="/estoque" element={<div>Estoque Page</div>} />
        <Route path="/staff" element={<div>Staff Page</div>} />
        <Route path="/design-engineering" element={<div>Design Engineering Page</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
