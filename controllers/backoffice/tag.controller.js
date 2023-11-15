const Tag = require('../../models/tag.model');
const { internalError } = require('../../utils/500');
const { body, validationResult } = require('express-validator');


const storingValidation = [
    body('name')
        .notEmpty(),
    body('description')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Description must be less than 100 characters')
]

const index = async (req, res) => {

}

const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }


    try {
        const existingTag = await Tag.findOne({name: req.body.name});
        if(existingTag){
            if(existingTag.deletedAt !=null ){
                existingTag.deleteOne()
            }else{
                return res.status(400).json({
                    status: 400,
                    error: "Tag name already exist"
                });
            }
        }


        const newTag = new Tag({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.user._id
        });

        await newTag.save();
        return res.json(newTag);
    } catch (error) {
        console.log(error);
        res.status(500).json(internalError("Internal Server Error",error));
    }
}

const update = async (req, res) => {


    try {
        const tag = await Tag.findById(req.params.id)

        console.log(tag);
        if(!tag){
            return res.status(404).json({
                status: 404,
                error: "Tag not found"
            });
        }

        const existTag = await Tag.findOne({ name: req.body.name});
        if(existTag && existTag._id != tag._id)
        {
            return res.status(400).json({
                status: 400,
                error: "Tag already exists"
            });
        }

        tag.name = req.body.name ? req.body.name : tag.name;
        tag.description = req.body.description ? req.body.description: tag.description;
        tag.updatedBy = req.user._id;


        await tag.save();
        return res.status(200).json({
            status: 200,
            tag: tag
        });

    } catch (error) {
        
    }
    return res.send("update");
}

const destroy = (req, res) => {

}


module.exports = {index, store, update, destroy, storingValidation};