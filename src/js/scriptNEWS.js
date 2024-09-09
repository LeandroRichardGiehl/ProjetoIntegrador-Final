const newsForm = document.getElementById('newsletterForm');
const newsList = document.getElementById('news-list'); 
const formList = document.getElementById('news-form')


function listNews() {
  fetch('http://localhost:3000/News')
    .then((response) => response.json())
    .then((data) => {
      newsList.innerHTML = '';
      data.forEach((userN) => {
        const li = document.createElement('li');
        li.innerHTML = ` Nome: ${userN.nome} - Email: ${userN.email} Sobrenome- ${userN.sobrenome} `;
        newsList.appendChild(li);

 
      });
    })
    .catch((error) => console.error('Erro:', error));
}



// submit (GET)
newsForm.addEventListener('submit', (e) => {
  e.preventDefault(); //prevenção padrão de erros
  //pegando os dados do formulário

  const nome = document.getElementById('nomeID').value;
  const email = document.getElementById('emailID').value;
  const sobrenome = document.getElementById('sobrenomeID').value;
  

  fetch('http://localhost:3000/News', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: nome, email: email, sobrenome:sobrenome}),
  })
    .then((response) => response.json())
    .then(() => {
      listNews();
      newsForm.reset();
    
      alert('Inscrição feita com sucesso')
    })
    .catch((error) => console.error('Erro:', error));
   
    
});

listNews()