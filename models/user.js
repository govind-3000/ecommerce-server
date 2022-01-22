import mongoose  from 'mongoose';
import crypto from 'crypto';
import {v4 as uuidv4} from 'uuid';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: true,
        maxlength: 32
    },

    email:{
        type: String,
        trim:true,
        required: true,
        unique: true
    },

   hashed_password:{
    type: String,
    required: true
   }, 

   about:{
       type: String,
       trim: true
    },

salt: String,

   role:{
       type:Number,
       default: 0
   },

   history:{
    type: Array ,
    default: []
   },
},
    {timestamps: true}
);
// virtual field
userSchema.virtual('password')
.set(function(password){
    this._password = password,
    this.salt = uuidv4(),
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){return this._password});

// methods
userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password; 
    },

    encryptPassword: function(password){
        if(!password)   return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } 
        catch (error) {
            console.log(error);
        }
    }
};

const User = mongoose.model('User', userSchema);
export default User;