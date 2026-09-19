const path = require('path');
const db = require(path.resolve(__dirname + '/../database/db.cjs'));
const { 
    createUser: createUser, 
    getUserByID: getUserByID, 
    getUserByEmail: getUserByEmail
} = require(path.resolve(__dirname + '/../database/queries.cjs'));


class Usuario {
    constructor(nome, email, senha_hash, id_acesso) {
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.id_acesso = id_acesso;
    }

    static create(newUser) {
        db.pool(createUser, 
            [newUser.nome, newUser.email, newUser.senha_hash, newUser.id_acesso],
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }

    static getByEmail(email) {
        db.pool(getUserByEmail, 
            [email], 
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }

    static getByID(id_usuarios) {
        db.pool(getUserByEmail, 
            [id_usuarios], 
            (err, results) => {
                if (err) throw err;
                return results;
            }
        );
    }
}

module.exports = Usuario;