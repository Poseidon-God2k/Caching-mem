const express = require("express");
const redis = require("redis")
const app = express();
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/test');
require("dotenv").config();

const UserSchema = new Schema({
    uuid: { type: String, required: true},
    name: { type: String, required: true},
    email: { type: String, required: true},
    avatar: String
})

const User = mongoose.model('user', UserSchema);

const PORT = process.env.PORT || 8000;
const clientRedis = redis.createClient(process.env.REDIS_PORT)
clientRedis.on('error', (err) => console.log('Redis Client Error', err));
clientRedis.connect();
clientRedis.on('ready', () => console.log('Redis Connect successful!'));

const cacheMiddleware = async (req, res, next) => {
    const id = req.params.id;
    const user = await clientRedis.get(id);
    if(user){
        res.status(200).json({ data : JSON.parse(user)});
    }
    else{
        next()
    }
}
app.get("/users/:id", cacheMiddleware, async (req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        let user = await User.findOne({uuid: id});
        res.status(200).json({ data : user});
        clientRedis.setEx(id, 3600, JSON.stringify(user));
    }
    catch(err){
        res.status(500).json({ "err": "Cannot find user"})
    }
})

app.listen(PORT, () => {
    console.log("App listening on port ", PORT)
})


///test 
//not redis => 34ms
//have redis => 4s