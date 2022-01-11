const NodeCache = require('node-cache')
const mongoose = require('mongoose')
const performance = require('perf_hooks').performance
const Schema = mongoose.Schema;


//stdttl is time live of cache and checkperiod is period automatic remove cache expired
const myCache = new NodeCache({stdTTL: 5, checkperiod : 1000});
// so if u set stdTTL nodecache default will not remove when stdTTL expired and it will check when get function (check)
/*

    _check(key, data) {
        var _retval;
        boundMethodCheck(this, NodeCache);
        _retval = true;
        // data is invalid if the ttl is too old and is not 0
        // console.log data.t < Date.now(), data.t, Date.now()
        if (data.t !== 0 && data.t < Date.now()) {
          if (this.options.deleteOnExpire) {
            _retval = false;
            this.del(key);
          }
          this.emit("expired", key, this._unwrap(data));
        }
        return _retval;
      }
    => so when get function exec then check will run and with option deleteOnExpire = true then will del key


    another option is checkperiod will run automate collection garbage is object expired not need to get key
*/
myCache.on( "set", function( key, value ){
	console.log(`alert set for ${key}`)
});

const UserSchema = new Schema({
    uuid: { type: String, required: true},
    name: { type: String, required: true},
    email: { type: String, required: true},
    avatar: String
})

const User = mongoose.model('user', UserSchema);

const delay = ms => new Promise(res => setTimeout(res, ms));

const main = async () =>{
    await mongoose.connect('mongodb://localhost:27017/test');
    

    //get init not caching 
    var startTime = performance.now()
    const uuid = "123"
    let user = await User.findOne({ uuid});
    console.log(user)
    var endTime = performance.now()
    console.log(`getInformationOfUser no caching ${endTime - startTime} milliseconds`)
    //caching
    //trigger alert when set function call
    let cacheUSer = myCache.set(uuid, user);
    
    var startTime = performance.now()
    if(myCache.has(uuid)){
        console.log(myCache.get(uuid))
    }
    else{
        let user = await User.findOne({ uuid});
        console.log(user)
    }
    var endTime = performance.now()
    console.log(`getInformationOfUser caching ${endTime - startTime} milliseconds`)

    //get key 
    console.log("check expired", myCache.keys())

    //check ttl of cache
    for(let i= 5000; i > 0; i -= 1000){
        await delay(1000);
        //when get cache wil check object have expired
        console.log("time ttl", myCache.getTtl(uuid))
    }

    //check expired
    console.log("list key", myCache.keys())
    console.log("check expired", myCache.get(uuid))
}   

main();



