const ColorFilter = require('../../models/colorModel');

const colorController = {
  getAllColors: async (req, res) => {
    try {
      const colors = await ColorFilter.find();
      res.status(200).json(colors);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching colors' });
    }
  },

  getColorById: async (req, res) => {
    const { id } = req.params;
    try {
      const color = await ColorFilter.findById(id);
      if (!color) {
        return res.status(404).json({ message: 'Color not found' });
      }
      res.status(200).json(color);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching color' });
    }
  },

  createColor: async (req, res) => {
    const newColor = new ColorFilter(req.body);
    try {
      const savedColor = await newColor.save();
      res.status(201).json(savedColor);
    } catch (err) {
      res.status(400).json({ message: 'Error creating color' });
    }
  },

  updateColor: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedColor = await ColorFilter.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedColor);
    } catch (err) {
      res.status(400).json({ message: 'Error updating color' });
    }
  },

  deleteColor: async (req, res) => {
    const { id } = req.params;
    try {
      await ColorFilter.findByIdAndDelete(id);
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ message: 'Error deleting color' });
    }
  },
};

module.exports = colorController;
