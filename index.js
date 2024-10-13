const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const Port = process.env.PORT || 4545;
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');


app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);


try {
    mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/sanlakservices").then(console.log("Mongodb connected..."));
} catch (error) {
    console.log("Mongodb Error: ", error.message)
}

app.listen(Port, console.log(`Server is running on port ${Port}`));