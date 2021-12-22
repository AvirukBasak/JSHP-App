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
exports.startWorker = exports.initWorker = void 0;
const WorkerThreads = __importStar(require("worker_threads"));
const common_1 = require("../common/common");
// Initializes the static files server.
let CONFIG;
let resource_root;
let logfile;
const initWorker = function (config) {
    CONFIG = config;
    resource_root = CONFIG.resource_root;
    logfile = CONFIG.log_path;
};
exports.initWorker = initWorker;
/**
 * Starts the parser in a seperate thread.
 * @param {HTTP.IncomingMessage} req The http request object. This object MUST contain 'method' and 'url' attributes.
 * @param {HTTP.ServerResponse} res The server response.
 */
const startWorker = function (pathname, req, res) {
    // Holds the messages and errors as HTML strings as returned by the thread.
    let response_body = '';
    // This is the data that is to be sent to the thread.
    const workerData = {
        resource_root,
        pathname,
        config: CONFIG,
        req: {
            url: req.url,
            method: req.method,
        }
    };
    const worker = new WorkerThreads.Worker(__dirname + '/../parser/parser.js', { workerData });
    let timed_out = false;
    // This timeout terminates the worker after 10s and echoes an error message.
    const timeout = setTimeout(function () {
        worker.terminate();
        timed_out = true;
        response_body += (0, common_1.getHTMLerrMessage)('jshp server: error: jshp file error\n'
            + `    execution timed out after ${CONFIG.timeout_sec} seconds\n`
            + '    please check your jshp code for lengthy operations');
    }, CONFIG.timeout_sec * 1000);
    // On message recieved from thread.
    worker.on('message', function (response) {
        for (const header in response.headers) {
            res.setHeader(header, response.headers[header]);
        }
        res.statusCode = response.statusCode;
        response_body += response.body;
    });
    // On error in thread.
    worker.on('error', function (error) {
        res.statusCode = 500;
        response_body += (0, common_1.getHTMLerrMessage)((0, common_1.string)(error.stack));
    });
    // On worker exit, clear the 10s timeout.
    worker.on('exit', function (exitcode) {
        clearTimeout(timeout);
        if (timed_out) {
            res.statusCode = 500;
            (0, common_1.writeLogs)(req, res, logfile, `parser timed out`);
        }
        else if (exitcode)
            (0, common_1.writeLogs)(req, res, logfile, `jshp error ${exitcode}`);
        else
            (0, common_1.writeLogs)(req, res, logfile, 'jshp');
        res.setHeader('Server', '@oogleglu/jshp ' + common_1.VERSION);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', response_body.length);
        res.end(response_body);
    });
};
exports.startWorker = startWorker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGV2L3NyYy9zZXJ2ZXIvd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDhEQUFnRDtBQUdoRCw2Q0FNMEI7QUFFMUIsdUNBQXVDO0FBQ3ZDLElBQUksTUFBd0IsQ0FBQztBQUM3QixJQUFJLGFBQXFCLENBQUM7QUFDMUIsSUFBSSxPQUFlLENBQUM7QUFFYixNQUFNLFVBQVUsR0FBRyxVQUFTLE1BQXdCO0lBQ3ZELE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDaEIsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDckMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDOUIsQ0FBQyxDQUFBO0FBSlksUUFBQSxVQUFVLGNBSXRCO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sV0FBVyxHQUFHLFVBQVMsUUFBZ0IsRUFBRSxHQUF5QixFQUFFLEdBQXdCO0lBRXJHLDJFQUEyRTtJQUMzRSxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFdkIscURBQXFEO0lBQ3JELE1BQU0sVUFBVSxHQUFHO1FBQ2YsYUFBYTtRQUNiLFFBQVE7UUFDUixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRTtZQUNELEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztZQUNaLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtTQUNyQjtLQUNKLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLHNCQUFzQixFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUM1RixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFdEIsNEVBQTRFO0lBQzVFLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUN2QixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixhQUFhLElBQUksSUFBQSwwQkFBaUIsRUFDNUIsdUNBQXVDO2NBQ3ZDLGlDQUFpQyxNQUFNLENBQUMsV0FBVyxZQUFZO2NBQy9ELHdEQUF3RCxDQUM3RCxDQUFDO0lBQ04sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFOUIsbUNBQW1DO0lBQ25DLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVMsUUFBMEI7UUFDcEQsS0FBSyxNQUFNLE1BQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ25DLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNuRDtRQUNELEdBQUcsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxhQUFhLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztJQUVILHNCQUFzQjtJQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQVk7UUFDcEMsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDckIsYUFBYSxJQUFJLElBQUEsMEJBQWlCLEVBQUMsSUFBQSxlQUFNLEVBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCx5Q0FBeUM7SUFDekMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxRQUFnQjtRQUN2QyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsSUFBSSxTQUFTLEVBQUU7WUFDWCxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztZQUNyQixJQUFBLGtCQUFTLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztTQUNwRDthQUNJLElBQUksUUFBUTtZQUFFLElBQUEsa0JBQVMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFjLFFBQVEsRUFBRSxDQUFDLENBQUM7O1lBQ3JFLElBQUEsa0JBQVMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsR0FBRyxnQkFBTyxDQUFDLENBQUM7UUFDckQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQTtBQTNEWSxRQUFBLFdBQVcsZUEyRHZCIn0=