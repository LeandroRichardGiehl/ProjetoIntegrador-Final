const usuario = JSON.parse(localStorage.getItem('usuario'));
const headerButton = document.getElementById('voltar-index');

headerButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

function getUsuarioNome() {
  const nome = usuario.nome
  return nome
}

function getRandomImageUrl() {
  return `https://picsum.photos/seed/${Math.random()}/50`; // Usando Math.random() para garantir uma imagem diferente
}

async function submitTestimonial() {
  const testimonialInput = document.getElementById('testimonialInput');
  const testimonialText = testimonialInput.value.trim();
  if (testimonialText === '') return;

  const nomeUsuario = getUsuarioNome();

  const testimonial = {
    text: testimonialText,
    nome: nomeUsuario
  };

  try {
    const response = await fetch('http://localhost:3000/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testimonial)
    });

    if (!response.ok) throw new Error('Erro ao salvar o depoimento.');

    loadTestimonials();

    testimonialInput.value = '';

    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerText = 'Seu depoimento foi enviado com sucesso! 🌟';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  } catch (error) {
    console.error('Erro:', error);
  }
}
async function loadTestimonials() {
  try {
    const response = await fetch('http://localhost:3000/testimonials');
    if (!response.ok) throw new Error('Erro ao carregar depoimentos.');

    const testimonials = await response.json();
    const testimonialList = document.getElementById('testimonialList');
    const showMoreButton = document.getElementById('showMoreButton');

    // Limpar a lista de depoimentos
    testimonialList.innerHTML = '';

    // Adicionar depoimentos à lista
    testimonials.forEach((item, index) => {
      if (index < visibleTestimonials) {
        const newTestimonial = document.createElement('div');
        newTestimonial.classList.add('testimonial-item');
        newTestimonial.innerHTML = `
          <img src="${getRandomImageUrl()}" alt="Foto do perfil">
          <div class="testimonial-content">
            <span class="profile-name">${item.nome}</span>
            <div class="text">${item.text}</div>
          </div>
        `;
        testimonialList.appendChild(newTestimonial);
      }
    });

    // Mostrar ou ocultar o botão "Mostrar Mais"
    if (testimonials.length > visibleTestimonials) {
      showMoreButton.style.display = 'block';
    } else {
      showMoreButton.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao carregar depoimentos:', error);
    // Mostrar a notificação de erro
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerText = 'Erro ao carregar depoimentos. Tente novamente mais tarde.';
    document.body.appendChild(notification);
    
    // Remover a notificação após 5 segundos
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 500); // Tempo de animação
    }, 5000); // Tempo para exibição
  }
}
let visibleTestimonials = 6;

document.getElementById('showMoreButton').addEventListener('click', () => {
  visibleTestimonials += 6;
  loadTestimonials();
});

// Carregar depoimentos ao iniciar a página
window.addEventListener('load', loadTestimonials);