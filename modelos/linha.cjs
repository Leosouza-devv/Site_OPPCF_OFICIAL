const path = require('path');
const db = require(path.resolve(__dirname + '/../database/db.cjs'));
const { 
    createLinha: createLinha,
    getLinhaByID: getLinhaByID
} = require(path.resolve(__dirname + '/../database/queries.cjs'));


class Linha {
    constructor(nome, resumo, pdf_path, orientador, orientandos, objetivos) {
        this.nome = nome;
        this.resumo = resumo;
        this.pdf_path = pdf_path;
        this.orientador = orientador;
        this.orientandos = orientandos;
        this.objetivos = objetivos;
    }

    static create(newLinha) {
        db.pool(createLinha, 
            [newLinha.nome, newLinha.resumo, newLinha.pdf_path, newLinha.orientador, newLinha.orientandos, newLinha.objetivos],
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }

    static getByID(id_linhas) {
        db.pool(getLinhaByID, 
            [id_linhas], 
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }
}