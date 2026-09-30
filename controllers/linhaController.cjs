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
    const getLinha = await linha.getByID(linhaID); // mudar nome
    console.log(getLinha);
    res.render('linha', { nome: getLinha[0].nome, resumo: getLinha[0].resumo, pdf_path: getLinha[0].pdf_path, orientador: getLinha[0].orientador, orientandos: getLinha[0].orientandos, objetivos: getLinha[0].objetivos });
}
