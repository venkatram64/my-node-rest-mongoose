const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

/*app.get("/", (req, res, next) => {
    res.send("Hello, World");
});*/




const mongoDBUrl = 'mongodb://localhost:27017/blog';
mongoose.connect(mongoDBUrl,{ useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => {
    console.log('DB connected...');
});

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//middleware
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({error: 'Invalid token...'});
    }
});

const port = 8080;

app.listen(port, () =>{
    console.log(`Server is started on port ${port}`);
});