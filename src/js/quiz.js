const headerButton = document.getElementById('voltar-home');

headerButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

const questions = [
    {
      question: "Qual é uma maneira eficaz de prevenir ISTs?",
      answers: [
        { text: "Usar preservativos", correct: true },
        { text: "Usar maquiagem", correct: false },
        { text: "Fazer exercícios", correct: false },
        { text: "Comer alimentos saudáveis", correct: false }
      ]
    },
    {
      question: "Qual IST é causada por um vírus?",
      answers: [
        { text: "Clamídia", correct: false },
        { text: "Gonorreia", correct: false },
        { text: "Herpes", correct: true },
        { text: "Sífilis", correct: false }
      ]
    },
    {
      question: "Qual é um sintoma comum de ISTs?",
      answers: [
        { text: "Febre alta", correct: false },
        { text: "Coceira genital", correct: true },
        { text: "Dor de cabeça", correct: false },
        { text: "Cansaço extremo", correct: false }
      ]
    },
    {
      question: "Qual IST é conhecida por causar úlceras dolorosas?",
      answers: [
        { text: "Gonorreia", correct: false },
        { text: "Herpes", correct: true },
        { text: "Clamídia", correct: false },
        { text: "Sífilis", correct: false }
      ]
    },
    {
      question: "Qual é a principal maneira de prevenir a infecção por HPV?",
      answers: [
        { text: "Uso de preservativos", correct: false },
        { text: "Vacinação", correct: true },
        { text: "Uso de antibióticos", correct: false },
        { text: "Evitar contato físico", correct: false }
      ]
    },
    {
      question: "Qual sintoma é comum na sífilis primária?",
      answers: [
        { text: "Coceira intensa", correct: false },
        { text: "Úlcera indolor", correct: true },
        { text: "Febre alta", correct: false },
        { text: "Dor de cabeça", correct: false }
      ]
    },
    {
      question: "Qual IST pode ser transmitida durante o parto?",
      answers: [
        { text: "Clamídia", correct: false },
        { text: "Hepatite B", correct: true },
        { text: "Gonorreia", correct: false },
        { text: "Herpes", correct: false }
      ]
    },
    {
      question: "Qual é a principal forma de transmissão do HIV?",
      answers: [
        { text: "Contato com objetos compartilhados", correct: false },
        { text: "Contato sexual desprotegido", correct: true },
        { text: "Picadas de insetos", correct: false },
        { text: "Uso de utensílios pessoais", correct: false }
      ]
    }
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let restartTimeout;
  
  const questionContainer = document.getElementById('question-container');
  const answerButtons = document.getElementById('answer-buttons');
  const nextButton = document.getElementById('next-button');
  const scoreElement = document.getElementById('score');
  const infoButton = document.getElementById('info-button');
  const infoContainer = document.getElementById('info-container');
  const restartButton = document.getElementById('restart-button');
  
  function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.classList.add('hide');
    restartButton.classList.add('hide');
    scoreElement.textContent = `Pontuação: ${score}`;
    showQuestion(questions[currentQuestionIndex]);
  }
  
  function showQuestion(question) {
    questionContainer.querySelector('#question').textContent = question.question;
    answerButtons.innerHTML = '';
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('answer-button');
      button.dataset.correct = answer.correct;
      button.addEventListener('click', () => selectAnswer(button));
      answerButtons.appendChild(button);
    });
  }
  
  function selectAnswer(button) {
    const correct = button.dataset.correct === 'true';
    if (correct) {
      button.classList.add('correct');
      score++;
      scoreElement.textContent = `Pontuação: ${score}`;
    } else {
      button.classList.add('incorrect');
    }
  
    // Desativa todos os botões de resposta
    Array.from(answerButtons.children).forEach(btn => btn.disabled = true);
  
    // Mostra o botão de próxima pergunta após um atraso
    setTimeout(() => {
      nextButton.classList.remove('hide');
    }, 1000); // Ajuste o tempo conforme necessário
  }
  
  function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(questions[currentQuestionIndex]);
    } else {
      showScore();
    }
  }
  
  function showScore() {
    questionContainer.innerHTML = `<p>Você terminou o quiz! Sua pontuação é ${score}.</p>`;
    nextButton.classList.add('hide');
    restartButton.classList.add('hide'); // Remove o botão de reinício
  
    // Reinicia o quiz automaticamente após 3 segundos
    restartTimeout = setTimeout(() => {
      startGame();
    }, 3000); // 3000 milissegundos = 3 segundos
  }
  
  function restartQuiz() {
    clearTimeout(restartTimeout); // Cancela o temporizador de reinício automático, se estiver ativo
    startGame();
  }
  
  nextButton.addEventListener('click', showNextQuestion);
  infoButton.addEventListener('click', () => infoContainer.classList.toggle('hide'));
  restartButton.addEventListener('click', restartQuiz);
  
  // Garantir que o script seja executado quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', startGame);