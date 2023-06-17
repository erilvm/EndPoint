// Cargar variables de entorno
import * as dotenv from "dotenv";
dotenv.config();

// Importar express y utilerias
import express from "express";
import { getCredentials, getToken } from "./utils/headers.js";
import { signToken, verifyToken, validateExpiration } from "./utils/token.js";
import { getUser } from "./utils/users.js";

// Inicializar express
const app = express();

// Declarar el puerto por medio de env
const PORT = process.env.PORT ;

app.get("/public", (req, res) => {
  res.send("Soy un EndPoint público");
});

app.get("/private", (req, res) => {
  try {
    const token = getToken(req);
    const payload = verifyToken(token);

    validateExpiration(payload);

    res.send("Soy un EndPoint privado");
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

app.post("/token", (req, res) => {
  try {
    const { username, password } = getCredentials(req);
    const user = getUser(username, password);
    const token = signToken(user);

    res.send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🌐 Escuchando en  http://localhost:${PORT}`));
