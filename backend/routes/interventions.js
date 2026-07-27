const express = require('express');
const router = express.Router();
const { Intervention, Client, Technicien, User, Message, Rapport } = require('../models');
const { authentifier, autoriserRoles } = require('../middleware/auth');

router.use(authentifier);

// GET /api/interventions  - liste, avec filtres optionnels ?statut=&technicienId=&priorite=
router.get('/', async (req, res) => {
  const { statut, technicienId, priorite } = req.query;
  const where = {};
  if (statut) where.statut = statut;
  if (technicienId) where.technicienId = technicienId;
  if (priorite) where.priorite = priorite;

  // Un technicien ne voit que ses propres interventions
  if (req.user.role === 'technicien') {
    const fiche = await Technicien.findOne({ where: { userId: req.user.id } });
    where.technicienId = fiche ? fiche.id : -1;
  }

  const interventions = await Intervention.findAll({
    where,
    include: [
      { model: Client },
      { model: Technicien, include: [{ model: User, attributes: ['nom', 'prenom'] }] }
    ],
    order: [['createdAt', 'DESC']]
  });
  res.json(interventions);
});

// GET /api/interventions/:id
router.get('/:id', async (req, res) => {
  const intervention = await Intervention.findByPk(req.params.id, {
    include: [
      { model: Client },
      { model: Technicien, include: [{ model: User, attributes: ['nom', 'prenom'] }] },
      { model: Message, include: [{ model: User, as: 'auteur', attributes: ['nom', 'prenom'] }] },
      { model: Rapport }
    ]
  });
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });
  res.json(intervention);
});

// POST /api/interventions  - création (planificateur/admin)
router.post('/', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  try {
    const { titre, description, adresseIntervention, priorite, clientId, datePlanifiee, technicienId } = req.body;
    if (!titre || !clientId) return res.status(400).json({ message: 'Titre et client sont obligatoires.' });

    const intervention = await Intervention.create({
      titre, description, adresseIntervention, priorite, clientId,
      datePlanifiee: datePlanifiee || null,
      technicienId: technicienId || null,
      statut: technicienId ? 'planifiee' : 'nouvelle',
      creePar: req.user.id
    });
    res.status(201).json(intervention);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// PUT /api/interventions/:id  - modification générale
router.put('/:id', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const intervention = await Intervention.findByPk(req.params.id);
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });
  await intervention.update(req.body);
  res.json(intervention);
});

// PUT /api/interventions/:id/affecter  - affectation d'un technicien
router.put('/:id/affecter', autoriserRoles('admin', 'planificateur'), async (req, res) => {
  const { technicienId, datePlanifiee } = req.body;
  const intervention = await Intervention.findByPk(req.params.id);
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });

  const technicien = await Technicien.findByPk(technicienId);
  if (!technicien || !technicien.disponible) {
    return res.status(400).json({ message: 'Technicien indisponible ou introuvable.' });
  }

  await intervention.update({
    technicienId,
    datePlanifiee: datePlanifiee || intervention.datePlanifiee,
    statut: 'planifiee'
  });
  res.json(intervention);
});

// PUT /api/interventions/:id/statut  - changement de statut (technicien sur le terrain)
router.put('/:id/statut', async (req, res) => {
  const { statut } = req.body;
  const valides = ['nouvelle', 'planifiee', 'en_cours', 'terminee', 'annulee'];
  if (!valides.includes(statut)) return res.status(400).json({ message: 'Statut invalide.' });

  const intervention = await Intervention.findByPk(req.params.id);
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });

  const updates = { statut };
  if (statut === 'en_cours' && !intervention.dateDebut) updates.dateDebut = new Date();
  if (statut === 'terminee') updates.dateFin = new Date();

  await intervention.update(updates);
  res.json(intervention);
});

// DELETE /api/interventions/:id
router.delete('/:id', autoriserRoles('admin'), async (req, res) => {
  const intervention = await Intervention.findByPk(req.params.id);
  if (!intervention) return res.status(404).json({ message: 'Intervention introuvable.' });
  await intervention.destroy();
  res.json({ message: 'Intervention supprimée.' });
});

module.exports = router;
