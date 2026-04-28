# 🎬 FilmView

Um catálogo interativo de filmes e séries desenvolvido com **Next.js (App Router)** e **TypeScript**, consumindo a API REST do TMDB (The Movie Database). O projeto foca em uma experiência de usuário fluida, com design responsivo, paginação e modais de detalhes.

## 🚀 Funcionalidades

- **Exploração de Catálogo:** Listagem dinâmica de filmes e séries populares.
- **Busca Inteligente:** Pesquisa integrada de títulos (filmes e TV) com paginação de resultados.
- **Detalhes em Modal:** Visualização de sinopse, nota do público, data de lançamento, gêneros e trailers diretamente na tela.
- **Design Responsivo:** Interface totalmente adaptada para Desktop, Tablet e Mobile (Celular).
- **Deploy Contínuo:** Aplicação hospedada na Vercel com integração direta ao GitHub.

## 🛠️ Tecnologias Utilizadas

- **Next.js 14+** (Framework React com App Router)
- **TypeScript** (Tipagem estática)
- **SCSS / SASS** (Estilização modular)
- **Axios** (Consumo de API)
- **TMDB API** (Fonte de dados)
- **Vercel** (Hospedagem e CI/CD)

## 💻 Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado.
- Uma chave de API gratuita do [TMDB](https://www.themoviedb.org/).

### Passo a passo
Siga os comandos abaixo no seu terminal para configurar o ambiente:

```bash
# 1. Clone o repositório
git clone [https://github.com/pedroccarrijo/FilmView.git](https://github.com/pedroccarrijo/FilmView.git)

# 2. Entre na pasta do projeto
cd FilmView

# 3. Instale todas as dependências
npm install

# 4. Configure a chave da API
# Crie um arquivo chamado .env.local na raiz e adicione sua chave:
# NEXT_PUBLIC_TMDB_API_KEY=sua_chave_aqui

# 5. Inicie o projeto em modo de desenvolvimento
npm run dev