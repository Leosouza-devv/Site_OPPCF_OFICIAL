const path = require('path');
const user = require(path.resolve(__dirname + '/../modelos/user.cjs'));

exports.createUser = (req, res) => {
    const newUserData = req.body;
    console.log(newUserData);

    const newUser = user.create(newUserData);
    res.send(newUser);
}

exports.getUser = async (req, res) => {
    const userID = Number(req.params.userID); // Tratar dados
    const getUser = await user.getByID(userID); // mudar nome
    res.send(getUser);
}
