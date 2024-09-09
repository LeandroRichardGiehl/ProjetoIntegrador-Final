const diseases = {
    "gonorreia": "Dor ao urinar, secreção amarela ou verde, dor abdominal.",
    "clamídia": "Dor ao urinar, secreção vaginal ou peniana anormal, dor abdominal.",
    "sífilis": "Úlceras indolores nos genitais, erupção cutânea, febre, dor de garganta.",
    "herpes genital": "Bolhas doloridas nos genitais, coceira, dor ao urinar.",
    "hpv": "Pode não apresentar sintomas, mas pode causar verrugas genitais.",
    "hiv": "Febre, dor de garganta, erupção cutânea, perda de peso inexplicada."
};

const responses = {
    "Como posso prevenir doenças sexualmente transmissíveis?": "O uso de preservativos, realização de testes regulares e manter relações sexuais seguras são formas eficazes de prevenir DSTs.",
    "Quais são os métodos de proteção mais eficazes contra dsts?": "Os preservativos são o método mais eficaz para prevenir a maioria das DSTs. Além disso, vacinas para HPV e hepatite também são recomendadas.",
    "Qual é o tratamento para gonorreia?": "Para informações sobre tratamento, consulte um médico ou profissional de saúde.",
    "Como tratar clamídia de forma eficaz?": "Para informações sobre tratamento, consulte um médico ou profissional de saúde.",
    "O que causa a sífilis?": "A sífilis é causada pela bactéria Treponema pallidum e é transmitida principalmente por contato sexual desprotegido.",
    "Como ocorre a transmissão do hiv?": "O HIV é transmitido através do contato com fluidos corporais infectados, como sangue, sêmen e fluidos vaginais. Pode ocorrer através de relações sexuais desprotegidas, compartilhamento de agulhas ou da mãe para o bebê durante a gravidez ou amamentação."
};

function saveChatState() {
    const chatBody = document.getElementById('chatbot-body');
    sessionStorage.setItem('chatContent', chatBody.innerHTML);
}

function loadChatState() {
    const savedContent = sessionStorage.getItem('chatContent');
    if (savedContent) {
        document.getElementById('chatbot-body').innerHTML = savedContent;
    }
}

function sendMessage(userInput) {
    if (!userInput) {
        userInput = document.getElementById('user-input').value.toLowerCase();
        if (!userInput) return;
    }

    appendMessage(userInput, 'user-message');

    let botResponse = fallbackResponse;

    for (const [key, value] of Object.entries(responses)) {
        if (userInput.includes(key)) {
            botResponse = value;
            break;
        }
    }

    for (const [disease, symptoms] of Object.entries(diseases)) {
        if (userInput.includes(disease)) {
            botResponse = `Sintomas da ${capitalizeFirstLetter(disease)}: ${symptoms}`;
            break;
        }
    }

    appendMessage(botResponse, 'bot-message');

    document.getElementById('user-input').value = '';

    setTimeout(showCategoryOptions, 1000);
}

function appendMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = text;

    document.getElementById('chatbot-body').appendChild(messageElement);
    document.getElementById('chatbot-body').scrollTop = document.getElementById('chatbot-body').scrollHeight;
}

function showCategoryOptions() {
    const categoriesHtml = `
        <button class="category-button" onclick="showCategoryQuestions('prevenção')">Prevenção</button>
        <button class="category-button" onclick="showCategoryQuestions('tratamento')">Tratamento</button>
        <button class="category-button" onclick="showCategoryQuestions('causa')">Causa</button>
        <button class="category-button" onclick="showDiseaseList()">Sintomas</button>
    `;

    if (!document.getElementById('chatbot-body').innerHTML.includes(categoriesHtml)) {
        appendMessage(`Selecione uma categoria de ajuda:<br>${categoriesHtml}`, 'bot-message');
    }
}

function showCategoryQuestions(category) {
    let response;
    if (category === 'prevenção') {
        response = `Selecione uma pergunta sobre prevenção de DSTs:<br>
            <button class="option-button" onclick="sendMessage('Como posso prevenir doenças sexualmente transmissíveis?')">Como posso prevenir doenças sexualmente transmissíveis?</button><br>
            <button class="option-button" onclick="sendMessage('Quais são os métodos de proteção mais eficazes contra dsts?')">Quais são os métodos de proteção mais eficazes contra DSTs?</button>
        `;
    } else if (category === 'tratamento') {
        response = `Para informações sobre tratamento, consulte um médico ou profissional de saúde. Eles podem fornecer um diagnóstico preciso e tratamento adequado.`;
    } else if (category === 'causa') {
        response = `Selecione uma pergunta sobre a causa de DSTs:<br>
            <button class="option-button" onclick="sendMessage('O que causa a sífilis?')">O que causa a sífilis?</button><br>
            <button class="option-button" onclick="sendMessage('Como ocorre a transmissão do hiv?')">Como ocorre a transmissão do HIV?</button>
        `;
    }

    appendMessage(response, 'bot-message');
}

function showDiseaseList() {
    const diseasesHtml = Object.keys(diseases).map(disease => 
        `<button class="option-button" onclick="sendMessage('${disease}')">${capitalizeFirstLetter(disease)}</button>`
    ).join('<br>');

    appendMessage(`Escolha uma doença para ver os sintomas:<br>${diseasesHtml}`, 'bot-message');
}

function handleOptionClick(option) {
    if (option.includes("Se conectar com uma profissional")) {
        appendMessage("Você será conectado com uma profissional em breve.", 'bot-message');
    } else {
        sendMessage(option);
    }
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggleButton = document.getElementById('chatbot-toggle');
    
    if (chatbot) {
        chatbot.classList.toggle('active');

        if (chatbot.classList.contains('active')) {
            showCategoryOptions();
        }

        toggleButton.style.opacity = chatbot.classList.contains('active') ? '0' : '1';
        toggleButton.style.transform = chatbot.classList.contains('active') ? 'scale(0)' : 'scale(1)';

        if (!chatbot.classList.contains('active')) {
            saveChatState();
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadChatState();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}