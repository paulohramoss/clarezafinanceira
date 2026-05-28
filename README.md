# Clareza Financeira

Aplicação web financeira simples, clara e orientada para pessoas comuns.

Frase principal: **Entenda seu dinheiro sem complicação.**

O objetivo do produto é ajudar o usuário a abrir o sistema e entender rapidamente:

- quanto tem;
- quanto entrou;
- quanto saiu;
- quanto ainda pode gastar;
- quais contas estão vencendo;
- onde está gastando demais;
- o que precisa fazer agora.

O app não recomenda investimentos específicos, não promete enriquecimento e não substitui contador, banco, consultor ou profissional financeiro.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Firebase Auth e Cloud Firestore
- Zod
- React Hook Form
- Recharts
- Lucide React
- OpenAI API opcional para o Copiloto

## Funcionalidades

- Landing page
- Login, cadastro e recuperação de senha com Firebase Auth
- Onboarding inicial
- Dashboard com visão simples
- Resumo de hoje e próxima melhor ação
- Cálculo de "pode gastar com segurança"
- Central de alertas e insights automáticos por regras locais
- Transações com CRUD e filtros
- Contas a pagar/receber com status
- Dívidas com progresso e impacto na renda
- Metas com sugestão mensal simples
- Relatório mensal simples com maiores gastos, contas pagas, dívidas, metas, insights e recomendações gerais
- Relatórios com gráficos claros
- Assinaturas recorrentes detectadas por recorrência, repetição e palavras-chave
- Copiloto financeiro com IA opcional e fallback local
- Importação CSV com preview, mapeamento de colunas, deduplicação e categorização simples
- Configurações, exportação CSV, relatório PDF, resumo simples, anonimização e exclusão de dados financeiros
- Modo simples/detalhado com fonte maior
- Manifest e ícones para preparação PWA
- Dados demo para primeira experiência

## Como rodar

```bash
npm install
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dashboard-c23c8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dashboard-c23c8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dashboard-c23c8.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=115815405530
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
OPENAI_API_KEY=
OPENAI_MODEL=
```

`OPENAI_API_KEY` é opcional. Sem ela, o Copiloto responde usando uma análise local baseada no resumo financeiro.

As variáveis `NEXT_PUBLIC_FIREBASE_*` vêm do app Web em **Firebase Console > Configurações do projeto > Geral > Seus apps**.

## Firebase

O app usa Firebase Auth para login/cadastro/recuperação de senha e Cloud Firestore para os dados financeiros.

A estrutura no Firestore é:

- `users/{uid}` para o perfil;
- `users/{uid}/institutions`;
- `users/{uid}/accounts`;
- `users/{uid}/categories`;
- `users/{uid}/transactions`;
- `users/{uid}/bills`;
- `users/{uid}/debts`;
- `users/{uid}/goals`.

As regras ficam em:

```text
firestore.rules
```

Para publicar as rules no projeto `dashboard-c23c8`, use a Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Dados demo

O botão **Ver exemplo com dados fictícios** abre a dashboard com dados locais de demonstração:

- renda mensal de R$ 3.500;
- aluguel, mercado, transporte, delivery, internet e cartão;
- meta de reserva;
- dívida de empréstimo.

Isso permite entender o produto antes de conectar Firebase ou cadastrar dados reais.

## Importação CSV

Rota:

```text
/importar
```

Formato básico aceito:

```csv
date,description,amount,type,category
2026-05-22,Mercado,120.50,expense,Mercado
2026-05-22,Salário,3500,income,Salário
```

Também funciona com cabeçalhos em português, como `data`, `descricao`, `valor`, `tipo`, `categoria`.

Se o `type` não vier preenchido, o importador tenta detectar:

- valor negativo: saída;
- valor positivo: entrada;
- palavras como Netflix, Spotify, iCloud, Google, academia, internet e celular para assinatura/categoria simples.

Antes de importar, a tela mostra um preview e ignora duplicatas com mesma data, descrição, valor e tipo.

## Segurança e privacidade

- Não insira senhas bancárias.
- Não insira número completo de cartão.
- Inputs principais são validados com Zod.
- Firestore Rules protegem os dados por usuário via `request.auth.uid`.
- O usuário pode exportar transações em CSV, relatório mensal em PDF e resumo simples.
- O usuário pode apagar dados financeiros ou anonimizar descrições, títulos e nomes cadastrados.

## PWA

O projeto inclui:

- `src/app/manifest.ts`;
- `public/icon.svg`;
- `public/maskable-icon.svg`;
- metadados mobile no layout raiz.

Isso prepara o app para instalação como web app no celular. Um service worker/offline cache pode ser adicionado em uma etapa futura.

## Limitações do MVP

- Sem Open Finance.
- Sem integração bancária automática.
- Sem notificações externas.
- Saldo de contas não é conciliado automaticamente com cada transação.
- O Copiloto não substitui orientação profissional.
- Os dados demo/localStorage são para experiência inicial, não para produção multi-dispositivo.

## Próximos passos planejados

- Conexão Open Finance respeitando regulações.
- App mobile.
- Notificações por WhatsApp.
- Lembretes de contas.
- Análise de PDF/CSV de extrato.
- Importação OFX.
- Modo família.
- Compartilhamento com cônjuge.
- Permissões por usuário.
- Assinatura premium.
- Integração com bancos, se viável.
- Suporte a múltiplas moedas.
- Trilhas simples de educação financeira.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```
