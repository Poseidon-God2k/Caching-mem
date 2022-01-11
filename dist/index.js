"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var caching_util_1 = require("./caching.util");
var perf_hooks_1 = require("perf_hooks");
var caching = new caching_util_1.CachingModule();
var schema = new mongoose_1.Schema({
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
});
var UserModel = (0, mongoose_1.model)('User', schema);
function createNewUser(uuid, name, email, avatar) {
    return __awaiter(this, void 0, void 0, function () {
        var doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (caching.get(uuid)) {
                        throw Error("User is exist");
                    }
                    return [4 /*yield*/, (0, mongoose_1.connect)('mongodb://localhost:27017/test')];
                case 1:
                    _a.sent();
                    doc = new UserModel({
                        uuid: uuid,
                        name: name,
                        email: email,
                        avatar: avatar
                    });
                    return [4 /*yield*/, doc.save()];
                case 2:
                    _a.sent();
                    caching.add(uuid, doc);
                    return [2 /*return*/];
            }
        });
    });
}
function getInformationOfUser(uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var db, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (caching.get(uuid))
                        return [2 /*return*/, caching.get(uuid)];
                    return [4 /*yield*/, (0, mongoose_1.connect)('mongodb://localhost:27017/test')];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, UserModel.findOne({ uuid: uuid })];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, user1234, endTime, startTime, user123, endTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createNewUser("1234", 'Bill', 'bill@initech.com', 'https://i.imgur.com/dM7Thhn.png')];
            case 1:
                _a.sent();
                startTime = perf_hooks_1.performance.now();
                return [4 /*yield*/, getInformationOfUser("1234")];
            case 2:
                user1234 = _a.sent();
                console.log(user1234 === null || user1234 === void 0 ? void 0 : user1234.name);
                endTime = perf_hooks_1.performance.now();
                console.log("getInformationOfUser has caching " + (endTime - startTime) + " milliseconds");
                startTime = perf_hooks_1.performance.now();
                return [4 /*yield*/, getInformationOfUser("123")];
            case 3:
                user123 = _a.sent();
                console.log(user123 === null || user123 === void 0 ? void 0 : user123.name);
                endTime = perf_hooks_1.performance.now();
                console.log("getInformationOfUser no caching " + (endTime - startTime) + " milliseconds");
                return [2 /*return*/];
        }
    });
}); };
main();
