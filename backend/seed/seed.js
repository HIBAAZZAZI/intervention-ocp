const bcrypt = require('bcryptjs');
const { sequelize, User, Technicien, Client, Intervention, PieceDetachee } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const motDePasse = await bcrypt.hash('password123', 10);

  // Utilisateurs
  const admin = await User.create({
    nom: 'Akram', prenom: 'Abdeladim', email: 'admin@ocp-khouribga.ma',
    password: motDePasse, role: 'admin', telephone: '0600000001'
  });

  const planificateur = await User.create({
    nom: 'Bennani', prenom: 'Salma', email: 'planificateur@ocp-khouribga.ma',
    password: motDePasse, role: 'planificateur', telephone: '0600000002'
  });

  const tech1User = await User.create({
    nom: 'El Amrani', prenom: 'Youssef', email: 'youssef.elamrani@ocp-khouribga.ma',
    password: motDePasse, role: 'technicien', telephone: '0600000003'
  });
  const tech2User = await User.create({
    nom: 'Idrissi', prenom: 'Karim', email: 'karim.idrissi@ocp-khouribga.ma',
    password: motDePasse, role: 'technicien', telephone: '0600000004'
  });
  const tech3User = await User.create({
    nom: 'Fassi', prenom: 'Nadia', email: 'nadia.fassi@ocp-khouribga.ma',
    password: motDePasse, role: 'technicien', telephone: '0600000005'
  });

  const tech1 = await Technicien.create({
    userId: tech1User.id, competences: 'électricité,automatisme', disponible: true,
    zoneAffectation: 'Zone Industrielle Khouribga', latitude: 32.8811, longitude: -6.9063
  });
  const tech2 = await Technicien.create({
    userId: tech2User.id, competences: 'mécanique,hydraulique', disponible: true,
    zoneAffectation: 'Site Minier Béni Amir', latitude: 32.9200, longitude: -6.8700
  });
  const tech3 = await Technicien.create({
    userId: tech3User.id, competences: 'électricité,instrumentation', disponible: false,
    zoneAffectation: 'Laverie Khouribga', latitude: 32.8650, longitude: -6.9100
  });

  // Clients (sites internes du Groupe OCP)
  const client1 = await Client.create({
    nom: 'Atelier Maintenance Centrale', site: 'Site Khouribga - Bâtiment A',
    adresse: 'Zone Industrielle, Khouribga', telephone: '0523000001', email: 'atelier.central@ocp.ma'
  });
  const client2 = await Client.create({
    nom: 'Unité de Traitement Béni Amir', site: 'Béni Amir',
    adresse: 'Route de Béni Amir, Khouribga', telephone: '0523000002', email: 'beniamir@ocp.ma'
  });
  const client3 = await Client.create({
    nom: 'Laverie Centrale', site: 'Laverie Khouribga',
    adresse: 'Zone Laverie, Khouribga', telephone: '0523000003', email: 'laverie@ocp.ma'
  });

  // Interventions
  await Intervention.create({
    titre: 'Panne convoyeur bande n°4', description: "Arrêt inopiné du moteur d'entraînement.",
    adresseIntervention: 'Bâtiment A - Ligne 4', priorite: 'urgente', statut: 'en_cours',
    clientId: client1.id, technicienId: tech1.id, creePar: planificateur.id,
    datePlanifiee: new Date(), dateDebut: new Date()
  });
  await Intervention.create({
    titre: 'Maintenance préventive pompe hydraulique', description: 'Contrôle mensuel programmé.',
    adresseIntervention: 'Béni Amir - Station de pompage', priorite: 'normale', statut: 'planifiee',
    clientId: client2.id, technicienId: tech2.id, creePar: planificateur.id,
    datePlanifiee: new Date(Date.now() + 86400000)
  });
  await Intervention.create({
    titre: 'Défaut capteur de niveau', description: 'Capteur signalant une valeur incohérente.',
    adresseIntervention: 'Laverie - Bac de stockage 2', priorite: 'haute', statut: 'nouvelle',
    clientId: client3.id, creePar: planificateur.id
  });
  await Intervention.create({
    titre: 'Remplacement disjoncteur principal', description: 'Disjoncteur défectueux remplacé.',
    adresseIntervention: 'Bâtiment A - Armoire électrique', priorite: 'haute', statut: 'terminee',
    clientId: client1.id, technicienId: tech1.id, creePar: admin.id,
    datePlanifiee: new Date(Date.now() - 172800000),
    dateDebut: new Date(Date.now() - 170000000),
    dateFin: new Date(Date.now() - 165000000)
  });

  // Stock de pièces détachées
  await PieceDetachee.bulkCreate([
    { reference: 'ELEC-001', designation: 'Disjoncteur 63A', unite: 'unité', quantiteStock: 12, seuilAlerte: 5 },
    { reference: 'ELEC-002', designation: 'Câble électrique 3x2.5mm (rouleau 100m)', unite: 'rouleau', quantiteStock: 3, seuilAlerte: 4 },
    { reference: 'MECA-010', designation: 'Roulement à billes 6205', unite: 'unité', quantiteStock: 20, seuilAlerte: 8 },
    { reference: 'MECA-011', designation: 'Courroie trapézoïdale B-Type', unite: 'unité', quantiteStock: 2, seuilAlerte: 5 },
    { reference: 'HYDR-005', designation: 'Joint hydraulique NBR', unite: 'unité', quantiteStock: 45, seuilAlerte: 10 },
    { reference: 'CAPT-003', designation: 'Capteur de niveau ultrason', unite: 'unité', quantiteStock: 1, seuilAlerte: 3 }
  ]);

  console.log('Base de données peuplée avec succès.');
  console.log('--- Comptes de démonstration (mot de passe : password123) ---');
  console.log('Admin           : admin@ocp-khouribga.ma');
  console.log('Planificateur   : planificateur@ocp-khouribga.ma');
  console.log('Technicien      : youssef.elamrani@ocp-khouribga.ma');
  process.exit(0);
}

seed().catch(err => {
  console.error('Erreur lors du peuplement :', err);
  process.exit(1);
});
