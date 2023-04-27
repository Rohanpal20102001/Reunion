const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./Router/user');
const postRouter = require('./Router/post');
require("dotenv/config");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(logger('tiny'));
app.use(express.json());

//db connection
const db = process.env.MONGO_URI;
mongoose
.set("strictQuery", true)
.connect(db, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('Mongodb has sucessfully connected!'))
.catch((err) => console.log(err));


//Router
app.use('/api', userRouter);
app.use('/api', postRouter);




app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})