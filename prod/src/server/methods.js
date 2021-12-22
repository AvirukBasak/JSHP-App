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
exports.OPTIONS = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.initMethods = void 0;
const N_Static = __importStar(require("node-static"));
const common_1 = require("../common/common");
const worker_1 = require("./worker");
// Initializes the static files server.
let CONFIG;
let resource_root;
let logfile;
let NodeStaticServer;
const initMethods = function (config) {
    CONFIG = config;
    resource_root = CONFIG.resource_root;
    logfile = CONFIG.log_path;
    NodeStaticServer = new N_Static.Server(resource_root);
    (0, worker_1.initWorker)(CONFIG);
};
exports.initMethods = initMethods;
const GET = function (pathname, req, res) {
    /* If a jshp file is requested parse it and respond with the result.
     */
    if ((function () {
        for (const ext of CONFIG.exec_extensions)
            if (pathname.endsWith(ext))
                return true;
        return false;
    })())
        try {
            // Executes the pasrer and hence the JSHP code in a seperate thread.
            (0, worker_1.startWorker)(pathname, req, res);
            return;
        }
        catch (error) {
            res.statusCode = 500;
            res.end((0, common_1.getHTMLerrMessage)((0, common_1.string)(error.stack)));
            (0, common_1.writeLogs)(req, res, logfile, (0, common_1.string)(error));
            return;
        }
    // Serves static files, i.e. files that cannot be executed.
    NodeStaticServer.serve(req, res);
    (0, common_1.writeLogs)(req, res, logfile, 'node-static');
};
exports.GET = GET;
const POST = function (pathname, req, res) {
    res.statusCode = 405;
    res.end();
};
exports.POST = POST;
const PUT = function (pathname, req, res) {
    res.statusCode = 405;
    res.end();
};
exports.PUT = PUT;
const DELETE = function (pathname, req, res) {
    res.statusCode = 405;
    res.end();
};
exports.DELETE = DELETE;
const OPTIONS = function (pathname, req, res) {
    res.statusCode = 405;
    res.end();
};
exports.OPTIONS = OPTIONS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Rldi9zcmMvc2VydmVyL21ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsc0RBQXdDO0FBS3hDLDZDQUkwQjtBQUMxQixxQ0FBbUQ7QUFFbkQsdUNBQXVDO0FBQ3ZDLElBQUksTUFBd0IsQ0FBQztBQUM3QixJQUFJLGFBQXFCLENBQUM7QUFDMUIsSUFBSSxPQUFlLENBQUM7QUFDcEIsSUFBSSxnQkFBaUMsQ0FBQztBQUUvQixNQUFNLFdBQVcsR0FBRyxVQUFTLE1BQXdCO0lBQ3hELE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDaEIsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDckMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDMUIsZ0JBQWdCLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3RELElBQUEsbUJBQVUsRUFBQyxNQUFNLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUE7QUFOWSxRQUFBLFdBQVcsZUFNdkI7QUFFTSxNQUFNLEdBQUcsR0FBRyxVQUFTLFFBQWdCLEVBQUUsR0FBeUIsRUFBRSxHQUF3QjtJQUU3RjtPQUNHO0lBQ0gsSUFBSSxDQUFDO1FBQ0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsZUFBZTtZQUFFLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7UUFDbEYsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQyxDQUFDLEVBQUU7UUFBRSxJQUFJO1lBQ04sb0VBQW9FO1lBQ3BFLElBQUEsb0JBQVcsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE9BQU87U0FDVjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7WUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLDBCQUFpQixFQUFDLElBQUEsZUFBTSxFQUFFLEtBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBQSxrQkFBUyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUEsZUFBTSxFQUFDLEtBQWMsQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBTztTQUNWO0lBRUQsMkRBQTJEO0lBQzNELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFakMsSUFBQSxrQkFBUyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQTtBQXRCWSxRQUFBLEdBQUcsT0FzQmY7QUFFTSxNQUFNLElBQUksR0FBRyxVQUFTLFFBQWdCLEVBQUUsR0FBeUIsRUFBRSxHQUF3QjtJQUM5RixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUNyQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUE7QUFIWSxRQUFBLElBQUksUUFHaEI7QUFFTSxNQUFNLEdBQUcsR0FBRyxVQUFTLFFBQWdCLEVBQUUsR0FBeUIsRUFBRSxHQUF3QjtJQUM3RixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUNyQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUE7QUFIWSxRQUFBLEdBQUcsT0FHZjtBQUVNLE1BQU0sTUFBTSxHQUFHLFVBQVMsUUFBZ0IsRUFBRSxHQUF5QixFQUFFLEdBQXdCO0lBQ2hHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLENBQUMsQ0FBQTtBQUhZLFFBQUEsTUFBTSxVQUdsQjtBQUVNLE1BQU0sT0FBTyxHQUFHLFVBQVMsUUFBZ0IsRUFBRSxHQUF5QixFQUFFLEdBQXdCO0lBQ2pHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLENBQUMsQ0FBQTtBQUhZLFFBQUEsT0FBTyxXQUduQiJ9