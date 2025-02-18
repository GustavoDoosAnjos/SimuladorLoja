import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(json()); 

const API_KEY = process.env.API_KEY

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

    res.status(200).send(await response.json());
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(url);

    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching CEP details:', error.message);
    res.status(500).json({ error: 'Failed to fetch CEP details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});