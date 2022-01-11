import { Schema, model, connect } from "mongoose";
import {CachingModule} from "./caching.util"
import { performance } from "perf_hooks";
const caching = new CachingModule();

interface User {
    uuid: string;
    name: string;
    email: string;
    avatar?: string;
}


const schema = new Schema<User>({
    uuid: { type: String, required: true},
    name: { type: String, required: true},
    email: { type: String, required: true},
    avatar: String
})


const UserModel = model<User>('User', schema);

async function createNewUser(uuid: string, name: string, email: string, avatar: string): Promise<void>{
    if(caching.get(uuid)){
        throw Error("User is exist")
    }

    await connect('mongodb://localhost:27017/test');
  
    const doc = new UserModel({
      uuid,
      name,
      email,
      avatar
    });
    await doc.save();
    caching.add(uuid, doc);
    
}
async function getInformationOfUser(uuid: string): Promise<User | null> {
    if(caching.get(uuid))
    return caching.get(uuid)
    const db = await connect('mongodb://localhost:27017/test');
    const user = await UserModel.findOne({uuid})
    return user;
}

const main = async () =>{
    await createNewUser("1234", 'Bill', 'bill@initech.com', 'https://i.imgur.com/dM7Thhn.png');
    
    var startTime = performance.now()
    const user1234 = await getInformationOfUser("1234")
    console.log(user1234?.name)
    var endTime = performance.now()

    console.log(`getInformationOfUser has caching ${endTime - startTime} milliseconds`);

    var startTime = performance.now()
    const user123 = await getInformationOfUser("123")
    console.log(user123?.name)
    var endTime = performance.now()

    console.log(`getInformationOfUser no caching ${endTime - startTime} milliseconds`)


    //it output of caching
    /*
        Bill
        getInformationOfUser has caching 1.0414000153541565 milliseconds
        Bill
        getInformationOfUser no caching 10.126800000667572 milliseconds


        So i think use caching optimize *10
        (this code for using ulti take object let use node-cace)
    */
}


main();