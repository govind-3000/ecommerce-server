import User from '../models/user.js';
import braintree from 'braintree';
import dotenv from 'dotenv';

dotenv.config();

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

const generateToken = (req, res)=> {
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).send(err);
        }else{
            res.send(response);
        }
    });
}

const processPayment = (req, res)=> {
    let amountFromTheClient = req.body.amount;
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result)=> {
            if(error){
                res.status(500).json(error);
            }else{
                res.json(result);
            }
        }
    )
}

export default {generateToken, processPayment};