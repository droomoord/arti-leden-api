const express = require('express');
const Lid = require('../../models/lid.model');
const auth = require('../../middlewares/auth');

const router = express.Router();

// alle leden:

router.get('/all', auth(), async (req, res) => {
  try {
    const leden = await Lid.find();
    res.json(leden);
  } catch (error) {
    res.json(error);
  }
});

// zoek specifiek lid:

router.post('/search', auth(), async (req, res) => {
  try {
    const query = new RegExp(req.body.search);
    const leden = await Lid.find({ naamVoluit: { $regex: query, $options: 'i' } });
    res.json(leden);
  } catch (error) {
    res.json(error);
  }
});

// zoek lid met ID en krijg een lijst met overeenkomstige leden

router.post('/lid', auth(), async (req, res) => {
  try {
    // functie die overeenkomstige jaren uitrekent:
    const overeenkomstigeJaren = (a, b, c, d) => {
      let result = 0;
      for (let i = a; i < b; i += 1) {
        if (i >= c && i <= d) result += 1;
      }
      return result;
    };
    // vind het lid waar alle andere leden tegen afgezet worden:
    const targetLid = await Lid.findById(req.body.id);
    // vind leden die in dezelde periode ook lid waren van Arti:
    const leden = await Lid.find({ max: { $gt: targetLid.min }, min: { $lt: targetLid.max } });

    // als een lid overeenkomstige start- OF einddatum heeft, zet die dan bovenaan
    leden.forEach((l, i) => {
      if (targetLid.min === l.min || targetLid.max === l.max) {
        leden.splice(i, 1);
        leden.unshift(l);
      }
    });

    // voeg een variabel 'overeenkomstigeJaren' toe en sorteer de resultaten op basis daarvan:
    leden.forEach((l, i) => {
      leden[i].overeenkomstigeJaren = overeenkomstigeJaren(
        parseInt(targetLid.min, 10),
        parseInt(targetLid.max, 10),
        parseInt(l.min, 10),
        parseInt(l.max, 10)
      );
      leden.sort((a, b) => {
        return b.overeenkomstigeJaren - a.overeenkomstigeJaren;
      });
    });

    // als een lid overeenkomstige start- EN einddatum heeft, zet die dan bovenaan
    leden.forEach((l, i) => {
      if (targetLid.min === l.min && targetLid.max === l.max) {
        leden.splice(i, 1);
        leden.unshift(l);
      }
    });
    // zet targetLid bovenaan:
    leden.forEach((l, i) => {
      if (targetLid.id === l.id) {
        leden.splice(i, 1);
        leden.unshift(l);
      }
    });

    res.json(leden);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
