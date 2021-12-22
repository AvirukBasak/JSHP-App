'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = exports.number = exports.getHTMLerrMessage = exports.getHTMLmessage = exports.writeLogs = exports.sysErrToHTTPcode = exports.getLongDateTime = exports.rmObjFunctions = exports.VERSION = void 0;
const FS = __importStar(require("fs"));
exports.VERSION = 'v2021.12.20.15.00';
const object_history = [];
/**
 * Removes functions from an object. The passed object will get modified.
 * @param {NodeJS.Dict<any>} obj The object from which functions are to be removed.
 * @return {NodeJS.Dict<any>}
 */
const rmObjFunctions = function (obj) {
    for (const key in obj) {
        if ((typeof obj[key]).toLowerCase() === 'function')
            obj[key] = null;
        else if ((typeof obj[key]).toLowerCase() === 'object') {
            if (object_history.indexOf(obj[key]) != -1)
                continue;
            object_history.push(obj[key]);
            (0, exports.rmObjFunctions)(obj[key]);
        }
    }
    return obj;
};
exports.rmObjFunctions = rmObjFunctions;
/**
 * Returns current date and time.
 * @return {string}
 */
const getLongDateTime = function () {
    const date_ob = new Date();
    const date = ('0' + date_ob.getDate()).slice(-2);
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    const year = ('' + date_ob.getFullYear());
    const hours = ('0' + date_ob.getHours()).slice(-2);
    const minute = ('0' + date_ob.getMinutes()).slice(-2);
    const seconds = ('0' + date_ob.getSeconds()).slice(-2);
    return `${year}-${month}-${date} ${hours}:${minute}:${seconds}`;
};
exports.getLongDateTime = getLongDateTime;
/**
 * Returns an http error code for a given system error code.
 * @param {string} error
 * @return {number}
 */
const sysErrToHTTPcode = function (error) {
    const code = error.code;
    return (code === 'EACCES' ? 401 :
        code === 'ENOTDIR' ? 401 :
            code === 'EISDIR' ? 400 :
                code === 'ENOENT' ? 404 :
                    code === 'EPERM' ? 401 : 500);
};
exports.sysErrToHTTPcode = sysErrToHTTPcode;
/**
 * Write logs to console.
 * @param {HTTP.IncomingMessage} req
 * @param {HTTP.ServerResponse} res
 * @param {string} logfile
 * @param {string} msg
 */
const writeLogs = function (req, res, logfile, msg) {
    var _a, _b;
    if (!req || !res)
        return;
    const client_ip = ((_a = req === null || req === void 0 ? void 0 : req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress)
        || ((_b = req === null || req === void 0 ? void 0 : req.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress)
        || (req.headers['x-forwarded-for'] || '').replace(/,\s|,/g, ' -> ')
        || 'client ip N/A';
    const log = `[${(0, exports.getLongDateTime)()}] ${msg ? msg : ''}: ${client_ip} [${res.statusCode}]: ${req.method} ${req.url}`;
    console.log(log);
    if (logfile)
        FS.appendFile(logfile, log + '\n', function (error) {
            if (!error)
                return;
            console.trace(error);
            process.exit(1);
        });
};
exports.writeLogs = writeLogs;
/**
 * Takes a string and a color and returns an html message.
 * These messages normally report errors and warnings.
 * @param {string} str The message.
 * @param {string} color HTML color for the border.
 */
const getHTMLmessage = function (str, color = 'dodgerblue') {
    return ('<head>'
        + '<meta name="viewport" content="width=device-width, height=device-height">'
        + '</head>'
        + '<pre style="'
        + 'width: calc(100% - 30px);'
        + 'max-height: 50%;'
        + `border: 1.5px solid ${color};`
        + 'border-radius: 5px;'
        + 'font-size: 0.8rem;'
        + 'line-height: 1.2rem;'
        + 'color: #333;'
        + 'background-color: #eee;'
        + 'display: block;'
        + 'margin: 20px auto 20px;'
        + 'padding: 10px;'
        + 'overflow: auto; ">'
        + str
        + '</pre>');
};
exports.getHTMLmessage = getHTMLmessage;
/**
 * Generates an error box in HTML from a string.
 * @param {string}
 */
const getHTMLerrMessage = function (str) {
    return (0, exports.getHTMLmessage)(str, 'tomato');
};
exports.getHTMLerrMessage = getHTMLerrMessage;
/**
 * A pointless wrapper for Number().
 * @param {any} value The value to be converted to a number.
 * @return {number}
 */
const number = (value) => Number(value);
exports.number = number;
/**
 * A pointless wrapper for String().
 * @param {any} value The value to be converted to a string.
 * @return {string}
 */
const string = (value) => String(value);
exports.string = string;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGV2L3NyYy9jb21tb24vY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUliLHVDQUF5QjtBQUVaLFFBQUEsT0FBTyxHQUFHLG1CQUFtQixDQUFDO0FBRTNDLE1BQU0sY0FBYyxHQUF1QixFQUFFLENBQUM7QUFDOUM7Ozs7R0FJRztBQUNJLE1BQU0sY0FBYyxHQUFHLFVBQVMsR0FBcUI7SUFDeEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUU7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssVUFBVTtZQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQ25ELElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUUsU0FBUztZQUNyRCxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUEsc0JBQWMsRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM1QjtLQUNKO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUE7QUFWWSxRQUFBLGNBQWMsa0JBVTFCO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxlQUFlLEdBQUc7SUFDM0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUMzQixNQUFNLElBQUksR0FBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssR0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELE1BQU0sSUFBSSxHQUFNLENBQUMsRUFBRSxHQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sS0FBSyxHQUFLLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sTUFBTSxHQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3BFLENBQUMsQ0FBQTtBQVRZLFFBQUEsZUFBZSxtQkFTM0I7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxVQUFTLEtBQVU7SUFDL0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztJQUN4QixPQUFPLENBQ0gsSUFBSSxLQUFLLFFBQVEsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxLQUFLLFFBQVEsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLElBQUksS0FBSyxRQUFRLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMxQixJQUFJLEtBQUssT0FBTyxDQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDakMsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQVRZLFFBQUEsZ0JBQWdCLG9CQVM1QjtBQUVEOzs7Ozs7R0FNRztBQUNJLE1BQU0sU0FBUyxHQUFHLFVBQVMsR0FBeUIsRUFBRSxHQUF3QixFQUFFLE9BQWUsRUFBRSxHQUFXOztJQUMvRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU87SUFDekIsTUFBTSxTQUFTLEdBQUcsQ0FBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxVQUFVLDBDQUFFLGFBQWE7WUFDOUIsTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTSwwQ0FBRSxhQUFhLENBQUE7V0FDMUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFXLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7V0FDMUUsZUFBZSxDQUFDO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBQSx1QkFBZSxHQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLEtBQUssR0FBRyxDQUFDLFVBQVUsTUFBTSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNuSCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLElBQUksT0FBTztRQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsVUFBUyxLQUFLO1lBQzFELElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87WUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBYlksUUFBQSxTQUFTLGFBYXJCO0FBRUQ7Ozs7O0dBS0c7QUFDSSxNQUFNLGNBQWMsR0FBRyxVQUFTLEdBQVcsRUFBRSxRQUFnQixZQUFZO0lBQzVFLE9BQU8sQ0FDRCxRQUFRO1VBQ0osMkVBQTJFO1VBQy9FLFNBQVM7VUFDVCxjQUFjO1VBQ1YsMkJBQTJCO1VBQzNCLGtCQUFrQjtVQUNsQix1QkFBdUIsS0FBSyxHQUFHO1VBQy9CLHFCQUFxQjtVQUNyQixvQkFBb0I7VUFDcEIsc0JBQXNCO1VBQ3RCLGNBQWM7VUFDZCx5QkFBeUI7VUFDekIsaUJBQWlCO1VBQ2pCLHlCQUF5QjtVQUN6QixnQkFBZ0I7VUFDaEIsb0JBQW9CO1VBQ3BCLEdBQUc7VUFDUCxRQUFRLENBQ2IsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQXJCWSxRQUFBLGNBQWMsa0JBcUIxQjtBQUVEOzs7R0FHRztBQUNJLE1BQU0saUJBQWlCLEdBQUcsVUFBUyxHQUFXO0lBQ2pELE9BQU8sSUFBQSxzQkFBYyxFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUE7QUFGWSxRQUFBLGlCQUFpQixxQkFFN0I7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUF4QyxRQUFBLE1BQU0sVUFBa0M7QUFFckQ7Ozs7R0FJRztBQUNJLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFBeEMsUUFBQSxNQUFNLFVBQWtDIn0=