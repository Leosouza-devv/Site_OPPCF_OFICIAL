const path = require('path');
const linha = require(path.resolve(__dirname + '/../modelos/linha.cjs'));

exports.createLinha = (req, res) => {
    const newLinhaData = req.body;
    console.log(newLinhaData);

    const newLinha = linha.create(newLinhaData);
    res.send(newLinha);
}

exports.getLinha = async (req, res) => {
    const linhaID = Number(req.params.linhaID); // Tratar dados
    try {
        const linhas = await linha.getByID(linhaID);
        if (!linhas.length) return res.sendStatus(404);
        const getLinha = linhas[0];
        res.render('linha', { nome: getLinha.nome, resumo: getLinha.resumo, pdf_path: getLinha.pdf_path, orientador: getLinha.orientador, orientandos: getLinha.orientandos, objetivos: getLinha.objetivos });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
