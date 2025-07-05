const Birthday = require('../models/Birthday');
const { validateBirthday } = require('../utils/validation');

const getBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.findAll({
      where: { userId: req.user.id, isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({ birthdays });
  } catch (error) {
    console.error('Get birthdays error:', error);
    res.status(500).json({ error: 'Failed to fetch birthdays' });
  }
};

const createBirthday = async (req, res) => {
  try {
    const { error } = validateBirthday(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const birthday = await Birthday.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Birthday created successfully',
      birthday
    });
  } catch (error) {
    console.error('Create birthday error:', error);
    res.status(500).json({ error: 'Failed to create birthday' });
  }
};

const updateBirthday = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateBirthday(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const birthday = await Birthday.findOne({
      where: { id, userId: req.user.id }
    });

    if (!birthday) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    await birthday.update(req.body);

    res.json({
      message: 'Birthday updated successfully',
      birthday
    });
  } catch (error) {
    console.error('Update birthday error:', error);
    res.status(500).json({ error: 'Failed to update birthday' });
  }
};

const deleteBirthday = async (req, res) => {
  try {
    const { id } = req.params;

    const birthday = await Birthday.findOne({
      where: { id, userId: req.user.id }
    });

    if (!birthday) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    await birthday.update({ isActive: false });

    res.json({ message: 'Birthday deleted successfully' });
  } catch (error) {
    console.error('Delete birthday error:', error);
    res.status(500).json({ error: 'Failed to delete birthday' });
  }
};

module.exports = {
  getBirthdays,
  createBirthday,
  updateBirthday,
  deleteBirthday
}; 