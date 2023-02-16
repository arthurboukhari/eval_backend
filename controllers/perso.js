const Perso = require("../models/Perso");
const auth = require('../middlewares/auth');
const axios = require("axios");
const event = require('../events/createFile');
const BLIZZARD_URL = "https://backend-tp-final-nodejs.agence-pixi.fr/wow/compte/check";

exports.getAllPerso = (req, res, next) => {

    Perso.find()
        .then((persos)=> res.status(200).json(persos))
        .catch((error) => res.status(400).json( {error}));
}

exports.getPerso = (req, res, next) => {
    Perso.findOne({
        pseudo: req.params.pseudo,
        class: req.params.class
    })
        .then((perso) => {
            if (!perso) res.status(401).json({ message: 'Personnage inexistant' });

            res.status(200).json(perso);
        })
        .catch((error) => res.status(400).json({ error }));
}

exports.blizzardCreateCharacter = (req, res, next) => {
    axios.post(BLIZZARD_URL, { "username": req.body.username, "password": req.body.password })
        .then((response) => res.status(201).json(response.data))
        .catch((error) => {
            event.emit('createFile', { file: 'blizzardLogs', message: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} : Tentative de connexion échoué\n` });

            res.status(400).json({ error })
        });
}

exports.createPerso = (req, res, next) => {

    // const persoObject = JSON.parse(req.body.perso);

    delete persoObject._id;
    delete persoObject._userId;

    Perso.findOne({
        pseudo: req.body.pseudo,
        class: req.body.class
    })

    .then((perso) =>{
        if (!perso && !req.auth.isAdmin) {
            const perso = new Perso({
                ...req.body,
                userId: req.auth.userId,
            })
            perso.save()
            .then(() => {
                console.log("Perso créé");
                res.status(201).json({ message: "Perso créé !!" })
            })
            .catch(error => res.status(400).json({ error } ));
        }else{
            return res.status(400).json({ message: "MARCHE PAS !!" })
        }
         
    })


}

exports.updatePerso = (req, res, next) => {
    delete req.body.userId;

    Perso.findOne({ _id: req.params.id })
    .then((perso) => {
        if (perso.userId === req.auth.userId || req.auth.isAdmin) {
            Perso.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Personnage modifié' }))
                .catch((error) => res.status(400).json({ error }));
        } else {
            res.status(401).json({ message: 'Cet utilisateur ne peut pas modifier ce personnage' })
        }
    })
    .catch((error) => res.status(400).json({ error }));
}

exports.deletePerso = (req, res, next) => {

    Perso.findOne({_id: req.params.id})
        .then(() => {
            Perso.deleteOne( {_id: req.params.id })
                .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                .catch(error => res.status(400).json({ error } ))
        })
        .catch(error => res.status(400).json({ error } ));
}