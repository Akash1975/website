const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const connect = await mongoose.connect('mongodb+srv://akashdhaigude1907:Akya1907@cluster0.1msay.mongodb.net/Portfolio')
        console.log(`Database Connected to ${connect.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;