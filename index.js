const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const Port = process.env.PORT || 4545;
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const { getRecentUsers } = require('./services/userData.js');
const { requestLogger } = require('./middleware/logger.js');
const { seedAdmin } = require("./seeders/adminSeeder.js")

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);


try {
    mongoose.connect(process.env.MONGODB_URL).then(async () => {
        console.log("Mongodb connected...");
        await seedAdmin();
        getRecentUsers().then(users => {
            if (!users.length) {
                console.log('No User registered in the last 7 days:', users.length);
            } else {
                console.log('Users registered in the last 7 days:', users, users.length);
            }
        }).catch(error => {
            console.error('Error logging recent users:', error);
        });
    });
} catch (error) {
    console.log("Mongodb Error: ", error.message)
}

app.listen(Port, console.log(`Server is running on port ${Port}`));