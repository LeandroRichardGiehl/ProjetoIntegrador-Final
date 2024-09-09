document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const symptomsForm = document.getElementById('symptomsForm');

    // Função para adicionar resposta
    symptomsForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
    
        fetch('http://localhost:3000/api/adicionar-resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            const resultadoFinal = data.resultadoFinal;
            window.location.href = `analysis.html?analysis=${encodeURIComponent(resultadoFinal)}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

