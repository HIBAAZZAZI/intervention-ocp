const express = require('express');
const router = express.Router();
const { PieceDetachee, MouvementStock } = require('../models');
const { authentifier, autoriserRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

router.use(authentifier);

// GET /api/stocks  - liste des pièces, ?alerte=true pour ne voir que les stocks bas
router.get('/', async (req, res) => {
  const pieces = await PieceDetachee.findAll({ order: [['designation', 'ASC']] });
  if (req.query.alerte === 'true') {
    return res.json(pieces.filter(p => p.quantiteStock <= p.seuilAlerte));
  }
  res.json(pieces);
});

// POST /api/stocks  - créer une nouvelle référence
router.post('/', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const piece = await PieceDetachee.create(req.body);
  res.status(201).json(piece);
});

// POST /api/stocks/:id/mouvement  - entrée ou sortie de stock (ex: pièce utilisée lors d'une intervention)
router.post('/:id/mouvement', async (req, res) => {
  const { type, quantite, motif, interventionId } = req.body;
  const piece = await PieceDetachee.findByPk(req.params.id);
  if (!piece) return res.status(404).json({ message: 'Pièce introuvable.' });

  if (!['entree', 'sortie'].includes(type)) {
    return res.status(400).json({ message: 'Type de mouvement invalide.' });
  }
  if (type === 'sortie' && piece.quantiteStock < quantite) {
    return res.status(400).json({ message: 'Stock insuffisant.' });
  }

  const nouvelleQuantite = type === 'entree'
    ? piece.quantiteStock + Number(quantite)
    : piece.quantiteStock - Number(quantite);

  await piece.update({ quantiteStock: nouvelleQuantite });
  const mouvement = await MouvementStock.create({
    type, quantite, motif, pieceId: piece.id, interventionId: interventionId || null
  });

  res.status(201).json({ piece, mouvement });
});

// GET /api/stocks/:id/mouvements  - historique
router.get('/:id/mouvements', async (req, res) => {
  const mouvements = await MouvementStock.findAll({
    where: { pieceId: req.params.id },
    order: [['createdAt', 'DESC']]
  });
  res.json(mouvements);
});

module.exports = router;
