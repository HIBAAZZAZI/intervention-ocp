const express = require('express');
const router = express.Router();
const { Client } = require('../models');
const { authentifier, autoriserRoles } = require('../middleware/auth');

router.use(authentifier);

router.get('/', async (req, res) => {
  const clients = await Client.findAll({ order: [['nom', 'ASC']] });
  res.json(clients);
});

router.post('/', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const client = await Client.create(req.body);
  res.status(201).json(client);
});

router.put('/:id', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client introuvable.' });
  await client.update(req.body);
  res.json(client);
});

router.delete('/:id', autoriserRoles('admin'), async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client introuvable.' });
  await client.destroy();
  res.json({ message: 'Client supprimé.' });
});

module.exports = router;
