fetch('/api/pesquisas')
    .then(res => res.json())
    .then(dados => {
      const lista = document.getElementById('lista');
      dados.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nome;
        lista.appendChild(li);
      });
    });