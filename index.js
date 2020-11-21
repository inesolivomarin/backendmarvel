const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

mongoose.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.all("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.get("/comics", async (req, res) => {
  try {
    // Générer le ts
    const ts = uid2(8);
    const hash = md5(ts + privateKey + publicKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    return res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/caracters", async (req, res) => {
  try {
    const ts = uid2(10);
    const hash = md5(ts + privateKey + publicKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    return res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This road doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
