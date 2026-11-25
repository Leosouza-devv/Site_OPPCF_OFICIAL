CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    id_acesso VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS linhas (
    id_linha INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    resumo VARCHAR(1000),
    pdf_path VARCHAR(200),
    orientador VARCHAR(100),
    orientandos VARCHAR(1000),
    objetivos VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS publicacoes (
    id_publicacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    autores VARCHAR(400) NOT NULL,
    resumo VARCHAR(3000),
    abstract VARCHAR(3000),
    pdf_path VARCHAR(200),
    id_linha INT,
    FOREIGN KEY (id_linha)
    REFERENCES  linhas(id_linha)
);
