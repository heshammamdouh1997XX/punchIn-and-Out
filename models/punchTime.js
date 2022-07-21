var mongoose=require('mongoose')
const { Schema } = mongoose;

punchTimeSchema = Schema({
    timeIn:{type:Object},
    timeOut:{type:Object},
    hours:{type:Number},
    username:{type:Schema.Types.ObjectId,ref:'user'}
})

module.exports = mongoose.model('punchTime',punchTimeSchema)
