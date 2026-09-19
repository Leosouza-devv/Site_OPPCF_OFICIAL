const path = require('path');
const db = require(path.resolve(__dirname + '/../database/db.cjs'));
const { 
    createPublicacao: createPublicacao,
    getPublicacaoByID: getPublicacaoByID
} = require(path.resolve(__dirname + '/../database/queries.cjs'));


class Publicacao {
    // (tipo, titulo, autores, resumo, abstract, pdf_path, id_linhas)
    constructor(tipo, titulo, autores, resumo, abstract, pdf_path, id_linhas) {
        this.tipo = tipo;
        this.titulo = titulo;
        this.autores = autores;
        this.resumo = resumo;
        this.abstract = abstract;
        this.pdf_path = pdf_path;
        this.id_linhas = id_linhas;
    }

    static create(newPublicacao) {
        db.pool(createPublicacao, 
            [newPublicacao.tipo, newPublicacao.titulo, newPublicacao.autores, newPublicacao.resumo, newPublicacao.abstract, newPublicacao.pdf_path, newPublicacao.id_linhas],
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }

    static getByID(id_Publicacoes) {
        db.pool(getPublicacaoByID, 
            [id_Publicacoes], 
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }
}