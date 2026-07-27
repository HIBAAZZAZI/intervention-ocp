const express = require('express');
const router = express.Router();
const { Rapport, Intervention, Technicien, User } = require('../models');
const { authentifier } = require('../middleware/auth');

router.use(authentifier);

// GET /api/rapports  - liste de tous les rapports générés
router.get('/', async (req, res) => {
  const rapports = await Rapport.findAll({
    include: [
      { model: Intervention, include: ['Client'] },
      { model: Technicien, include: [{ model: User, attributes: ['nom', 'prenom'] }] }
    ],
    order: [['createdAt', 'DESC']]
  });
  res.json(rapports);
});

// POST /api/interventions/:interventionId/rapport  - créer le rapport de fin d'intervention
router.post('/intervention/:interventionId', async (req, res) => {
  const { tachesRealisees, piecesUtilisees, observations, technicienId } = req.body;
  const intervention = await Intervention.findByPk(req.params.interventionId);
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });

  const rapport = await Rapport.create({
    tachesRealisees,
    piecesUtilisees: JSON.stringify(piecesUtilisees || []),
    observations,
    interventionId: intervention.id,
    technicienId: technicienId || intervention.technicienId
  });

  await intervention.update({ statut: 'terminee', dateFin: new Date() });
  res.status(201).json(rapport);
});

module.exports = router;
