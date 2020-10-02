const mongoose = require('mongoose');

const { Schema } = mongoose;

const lidSchema = new Schema(
  {
    naam: {
      type: String,
      required: true,
    },
    lidVanTot: String,
    titel: String,
    geborenOp: String,
    gestorvenOp: String,
    voorgesteldDoor: String,
    opmerkingen: String,
    naamVoluit: {
      type: String,
      required: true,
    },
    min: String,
    max: String,
    geboortePlaats: String,
    overeenkomstigeJaren: Number,
  },
  { collection: 'leden' }
);

const Lid = mongoose.model('leden', lidSchema);

module.exports = Lid;
