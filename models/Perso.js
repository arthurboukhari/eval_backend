const mongoose = require('mongoose');

const persoSchema = mongoose.Schema({

    userId: { type: String, required: true,},
    pseudo: { type: String, required: true,},
    class: { type: String, required: true,},
    level: { type: Number, required: true,},

});

module.exports = mongoose.model('Perso', persoSchema);