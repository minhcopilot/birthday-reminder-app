const express = require('express');
const { 
  getBirthdays, 
  createBirthday, 
  updateBirthday, 
  deleteBirthday 
} = require('../controllers/birthdayController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBirthdays)
  .post(createBirthday);

router.route('/:id')
  .put(updateBirthday)
  .delete(deleteBirthday);

module.exports = router; 