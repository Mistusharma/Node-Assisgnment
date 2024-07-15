const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport'); // Correctly import passport

const app = express();

// Connect Database
connectDB();

// Init Middleware

app.use(express.json({ extended: false }));

// Define Routes
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);
app.use('/api/users', require('./src/routes/userRoute'));
app.use('/api/posts', require('./src/routes/postRoute'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));