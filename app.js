import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';
import braintreeRouter from './routes/braintree.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import cors from 'cors';
import orderRouter from './routes/order.js';
import path from 'path';
import bodyparser from 'body-parser';

const app = express();
dotenv.config();
//db
mongoose
.connect(process.env.CONNECTION_URL, {useNewUrlParser: true})
.then(()=>{console.log('DB connected')});
mongoose.connection.on('error', (error)=>{console.log(`DB Connection error: ${error}`)});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());//to get json data from request body
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use((req,res,next)=>{
    res.setHeader('Acces-Control-Allow-Origin','*');
    res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
    next(); 
})
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended:true}));
//route middleware
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use('/', productRouter);
app.use('/', braintreeRouter);
app.use('/', orderRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT:${PORT}`);
})