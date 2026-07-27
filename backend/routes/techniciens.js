const express = require('express');
const router = express.Router();
const { Technicien, User, Intervention } = require('../models');
const { authentifier, autoriserRoles } = require('../middleware/auth');

router.use(authentifier);

// GET /api/techniciens  - liste avec disponibilité et position
router.get('/', async (req, res) => {
  const techniciens = await Technicien.findAll({
    include: [
      { model: User, attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
      { model: Intervention, where: { statut: 'en_cours' }, required: false }
    ]
  });
  res.json(techniciens);
});

// GET /api/techniciens/:id
router.get('/:id', async (req, res) => {
  const technicien = await Technicien.findByPk(req.params.id, {
    include: [{ model: User, attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }]
  });
  if (!technicien) return res.status(404).json({ message: 'Technicien introuvable.' });
  res.json(technicien);
});

// PUT /api/techniciens/:id/position  - mise à jour de la localisation (suivi temps réel)
// Appelé périodiquement par l'app mobile du technicien sur le terrain.
router.put('/:id/position', async (req, res) => {
  const { latitude, longitude } = req.body;
  const technicien = await Technicien.findByPk(req.params.id);
  if (!technicien) return res.status(404).json({ message: 'Technicien introuvable.' });

  await technicien.update({ latitude, longitude, derniereMiseAJourPosition: new Date() });
  res.json({ message: 'Position mise à jour.' });
});

// PUT /api/techniciens/:id/disponibilite
router.put('/:id/disponibilite', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const { disponible } = req.body;
  const technicien = await Technicien.findByPk(req.params.id);
  if (!technicien) return res.status(404).json({ message: 'Technicien introuvable.' });
  await technicien.update({ disponible });
  res.json(technicien);
});

module.exports = router;
