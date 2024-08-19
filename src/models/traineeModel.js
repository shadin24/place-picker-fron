const mongoose=require('mongoose')
const Schema = require('mongoose')


const conn = require('../sevices/db')
conn.dbConnection();

const trainSchema = new Schema({
    "id": String,
    "title": String,
    


})

const trainModel =mongoose.model("Trainee",trainSchema)
module.exports = trainModel;