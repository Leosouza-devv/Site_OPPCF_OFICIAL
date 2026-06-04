# Relatorio de Conversao para Site Estatico

## Resultado

O projeto foi convertido para um site estatico, sem dependencia de Node.js, Express, banco de dados, APIs proprias, login, cadastro ou servidor.

Estrutura final:

```text
/
├── index.html
├── paginas/
├── css/
├── js/
└── assets/
    └── imagens/
```

## Arquivos removidos

- `app.js`: servidor Express, rotas HTTP e APIs de login, cadastro, health e pesquisas.
- `db.js`: conexao MySQL via `mysql2/promise`.
- `.env`: variaveis de ambiente de banco/servidor.
- `.gitignore`: metadado de desenvolvimento nao necessario para hospedagem estatica.
- `package.json`: scripts e dependencias Node.js.
- `package-lock.json`: lockfile de dependencias Node.js.
- `vercel.json`: configuracao de deploy serverless/Vercel.
- `node_modules/`: dependencias instaladas de Node.js.
- `public/HTML/login.html`: pagina dependente de autenticacao/cadastro.
- `public/Arquivos_CSS&JS/CSS/login.css`: estilos exclusivos da pagina de login.
- `public/Arquivos_CSS&JS/Scripts/login.js`: chamadas `/api/login` e `/api/cadastro`.
- `public/Arquivos_CSS&JS/Scripts/pach.js`: chamada `fetch('/api/pesquisas')`.
- Pasta `public/`: removida apos migracao dos arquivos visuais para a estrutura estatica final.

## Arquivos modificados ou reorganizados

- `public/HTML/index.html` -> `index.html`.
- `public/HTML/*.html` -> `paginas/*.html`, exceto `login.html`.
- `public/Arquivos_CSS&JS/CSS/*.css` -> `css/*.css`, exceto `login.css`.
- `public/Arquivos_CSS&JS/Scripts/*.js` -> `js/*.js`, exceto `login.js` e `pach.js`.
- `public/img/*` -> `assets/imagens/*`.
- Caminhos de CSS, JavaScript e imagens foram atualizados para a nova estrutura.
- A referencia ao script dinamico `pach.js` foi removida de `paginas/linha_1.html`.
- O caminho da imagem de fundo em `css/paginaInicio.css` foi atualizado para `../assets/imagens/...`.

## Arquivos mantidos

- Paginas estaticas: `index.html`, `paginas/Eventos.html`, `paginas/FaleConosco.html`, `paginas/LinhasDePesquisa_Geral.html`, `paginas/linha_1.html`, `paginas/linha_2.html`, `paginas/linha_3.html`, `paginas/linha_4.html`, `paginas/PoliticasDePrivacidade.html`, `paginas/TermoDeUsoEticoDaIA.html`.
- Estilos visuais do site em `css/`.
- Scripts de interface em `js/`: menu, rodape, botao de topo e banner de cookies.
- Imagens e logos em `assets/imagens/`.

## Verificacao final

- Sem Node.js: confirmado, nao restam `package.json`, scripts de servidor ou dependencias Node.
- Sem banco de dados: confirmado, `db.js`, `.env` e chamadas MySQL foram removidos.
- Sem APIs proprias: confirmado, nao restam chamadas `fetch('/api/...')`.
- Hospedagem cPanel: confirmado, o conteudo pode ser enviado diretamente para `public_html`.
- Referencias locais: verificado que os arquivos locais apontados por `href`, `src` e `url(...)` existem.
