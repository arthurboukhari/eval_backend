const express = require('express');
const router = express.Router();
const persoCtrl = require('../controllers/perso');
const auth = require('../middlewares/auth');

// GET
// Liste tous les objets
router.get('/perso', auth, persoCtrl.getAllPerso);

// GET
// Récupère et retourne un objet
router.get('/perso/:id', auth, persoCtrl.getPerso);

// POST
// Ajoute l'objet en base de donnée
router.post('/perso', auth, persoCtrl.createPerso);

// PUT
// Récupère et modifie un objet
router.put('/perso/:id', auth, persoCtrl.updatePerso);

// DELETE
// Supprime un objet de la base de donnée
router.delete('/perso', auth, persoCtrl.deletePerso);

module.exports = router;