const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ocp-khouribga-secret-key-a-changer-en-production';

function authentifier(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, nom, prenom }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}

// Restreint l'accès à certains rôles, ex: autoriserRoles('admin', 'planificateur')
function autoriserRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé : privilèges insuffisants.' });
    }
    next();
  };
}

module.exports = { authentifier, autoriserRoles, JWT_SECRET };
