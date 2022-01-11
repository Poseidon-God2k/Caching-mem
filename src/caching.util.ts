
interface IObjectKeys {
  [key: string]: any;
}

class CachingModule {
    cache : IObjectKeys;

    constructor(){
        this.cache = {};
    }

    add(key: string, value: any){
        if(this.cache.hasOwnProperty(key)){
            throw Error("key is exits")
        }
        this.cache[key] = value;
    }

    update(key: string, value: any){
        if(!this.cache.hasOwnProperty(key)){
            throw Error("key isn't exits")
        }
        this.cache[key] = value;
    }

    remove(key: string){
        delete this.cache[key];
    }

    get(key: string){
        return this.cache[key];
    }

    getAll(){
        return this.cache;
    }
}


export {
    CachingModule
}