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
    try {
        const publicacoes = await publicacao.getByID(publicacaoID);
        if (!publicacoes.length) return res.sendStatus(404);
        res.render('publicacao', { publicacao: publicacoes[0] });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
