const bcrypt = require('bcrypt');
const User = require('../models/User');
// const jwt = require('jsonwebtoken');
const {decode} = require("jsonwebtoken")

exports.signup = (req, res, next) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            // création de l'user à partir du modèle User
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log("user",user);

            // sauvegarde du user en bdd et envoi du status 201 + du message "Utiliseur créé !
            user.save()
                .then(() => {
                    res.status(201).json({ message: "Utilisateur créé !" })
                    event.emit('sendMail', { email: user.email});
                } )
                .catch(error => res.status(400).json({ error } ));

        })
        .catch(error => res.status(500).json({ error }))

}

exports.login = (req, res, next) => {
    console.log("aaa");
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({ message: "Auth invalide" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401)
                        .json({ message: "Auth invalide" });
                    }
                    if (req.body.email === "user.admin@admin.fr") {
                        return res.status(200).json({
                            userId:user._id,
                            token: jwt.sign(
                                { userId: user._id , isAdmin : true},
                                'SR1wKQYqlTLVWZSlYkot3xTu0qdZuWDn',
                                { expiresIn: '8760h' }
                            )
                        })
                    }
                    res.status(200).json({

                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id, isAdmin: false },
                            'SR1wKQYqlTLVWZSlYkot3xTu0qdZuWDn',
                            { expiresIn: '24h' }
                        )

                    });

                })
                .catch(error => res.status(500).json({ error }))

        })
        .catch(error => res.status(400).json({ error }))

        // si l'user est vide  ===>   if(!user){ console.log("il n'existe pas") }
            // -> > console.log("c'est pas bon")
        // si l'user est pas vide

        // comparer le mdp crypté en BDD grâce à bcrypt avec le mdp de l'user <---- ???

            // si c'est pas bon
              // -> > console.log("c'est pas bon")

            // si c'est bon
                // -> console.log("c'est bon")
}