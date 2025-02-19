import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(json()); 

const API_KEY = process.env.API_KEY

app.get('/', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).send('Application health check: ' + data);
})

app.get('/api/products', async (req, res) => {
  try {
    const { keyword } = req.query;
    const url = `https://alphalabs.webdiet.com.br/api/products${keyword ? `?keyword=${keyword}` : ''}`;

    const response = await fetch(url, {
      headers: {
        method: 'GET',
        Authorization: API_KEY,
      },
    });

    res.status(200).json(await response.json());
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Falha ao buscar produtos.' });
  }
});

app.get('/api/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(url);

    res.status(200).json(await response.json());
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar CEP' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});