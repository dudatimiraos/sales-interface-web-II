# Sistema de Ingressos - Interface Web

Interface web moderna para o sistema de vendas de ingressos, desenvolvida com React, TypeScript e shadcn/ui.

## 🚀 Funcionalidades

### 📅 Gerenciamento de Eventos
- Listar todos os eventos
- Criar novos eventos com descrição, tipo, data, período de vendas e preço
- Editar eventos existentes
- Excluir eventos
- Tipos de evento: Show, Teatro, Palestra, Workshop, Outro

### 👥 Gerenciamento de Consumidores
- Listar todos os consumidores
- Cadastrar novos consumidores com nome, CPF e gênero
- Editar dados dos consumidores
- Excluir consumidores
- Validação de CPF com formatação automática

### 💰 Gerenciamento de Vendas
- Listar todas as vendas
- Registrar novas vendas vinculando consumidor e evento
- Atualizar status da venda (Pendente, Pago, Cancelado)
- Excluir vendas
- Visualização detalhada com informações do consumidor e evento

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Vite** - Build tool

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API do backend rodando

## 🔧 Instalação e Configuração

1. **Clone o repositório e instale as dependências:**
```bash
npm install
```

2. **Configure a URL da API:**

Crie um arquivo `.env` na raiz do projeto:
```bash
# URL base da API do backend
VITE_API_BASE_URL=http://localhost:4000

# Para produção, substitua pela URL do seu servidor:
# VITE_API_BASE_URL=https://sua-api.com
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 📡 Configuração da API

A aplicação espera que a API esteja rodando e disponível nos seguintes endpoints:

### Events
- `GET /events` - Listar eventos
- `POST /events` - Criar evento
- `GET /events/{id}` - Obter evento por ID
- `PUT /events/{id}` - Atualizar evento
- `DELETE /events/{id}` - Excluir evento

### Consumers
- `GET /consumers` - Listar consumidores
- `POST /consumers` - Criar consumidor
- `GET /consumers/{id}` - Obter consumidor por ID
- `PUT /consumers/{id}` - Atualizar consumidor
- `DELETE /consumers/{id}` - Excluir consumidor

### Sales
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda
- `GET /sales/{id}` - Obter venda por ID
- `PUT /sales/{id}` - Atualizar venda
- `DELETE /sales/{id}` - Excluir venda

## 🎨 Interface do Usuário

### Navegação
A aplicação possui três seções principais acessíveis através de abas:
- **Eventos** - Gerenciamento de eventos
- **Consumidores** - Cadastro de clientes
- **Vendas** - Controle de vendas de ingressos

### Funcionalidades por Tela

#### Tela de Eventos
- Tabela com todos os eventos cadastrados
- Botão "Novo Evento" para abrir formulário de criação
- Ações de editar e excluir para cada evento
- Formatação automática de datas e valores monetários

#### Tela de Consumidores  
- Lista de consumidores com nome, CPF e gênero
- Formulário com validação de CPF
- Formatação automática do CPF durante digitação

#### Tela de Vendas
- Visualização de vendas com status colorido
- Seleção de consumidor e evento através de dropdowns
- Controle de status (Pendente, Pago, Cancelado)

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   ├── Navigation.tsx  # Navegação principal
│   ├── EventsPage.tsx  # Página de eventos
│   ├── EventForm.tsx   # Formulário de eventos
│   ├── ConsumersPage.tsx # Página de consumidores
│   ├── ConsumerForm.tsx  # Formulário de consumidores
│   ├── SalesPage.tsx     # Página de vendas
│   └── SaleForm.tsx      # Formulário de vendas
├── services/           # Serviços de API
│   └── api.ts         # Cliente HTTP para API
├── types/             # Definições TypeScript
│   └── index.ts       # Tipos das entidades
├── lib/               # Utilitários
├── App.tsx            # Componente principal
└── main.tsx           # Ponto de entrada
```

## 🔨 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter ESLint

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🐛 Tratamento de Erros

A aplicação inclui:
- Notificações toast para feedback do usuário
- Validação de formulários com mensagens de erro
- Tratamento de erros de API
- Estados de carregamento durante requisições

## 🎯 Próximas Melhorias

- [ ] Implementar paginação nas tabelas
- [ ] Adicionar filtros e busca
- [ ] Relatórios de vendas
- [ ] Exportação de dados
- [ ] Tema escuro/claro
- [ ] Responsividade mobile aprimorada
