const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const port = 3000;
const server = express();
server.use(express.json());
server.use(cors());
server.use(express.json({ limit: "100mb" }));
server.use(express.urlencoded({ limit: "100mb", extended: true }));

const dados = require("./data/usuario.json");
const dadosNews = require("./data/news.json");
const dataFilePath = path.join(__dirname, "data", "dadosDepoimento.json");

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

server.get("/", (req, res) => {
  return res.json({ mensagem: "Estou funcionando!" });
});

server.post("/usuario", (req, res) => {
  const { nome, email, senha, foto, descricao } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Dados incompletos, tente novamente" });
  } else {
    const novoUsuario = {
      id: dados.Usuarios.length + 1,
      nome,
      email,
      senha,
      foto: foto || "caminho_default_da_foto.png",
      descricao: descricao || "",
    };

    dados.Usuarios.push(novoUsuario);
    salvarDados();

    return res
      .status(201)
      .json({ mensagem: "Dados completos, cadastro feito com sucesso" });
  }
});

server.get("/usuario", (req, res) => {
  return res.json(dados.Usuarios);
});

server.put("/usuario/:id", (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const atualizarUser = req.body;

  const indiceUsuario = dados.Usuarios.findIndex((u) => u.id === usuarioId);

  if (indiceUsuario === -1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  } else {
    dados.Usuarios[indiceUsuario].nome =
      atualizarUser.nome || dados.Usuarios[indiceUsuario].nome;
    dados.Usuarios[indiceUsuario].email =
      atualizarUser.email || dados.Usuarios[indiceUsuario].email;
    dados.Usuarios[indiceUsuario].senha =
      atualizarUser.senha || dados.Usuarios[indiceUsuario].senha;
    dados.Usuarios[indiceUsuario].foto =
      atualizarUser.foto || dados.Usuarios[indiceUsuario].foto;
    dados.Usuarios[indiceUsuario].descricao =
      atualizarUser.descricao || dados.Usuarios[indiceUsuario].descricao;

    salvarDados();

    return res
      .status(201)
      .json({ mensagem: "Dados completos, atualização feita com sucesso!" });
  }
});

server.delete("/usuario/:id", (req, res) => {
  const id = parseInt(req.params.id);

  dados.Usuarios = dados.Usuarios.filter((u) => u.id !== id);
  salvarDados();

  return res.status(200).json({ mensagem: "Usuário excluído" });
});

function salvarDados() {
  fs.writeFileSync(
    __dirname + "/data/usuario.json",
    JSON.stringify(dados, null, 2)
  );
}

server.post("/News", (req, res) => {
  const novoNews = req.body;

  if (!novoNews.nome || !novoNews.email || !novoNews.sobrenome) {
    return res
      .status(400)
      .json({ mensagem: "Dados incompletos, tente novamente" });
  } else {
    dadosNews.News.push(novoNews);
    salvarDadosNews();

    return res
      .status(201)
      .json({ mensagem: "Dados completos, cadastro feito com sucesso!" });
  }
});

server.get("/News", (req, res) => {
  return res.json(dadosNews.News);
});

function salvarDadosNews() {
  fs.writeFileSync(
    __dirname + "/data/news.json",
    JSON.stringify(dadosNews, null, 2)
  );
}

server.get("/testimonials", (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      console.error("Erro ao ler os depoimentos:", err);
      return res.status(500).send("Erro ao ler os depoimentos.");
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error("Erro ao processar os dados dos depoimentos:", parseErr);
      return res
        .status(500)
        .send("Erro ao processar os dados dos depoimentos.");
    }
  });
});

server.post("/testimonials", (req, res) => {
  const newTestimonial = req.body;

  if (
    !newTestimonial ||
    typeof newTestimonial.text !== "string" ||
    typeof newTestimonial.nome !== "string"
  ) {
    console.error("Dados inválidos recebidos:", req.body);
    return res.status(400).send("Dados inválidos.");
  }

  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      console.error("Erro ao ler os depoimentos:", err);
      return res.status(500).send("Erro ao ler os depoimentos.");
    }

    let testimonials;
    try {
      testimonials = JSON.parse(data);
    } catch (parseErr) {
      console.error("Erro ao parsear dados:", parseErr);
      return res.status(500).send("Erro ao processar os depoimentos.");
    }

    testimonials.push(newTestimonial);

    fs.writeFile(dataFilePath, JSON.stringify(testimonials, null, 2), (err) => {
      if (err) {
        console.error("Erro ao salvar o depoimento:", err);
        return res.status(500).send("Erro ao salvar o depoimento.");
      }
      res.status(200).send("Depoimento salvo com sucesso.");
    });
  });
});
