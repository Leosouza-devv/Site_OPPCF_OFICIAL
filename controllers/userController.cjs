const path = require('path');
const user = require(path.resolve(__dirname + '/../modelos/user.cjs'));

exports.createUser = (req, res) => {
    const newUserData = req.body;

    const newUser = user.Usuario.create(newUserData);
    res.send(newUser);
}

exports.getUser = (req, res) => {
    const userID = req.params.userID; // Tratar dados
    const getuser = user.Usuario.getByID(userID); // mudar nome
    res.send(user);
}