const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User, Technicien } = require('../models');
const { JWT_SECRET, authentifier } = require('../middleware/auth');

// POST /api/auth/register  (création de compte - réservé en pratique à l'admin)
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, role, competences, zoneAffectation } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }
    const existant = await User.findOne({ where: { email } });
    if (existant) return res.status(409).json({ message: 'Cet email est déjà utilisé.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, prenom, email, password: hash, telephone, role: role || 'technicien' });

    if (user.role === 'technicien') {
      await Technicien.create({ userId: user.id, competences, zoneAffectation });
    }

    res.status(201).json({ message: 'Utilisateur créé.', id: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides.' });

    const valide = await bcrypt.compare(password, user.password);
    if (!valide) return res.status(401).json({ message: 'Identifiants invalides.' });

    const token = jwt.sign(
      { id: user.id, role: user.role, nom: user.nom, prenom: user.prenom },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authentifier, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json(user);
});

module.exports = router;
