CREATE TABLE linhas (
    id_linha INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    resumo VARCHAR(1000) NOT NULL,
    pdf_path VARCHAR(200) NOT NULL,
    orientador VARCHAR(100) NOT NULL,
    orientandos VARCHAR(1000) NOT NULL,
    objetivos VARCHAR(1000) NOT NULL
);
