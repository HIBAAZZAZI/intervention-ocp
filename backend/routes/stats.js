const express = require('express');
const router = express.Router();
const { Intervention, Technicien, PieceDetachee } = require('../models');
const { authentifier } = require('../middleware/auth');
const { Op, fn, col } = require('sequelize');

router.use(authentifier);

// GET /api/stats/dashboard
router.get('/dashboard', async (req, res) => {
  const [total, nouvelles, planifiees, enCours, terminees] = await Promise.all([
    Intervention.count(),
    Intervention.count({ where: { statut: 'nouvelle' } }),
    Intervention.count({ where: { statut: 'planifiee' } }),
    Intervention.count({ where: { statut: 'en_cours' } }),
    Intervention.count({ where: { statut: 'terminee' } })
  ]);

  const techniciensDisponibles = await Technicien.count({ where: { disponible: true } });
  const techniciensTotal = await Technicien.count();

  const pieces = await PieceDetachee.findAll();
  const stockFaible = pieces.filter(p => p.quantiteStock <= p.seuilAlerte).length;

  res.json({
    interventions: { total, nouvelles, planifiees, enCours, terminees },
    techniciens: { disponibles: techniciensDisponibles, total: techniciensTotal },
    stock: { alertes: stockFaible, totalReferences: pieces.length }
  });
});

module.exports = router;
