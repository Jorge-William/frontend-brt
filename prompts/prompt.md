Prompt para Desenvolvimento Guiado por IA: App "Gestor Inteligente"
Contexto Geral do Aplicativo
Você está auxiliando no desenvolvimento de um sistema de gestão para barbearias chamado "Gestor Inteligente". O sistema é uma aplicação web (SPA - Single Page Application) com um menu lateral para navegação principal e uma área de conteúdo dinâmica. O estilo visual deve seguir os princípios do Shadcn UI, utilizando um tema "Zinc" com azul como cor primária de destaque.

Objetivo Principal do Prompt: Guiar a IA na geração de código (HTML, JavaScript para interatividade e UI, e/ou componentes de frontend) e/ou conteúdo textual para cada secção do aplicativo, com base na estrutura de menu e funcionalidades descritas abaixo.

Tecnologias e Estilo (Relembrete):

Frontend: HTML, Tailwind CSS (simulando Shadcn UI), JavaScript (para interatividade e lógica de UI), Chart.js (para gráficos).

Ícones: No menu lateral, usar emojis. Para ícones dentro dos cards ou botões, se necessário, descrever o tipo de ícone (ex: "ícone de calendário", "ícone de dinheiro") ou usar emojis apropriados. Não usar SVG diretamente ou bibliotecas de ícones SVG como Lucide, a menos que seja para descrever o tipo de ícone que seria usado.

Componentes: Simular componentes do Shadcn UI como Cards, Botões, Inputs, Tabelas, Selects, etc., usando as classes Tailwind CSS definidas no exemplo de demonstração.

Estrutura de Menu e Funcionalidades Esperadas por Secção
Por favor, gere o conteúdo/código para as seguintes secções, conforme detalhado:

1. 📊 Dashboard (Painel Principal)

Título da Secção: Painel Principal

Botões de Ação no Cabeçalho da Página:

Botão "Baixar Relatório" (estilo btn-secondary, com ícone 📄).

Conteúdo Esperado:

Grid de Cards de KPI (Indicadores Chave de Desempenho):

Card 1: Faturamento Total

Título: "Faturamento Total"

Ícone no Cabeçalho do Card: 💵

Valor Principal (Exemplo): "R$ 45.231,89" (grande e em negrito)

Descrição/Comparativo (Exemplo): "+20.1% do último mês" (texto menor, cor text-muted-foreground)

Card 2: Novos Clientes

Título: "Novos Clientes"

Ícone no Cabeçalho do Card: ➕

Valor Principal (Exemplo): "+2.350"

Descrição/Comparativo (Exemplo): "+180.1% do último mês"

Card 3: Vendas Hoje

Título: "Vendas Hoje"

Ícone no Cabeçalho do Card: 🛒

Valor Principal (Exemplo): "12.234"

Descrição/Comparativo (Exemplo): "+19% do último mês"

Card 4: Taxa de Retenção

Título: "Taxa de Retenção"

Ícone no Cabeçalho do Card: 🔄

Valor Principal (Exemplo): "73%"

Descrição/Comparativo (Exemplo): "+5% desde o último trimestre"

Card Principal: Gráfico de Visão Geral

Título: "Visão Geral de Visitantes"

Subtítulo/Descrição: "Últimos 12 meses"

Área para Gráfico: <canvas id="mainDashboardChart"></canvas> dentro de um div.chart-container-large.

Instrução para IA: Gerar código JavaScript para um gráfico de linha (Chart.js) com dados de exemplo para visitantes mensais. Estilo do gráfico deve ser limpo, com cores alinhadas ao tema.

Card Secundário: Tabela de Transações Recentes

Título: "Transações Recentes"

Descrição: "Você realizou X vendas este mês."

Tabela (estilo Shadcn) com colunas: "Cliente", "Barbeiro", "Valor", "Data".

Instrução para IA: Popular com 3-5 linhas de dados de exemplo.

Rodapé do Card: "Mostrando as últimas X de Y vendas."

2. 🚶 Fila de Espera

Título da Secção: Gerenciar Fila de Espera

Botões de Ação no Cabeçalho da Página:

Botão "Adicionar à Fila" (estilo btn-primary, com ícone ➕).

Instrução para IA: Este botão deve, idealmente, abrir um modal/formulário para adicionar um novo cliente à fila. Para este prompt, pode apenas indicar a ação com um alert().

Conteúdo Esperado:

Grid de Cards de Estatísticas da Fila:

Card 1: Clientes na Fila

Título: "Clientes na Fila"

Ícone no Cabeçalho do Card: 👥

Valor Principal (Exemplo): "3"

Card 2: Tempo Médio de Espera

Título: "Tempo Médio de Espera"

Ícone no Cabeçalho do Card: ⏱️

Valor Principal (Exemplo): "27 min"

Card 3: Próximo Livre

Título: "Próximo Livre"

Ícone no Cabeçalho do Card: ✂️

Valor Principal (Exemplo): "em 10 min"

Descrição: "Barbeiro Silva"

Card Principal: Tabela da Fila de Espera Atual

Título: "Fila de Espera Atual"

Descrição: "Gerencie os clientes aguardando atendimento."

Tabela (estilo Shadcn) com colunas: "Pos.", "Cliente", "Serviço", "Barbeiro", "Espera Est.", "Status".

Instrução para IA: Popular com 3-4 linhas de dados de exemplo.

Adicionar uma coluna de "Ações" com botões (estilo btn-xs):

"Chamar" (btn-primary)

"Editar" (btn-secondary)

"Remover" (btn-destructive)

Instrução para IA: Estes botões podem acionar alert() com a ação correspondente.

3. 💳 Vendas (POS)

Título da Secção: Módulo de Vendas

Submenus (gerar conteúdo para cada um, se aplicável):

3.1 Nova Transação (PDV)

Título da Sub-secção: Registrar Nova Venda

Descrição: Selecione cliente, profissional, serviços e produtos.

Conteúdo Esperado:

Formulário dentro de um Card, dividido em duas colunas (md):

Coluna 1:

Select "Cliente" (com opção "Selecionar ou Cadastrar Novo").

Select "Profissional".

Select "Serviços" (com opção de múltipla seleção ou botão "Adicionar Serviço").

Coluna 2:

Select "Produtos Adicionais".

Input (number) "Quantidade".

Botão "Adicionar Produto".

Secção "Resumo da Venda" abaixo das colunas:

Texto: "Total Serviços: R$ X,XX"

Texto: "Total Produtos: R$ Y,YY"

Texto (destacado): "Total Geral: R$ Z,ZZ"

Rodapé do Card com Botões: "Salvar Rascunho" (btn-outline), "Finalizar Venda" (btn-primary).

3.2 Histórico de Transações

Título da Sub-secção: Histórico de Vendas

Descrição: Visualize todas as vendas realizadas.

Botões de Ação no Cabeçalho da Página (ou acima da tabela): "Filtrar", "Exportar".

Conteúdo Esperado:

Card contendo uma Tabela (estilo Shadcn) com colunas: "ID", "Data", "Cliente", "Profissional", "Total", "Status".

Instrução para IA: Popular com 3-5 linhas de dados de exemplo.

Coluna de "Ações" com botões (estilo btn-xs): "Detalhes" (btn-outline), "Reembolsar" (btn-destructive).

Rodapé do Card: "Mostrando X-Y de Z transações."

3.3 Gestão de Caixa

Título da Sub-secção: Gestão de Caixa

Descrição: Controle aberturas, fechamentos, sangrias e suprimentos.

Conteúdo Esperado:

Card com botões de ação: "Abrir Caixa", "Fechar Caixa", "Registrar Sangria", "Registrar Suprimento".

Área para exibir o status atual do caixa (Aberto/Fechado, Saldo Atual).

Uma tabela simples ou lista das últimas movimentações do caixa.

4. 📦 Estoque

Título da Secção: Módulo de Estoque

Submenus:

4.1 Produtos

4.1.1 Listar Produtos

Título da Sub-secção: Lista de Produtos

Botões de Ação no Cabeçalho da Página (ou acima da tabela): "Adicionar Novo Produto" (btn-primary).

Conteúdo Esperado:

Card contendo uma Tabela (estilo Shadcn) com colunas: "Cód.", "Nome do Produto", "Categoria", "Preço Venda", "Estoque Atual".

Instrução para IA: Popular com 3-5 linhas de dados de exemplo.

Coluna de "Ações" com botões (estilo btn-xs): "Editar" (btn-secondary), "Excluir" (btn-destructive).

4.1.2 Cadastrar/Editar Produto

Título da Sub-secção: Cadastrar Novo Produto (ou Editar Produto)

Conteúdo Esperado:

Formulário dentro de um Card com campos:

Input "Nome do Produto"

Textarea "Descrição"

Grid (md:grid-cols-2): Select "Categoria", Input "Código/SKU"

Grid (md:grid-cols-3): Input (number) "Preço de Custo (R$)", Input (number) "Preço de Venda (R$)", Input (number) "Estoque Atual"

Input (number) "Estoque Mínimo (Alerta)"

Input "Fornecedor"

Rodapé do Card com Botão: "Cadastrar Produto" ou "Salvar Alterações" (btn-primary).

4.2 Categorias de Produtos

Título da Sub-secção: Categorias de Produtos

Conteúdo Esperado: Interface simples para listar, adicionar, editar e excluir categorias. Pode ser uma tabela com um botão "Nova Categoria".

4.3 Ajustes de Estoque

Título da Sub-secção: Ajustes de Estoque

Conteúdo Esperado: Formulário para registrar entradas (compras) ou saídas (perdas, uso interno) manuais de estoque, selecionando o produto e a quantidade.

5. 👤 Clientes (CRM)

Título da Secção: Módulo de Clientes

Submenus:

5.1 Listar Clientes

Título da Sub-secção: Lista de Clientes

Botões de Ação no Cabeçalho da Página (ou acima da tabela): "Adicionar Novo Cliente" (btn-primary).

Conteúdo Esperado:

Card contendo uma Tabela (estilo Shadcn) com colunas: "Nome", "Telefone", "Email", "Última Visita".

Instrução para IA: Popular com 3-5 linhas de dados de exemplo.

Coluna de "Ações" com botões (estilo btn-xs): "Ver Perfil" (btn-outline), "Editar" (btn-secondary).

5.2 Cadastrar Novo Cliente

Título da Sub-secção: Cadastrar Novo Cliente

Conteúdo Esperado:

Formulário dentro de um Card com campos:

Input "Nome Completo"

Input (tel) "Telefone"

Input (email) "E-mail"

Input (date) "Data de Nascimento"

Textarea "Observações (Preferências, alergias, etc.)"

Rodapé do Card com Botão: "Cadastrar Cliente" (btn-primary).

6. ⚙️ Configurações

Título da Secção: Configurações Gerais

Submenus:

6.1 Perfil da Barbearia

Título da Sub-secção: Perfil da Barbearia

Descrição: Edite as informações do seu estabelecimento.

Conteúdo Esperado:

Formulário dentro de um Card com campos:

Input "Nome da Barbearia"

Input (tel) "Telefone Principal"

Input (email) "E-mail de Contato"

Textarea "Endereço Completo"

Textarea "Horários de Funcionamento"

Input (file) "Logo da Barbearia"

Rodapé do Card com Botão: "Salvar Alterações" (btn-primary).

6.2 Serviços

Título da Sub-secção: Gerenciar Serviços

Conteúdo Esperado: Interface para listar, adicionar, editar e excluir serviços (Nome, Duração, Preço, Categoria). Similar à gestão de produtos.

7. 📅 Agenda

Título da Secção: Agenda Geral

Conteúdo Esperado:

Instrução para IA: Esta secção deve apresentar uma visualização de calendário interativa (simulada ou placeholder para uma biblioteca de calendário completa).

Botões para alternar visualização: "Dia", "Semana", "Mês".

Filtro por "Profissional".

Área principal exibindo blocos de agendamentos.

Botão "Novo Agendamento" (btn-primary).

8. 📈 Relatórios

Título da Secção: Central de Análises

Conteúdo Esperado:

Uma lista ou grid de cards, cada um representando um tipo de relatório disponível (Ex: "Relatório de Faturamento", "Relatório de Desempenho de Barbeiros", "Relatório de Estoque").

Clicar em um relatório levaria a uma tela com filtros específicos e a exibição do relatório (tabela e/ou gráfico).

Instrução para IA: Para este prompt, pode listar os tipos de relatório e, para um ou dois exemplos, simular a tela de filtro e um placeholder para a tabela/gráfico do relatório.

9. 📣 Marketing

Título da Secção: Ferramentas de Marketing

Conteúdo Esperado:

Secções ou abas para:

Campanhas de E-mail/SMS: Interface para criar nova campanha (selecionar público, escrever mensagem, agendar) e listar campanhas enviadas.

Programa de Fidelidade: Configurações do programa (regras de pontuação, recompensas) e visualização de status de clientes.

Instrução para IA: Simular a interface de criação de uma campanha de e-mail simples e a configuração de uma regra de fidelidade.

Observações Finais para a IA:

Mantenha a consistência visual com o estilo Shadcn UI simulado.

Onde dados de exemplo são solicitados, use informações plausíveis para o contexto de uma barbearia.

A interatividade principal do menu lateral (expandir/recolher, destacar ativo) já está implementada na demonstração base; foque no conteúdo das secções.

Para ações de botões que implicariam lógica de backend complexa (ex: salvar formulário, processar pagamento), um alert() indicando a ação é suficiente para este prompt de UI.