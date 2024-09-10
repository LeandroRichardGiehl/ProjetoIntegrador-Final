const container = document.getElementById("container");
const registerBtn = document.getElementById("cadastro");
const loginBtn = document.getElementById("login");
const headerButton = document.getElementById("voltar-index");

headerButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

const loginForm = document.getElementById("form-login");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const loginEmail = document.getElementById("email").value;
  const loginSenha = document.getElementById("senha").value;

  fetch("http://localhost:3000/usuario")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha ao buscar dados dos usuários");
      }
      return response.json();
    })
    .then((data) => {
      const usuarioEncontrado = data.find(
        (user) => user.email === loginEmail && user.senha === loginSenha
      );

      if (usuarioEncontrado) {
        alert("Login realizado com sucesso");
        console.log("login realizado");

        localStorage.setItem("logado", true);
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));

        window.location.href = "perfil.html";
      } else {
        alert("Email ou senha incorretos");
        console.log("erro");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
});
