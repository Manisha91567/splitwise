var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const idValidator = require('mongoose-id-validator');

var schema = new Schema({
    memberIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required:true
    }],
    description:{
        type: String,
        minLength: 5,
        maxLength: 100, 
        required:true,
    },
    amount:{
        type: Number,
        required:true
    },
    paidBy:[
      {
            paidById: {type: Schema.Types.ObjectId , ref : 'Member'} ,
            paidByAmount: Number
        },
    ],
    split:{
        type: String,
        required:true,
        enum :{values:['equally' , 'unequally'] ,
         message: "split value should be equally or unequally" },
    },
    splitMethod:{
        type: String,
        enum: {values: ['byExactAmount' , 'byPercentage'],
         message:"splitMethod should be byExactAmount,byPercentage,byShares,byAdjustment"}
    },
    splitWith:[
        {
            splitWithId:{type: Schema.Types.ObjectId , ref : 'Member'} ,
            splitWithAmount:Number
        }
    ],
    groupId :{
        type: Schema.Types.ObjectId,
    }
},
{ timestamps: true }
);

schema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
   }

schema.plugin(idValidator);

module.exports = mongoose.model('Expenses', schema);