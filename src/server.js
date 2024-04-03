require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("./config/session");
const cors = require("cors");
const path = require("path");
const { log } = require("console");
const port = process.env.PORT || 3002;

const app = express();
// O Cors serve para liberar requisições externas (portas diferente)
app.use(cors());

app.use(express.static("public"));

// Credencials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const DB_URL = process.env.DB_URL;
const dbConnect = process.env.DB_CONNECT;

// Connect method Mongo DB
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}${dbConnect}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port);
    console.log(`Conectou ao banco, na porta ${port}`);
  })
  .catch((err) => console.log(err));

app.use(session);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

nunjucks.configure(path.resolve(__dirname, "views"), {
  watch: true,
  express: app,
  autoescape: true,
});

app.set("view engine", "njk");
app.use(require("./routes"));
