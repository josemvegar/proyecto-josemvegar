const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const Database = require("./database/conection");
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');


Database.connect();

dotenv.config();
const app = express();

app.use(errorHandler);

app.use(morgan('dev'));


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