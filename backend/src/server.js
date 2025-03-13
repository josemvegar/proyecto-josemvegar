const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const conection = require("./database/conection");

conection();

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

const userRoutes = require("./routes/user");

app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || 'http://localhost:';
app.listen(PORT, () => {
  console.log(`Backend corriendo en ${DOMAIN}${PORT}`);
});