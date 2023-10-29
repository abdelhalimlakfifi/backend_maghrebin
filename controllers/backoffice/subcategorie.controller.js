const { internalError } = require('../../utils/500');
const SubCategorie = require('../../models/subCetegorie.model');
const { body, validationResult} = require('express-validator')
require('dotenv').config();
const mongoose = require('mongoose');



const storingValidation = [];
const getAll = async(req, res) => {

}

const store = async(req, res) => {
    res.json({
        message: "wasdasdasd"
    })
}

const getOne = async(req, res) => {

}

const update = async(req, res) => {

}
const destroy = async(req, res) => {

}



module.exports = { getAll, store, getOne, update,destroy, storingValidation }