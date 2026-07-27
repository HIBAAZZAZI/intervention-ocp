const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { authentifier } = require('../middleware/auth');

router.use(authentifier);

// GET /api/messages/intervention/:interventionId
router.get('/intervention/:interventionId', async (req, res) => {
  const messages = await Message.findAll({
    where: { interventionId: req.params.interventionId },
    include: [{ model: User, as: 'auteur', attributes: ['nom', 'prenom', 'role'] }],
    order: [['createdAt', 'ASC']]
  });
  res.json(messages);
});

// POST /api/messages/intervention/:interventionId
router.post('/intervention/:interventionId', async (req, res) => {
  const { contenu } = req.body;
  if (!contenu) return res.status(400).json({ message: 'Le message ne peut pas être vide.' });

  const message = await Message.create({
    contenu,
    interventionId: req.params.interventionId,
    auteurId: req.user.id
  });
  const complet = await Message.findByPk(message.id, {
    include: [{ model: User, as: 'auteur', attributes: ['nom', 'prenom', 'role'] }]
  });
  res.status(201).json(complet);
});

module.exports = router;
