
const createUser = `
INSERT INTO usuarios 
(nome, email, senha_hash, id_acesso) 
VALUES
(?, ?, ?, ?)
`;

const getUserByEmail = `
SELECT * FROM usuarios WHERE email = ?
`

const getUserByID = `
SELECT * FROM usuarios WHERE id_usuario = ?
`

const createLinha = `
INSERT INTO linhas
(nome, resumo, pdf_path, orientador, orientandos, objetivos)
VALUES
(?, ?, ?, ?, ?, ?)
`

const getLinhaByID = `
SELECT * FROM linhas WHERE id_linha = ?
`

const createPublicacao = `
INSERT INTO publicacoes
(tipo, titulo, autores, resumo, abstract, pdf_path, id_linha)
VALUES
(?, ?, ?, ?, ?, ?, ?)
`

const getPublicacaoByID = `
SELECT * FROM publicacoes WHERE id_publicacao = ?
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