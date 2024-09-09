const headerButton = document.getElementById('voltar-home');

headerButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.addEventListener("DOMContentLoaded", () => {
  const logado = localStorage.getItem("logado");

  let usuario;

  if (!logado) {
    window.location.href = "login.html";
  } else {
    usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.id) {
      console.error("Usuário ou ID do usuário não encontrado no localStorage.");
      return;
    }

    const idTemp = usuario.id;
    const fotoPerfil = document.getElementById("fotoPerfil");
    fotoPerfil.src = usuario.foto || "caminho_default_da_foto.png";
    document.getElementById("nomeUsuario").textContent = usuario.nome;
    document.getElementById("emailUsuario").textContent = usuario.email;
    document.getElementById("descricaoUsuario").textContent = usuario.descricao;

    fotoPerfil.addEventListener("click", () => {
      document.getElementById("fotoPerfilInput").click();
    });

    document.getElementById("fotoPerfilInput").addEventListener("change", (event) => {
      const reader = new FileReader();
      reader.onload = function () {
        const novaFoto = reader.result;
        fotoPerfil.src = novaFoto;
        usuario.foto = novaFoto;
        atualizarUsuarioAPI(usuario);
      };
      reader.readAsDataURL(event.target.files[0]);
    });

    // Verificação de debug para garantir que os botões estão sendo carregados
    console.log("Botões carregados corretamente.");

    const alterarModalBtn = document.getElementById("alterarDados");
    alterarModalBtn.addEventListener("click", () => {
      console.log("Botão 'Alterar Dados' clicado");
      openModal(usuario);
    });

    const excluirContaBtn = document.getElementById("excluirConta");
    excluirContaBtn.addEventListener("click", () => {
      console.log("Botão 'Excluir Conta' clicado");
      if (confirm("Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
        fetch(`http://localhost:3000/usuario/${usuario.id}`, {
          method: "DELETE"
        })
          .then(response => response.json())
          .then(data => {
            alert(data.mensagem);
            localStorage.removeItem("logado");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
          })
          .catch(error => {
            console.error("Erro ao excluir conta:", error);
            alert("Ocorreu um erro ao excluir sua conta. Tente novamente mais tarde.");
          });
      }
    });

    const alterarForm = document.getElementById("alterarForm");
    alterarForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const novoNome = document.getElementById("nomeModal").value;
      const novoEmail = document.getElementById("emailModal").value;
      const novaSenha = document.getElementById("senhaModal").value;
      const novaDescricao = document.getElementById("descricaoModal").value;

      const usuarioAtualizado = {
        id: idTemp,
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
        descricao: novaDescricao,
        foto: usuario.foto // Manter a foto atual
      };

      console.log("Dados de usuário atualizados:", usuarioAtualizado);

      atualizarUsuarioAPI(usuarioAtualizado);
    });

    const closeModalBtn = document.querySelector(".close");
    closeModalBtn.addEventListener("click", () => {
      const modal = document.getElementById("alterarModal");
      modal.style.display = "none";
    });

    window.onclick = function (event) {
      const modal = document.getElementById("alterarModal");
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    function openModal(usuario) {
      const modal = document.getElementById("alterarModal");
      const nomeInput = document.getElementById("nomeModal");
      const emailInput = document.getElementById("emailModal");
      const senhaInput = document.getElementById("senhaModal");
      const descricaoInput = document.getElementById("descricaoModal");

      nomeInput.value = usuario.nome;
      emailInput.value = usuario.email;
      senhaInput.value = usuario.senha;
      descricaoInput.value = usuario.descricao;

      modal.style.display = "block";
    }

    function atualizarUsuarioAPI(usuario) {
      fetch(`http://localhost:3000/usuario/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      })
        .then(response => response.json())
        .then(data => {
          alert(data.mensagem);
          localStorage.setItem("usuario", JSON.stringify(usuario));
          window.location.reload(); // Atualiza a página para refletir as alterações
        })
        .catch(error => {
          console.error("Erro ao atualizar dados:", error);
          alert("Ocorreu um erro ao atualizar os dados. Tente novamente mais tarde.");
        });
    }
  }

});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("logado");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});
