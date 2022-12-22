var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const idValidator = require('mongoose-id-validator');

var schema =  new Schema({
    payerId: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    recipientId:{
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    settleAmount:{
        type: Number,
        required: true,
    },
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

module.exports = mongoose.model('Settle', schema);