# 🧠 Restaurant Analytics Dashboard — Nuxt 3

Painel de Analytics para restaurantes desenvolvido com **Nuxt 3**, exibindo métricas como vendas por dia, ticket médio, produtos mais vendidos e desempenho por canal (iFood, WhatsApp, Local, etc).  
O projeto usa **PostgreSQL** com APIs criadas no **server do Nuxt**, e gráficos com **Chart.js**.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- Nuxt 3 (Vue 3)
- Composition API & Composables
- TailwindCSS
- Flowbite UI
- Chart.js

### Backend / Integrações
- Server routes do Nuxt
- PostgreSQL usando `pg`
- SQL puro

### Ferramentas & Infra
- pnpm (gerenciador de pacotes)
- Docker (banco PostgreSQL opcional)

---

## 📊 Funcionalidades

- Gráficos de vendas e ticket médio (Chart.js)
- Filtros por período (7, 30, 90 dias e custom)
- Filtro por canal de vendas (iFood, Local, WhatsApp)
- Dashboard com dados financeiros:
  - Total vendido
  - Total de pedidos
  - Ticket médio
- API organizada em `/server/api`
- Composables para chamadas e lógica reutilizável

---

## 📂 Estrutura do Projeto

```
project/
│── server/
│   └── api/           # APIs e queries SQL
│── composables/       # Funções reutilizáveis
│── components/        # Componentes UI
│── pages/dashboard/   # Páginas de dashboards
│── assets/
```

---

## 🛠️ Instalação

### Requisitos
- Node 18+
- pnpm
- PostgreSQL

### Instalar dependências

```bash
pnpm install
```

### Instalar PostgreSQL Client

```bash
pnpm install pg
```

---

## 🐘 Configuração do Banco

Crie um arquivo `.env` com:

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nomedobanco
```

Para usar PostgreSQL via Docker:

```bash
docker run --name pg-nuxt -e POSTGRES_PASSWORD=123 -p 5432:5432 -d postgres
```

---

## ▶️ Rodar o Projeto

```bash
pnpm run dev
```

Build para produção:

```bash
pnpm build
```

Pré-visualizar:

```bash
pnpm preview
```

---

