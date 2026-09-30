const path = require('path');
const publicacao = require(path.resolve(__dirname + '/../modelos/publicacao.cjs'));

exports.createpublicacao = (req, res) => {
    const newPublicacaoData = req.body;
    console.log(newPublicacaoData);

    const newPublicacao = publicacao.create(newPublicacaoData);
    res.send(newPublicacao);
}

exports.getpublicacao = async (req, res) => {
    const publicacaoID = Number(req.params.publicacaoID); // Tratar dados
    const getPublicacao = await publicacao.getByID(publicacaoID); // mudar nome
    res.render('publicacao', { publicacao: getPublicacao });
}
