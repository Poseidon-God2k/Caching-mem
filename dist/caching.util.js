"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingModule = void 0;
var CachingModule = /** @class */ (function () {
    function CachingModule() {
        this.cache = {};
    }
    CachingModule.prototype.add = function (key, value) {
        if (this.cache.hasOwnProperty(key)) {
            throw Error("key is exits");
        }
        this.cache[key] = value;
    };
    CachingModule.prototype.update = function (key, value) {
        if (!this.cache.hasOwnProperty(key)) {
            throw Error("key isn't exits");
        }
        this.cache[key] = value;
    };
    CachingModule.prototype.remove = function (key) {
        delete this.cache[key];
    };
    CachingModule.prototype.get = function (key) {
        return this.cache[key];
    };
    CachingModule.prototype.getAll = function () {
        return this.cache;
    };
    return CachingModule;
}());
exports.CachingModule = CachingModule;
