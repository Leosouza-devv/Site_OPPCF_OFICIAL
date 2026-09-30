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
        return new Promise((resolve, reject) => {
            db.pool.query(createUser, 
                [newUser.nome, newUser.email, newUser.senha_hash, newUser.id_acesso],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    }

    static async getByEmail(email) {
        return new Promise((resolve, reject) => {
            db.pool.query(getUserByEmail, 
                [email], 
                (err, results) => {
                    if (err) reject(err);
                    console.log(results);
                    resolve(results);
                }
            );

        });
    }

    static async getByID(id_usuarios) {
        return new Promise((resolve, reject) => {
            db.pool.query(getUserByID, 
                [id_usuarios], 
                (err, results) => {
                    if (err) reject(err);
                    console.log(results);
                    resolve(results);
                }
            );

        });
    }
}

module.exports = Usuario;