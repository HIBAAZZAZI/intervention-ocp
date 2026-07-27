require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/interventions', require('./routes/interventions'));
app.use('/api/techniciens', require('./routes/techniciens'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/rapports', require('./routes/rapports'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/stats', require('./routes/stats'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API Gestion des Interventions - OCP Khouribga`);
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erreur de connexion à la base de données :', err);
});
