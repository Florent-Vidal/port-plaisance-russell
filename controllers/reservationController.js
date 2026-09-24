const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// GET Catway Reservations
exports.getReservationsByCatway = async (req, res) => {
  try {
    console.log('🎯 getReservationsByCatway appelé avec id:', req.params.id);
    const catwayNumber = parseInt(req.params.id);
    
    const reservations = await Reservation.find({ catwayNumber });
    console.log(`✅ ${reservations.length} réservation(s) trouvée(s)`);
    
    res.json(reservations);
  } catch (error) {
    console.error('❌ getReservationsByCatway ERROR:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET ID Reservation
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST
exports.createReservation = async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const catway = await Catway.findOne({ catwayNumber: catwayNumber });
    
    if (!catway) {
      return res.status(404).json({ message: `Catway ${catwayNumber} non trouvé` });
    }
    
    // Créer la réservation
    const reservationData = {
      catwayNumber: catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };
    
    const reservation = new Reservation(reservationData);
    await reservation.save();
    res.status(201).json(reservation);
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PUT
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.idReservation,
      {
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      },
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// DELETE
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    res.json({ message: 'Réservation supprimée avec succès', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};