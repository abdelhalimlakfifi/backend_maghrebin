const SizeFilter = require('../../models/sizeModel');

const sizeController = {
  getAllSizes: async (req, res) => {
    try {
      const sizes = await SizeFilter.find();
      res.json(sizes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createSize: async (req, res) => {
    try {
      const newSize = await SizeFilter.create(req.body);
      res.status(201).json(newSize);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateSize: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSize = await SizeFilter.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedSize) {
        return res.status(404).json({ message: 'Size not found' });
      }
      res.json(updatedSize);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteSize: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSize = await SizeFilter.findByIdAndDelete(id);
      if (!deletedSize) {
        return res.status(404).json({ message: 'Size not found' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = sizeController;

// const SizeFilter = require('../../models/sizeModel');

// const sizeController = {
//   getAllSizes: async (req, res) => {
//     try {
//       const sizes = await SizeFilter.find();
//       res.json(sizes);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   createSize: async (req, res) => {
//     try {
//       const newSize = await SizeFilter.create(req.body);
//       res.status(201).json(newSize);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   },

//   updateSize: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const updatedSize = await SizeFilter.findByIdAndUpdate(id, req.body, { new: true });
//       if (!updatedSize) {
//         return res.status(404).json({ message: 'Size not found' });
//       }
//       res.json(updatedSize);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   },

//   deleteSize: async (req, res) => {
//     const { id } = req.params;
//     try {
//       const deletedSize = await SizeFilter.findByIdAndDelete(id);
//       if (!deletedSize) {
//         return res.status(404).json({ message: 'Size not found' });
//       }
//       res.status(204).end();
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// };

// module.exports = sizeController;
