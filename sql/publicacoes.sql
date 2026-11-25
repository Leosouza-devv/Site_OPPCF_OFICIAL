CREATE TABLE publicacoes (
    id_publicacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    autores VARCHAR(1000) NOT NULL,
    resumo VARCHAR(1000) NOT NULL,
    abstract VARCHAR(1000) NOT NULL,
    pdf_path VARCHAR(200) NOT NULL,
    id_linha INT NOT NULL,
    FOREIGN KEY (id_linha) 
    REFERENCES linhas(id_linha)
);