const NodeCache = require('node-cache')
const mongoose = require('mongoose')
const performance = require('perf_hooks').performance
const Schema = mongoose.Schema;


//stdttl is time live of cache and checkperiod is period automatic remove cache expired
const appCache = new NodeCache({stdTTL: 100, checkperiod : 120});



const UserSchema = new Schema({
    uuid: { type: String, required: true},
    name: { type: String, required: true},
    email: { type: String, required: true},
    avatar: String
})

const User = mongoose.model('user', UserSchema);

const main = async () =>{
    await mongoose.connect('mongodb://localhost:27017/test');
    const user = await User.findOne({ uuid: "123"});
    console.log(user)
}

main();



