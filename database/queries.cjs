
const createUser = `
INSERT INTO users 
(nome, email, senha_hash, id_acesso) 
VALUES
(?, ?, ?, ?)
`;

const getUserByEmail = `
SELECT * FROM users WHERE email = ?
`

const getUserByID = `
SELECT * FROM users WHERE id_usuario = ?
`

const createLinha = `
INSERT INTO linhas
(nome, resumo, pdf_path, orientador, orientandos, objetivos)
VALUES
(?, ?, ?, ?, ?, ?)
`

const getLinhaByID = `
SELECT * FROM linhas WHERE id_linhas = ?
`

const createPublicacao = `
INSERT INTO publicacao
(tipo, titulo, autores, resumo, abstract, pdf_path, id_linhas)
VALUES
(?, ?, ?, ?, ?, ?, ?)
`

const getPublicacaoByID = `
SELECT * FROM publicacoes WHERE id_publicacoes = ?
`

module.exports = {
    createUser,
    getUserByEmail,
    getUserByID,
    createLinha,
    getLinhaByID,
    createPublicacao,
    getPublicacaoByID
}