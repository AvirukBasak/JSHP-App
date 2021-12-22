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
exports.startServer = void 0;
const HTTP = __importStar(require("http"));
const URL = __importStar(require("url"));
const FS = __importStar(require("fs"));
const config_1 = require("../config/config");
const common_1 = require("../common/common");
const methods_1 = require("./methods");
/**
 * Listens at port and returns static files / parsed JSHP HTML files.
 * @param {string} host The host to listen to.
 * @param {number} port Port where server will listen.
 * @param {string} resource_root Path from where files will be served.
 * @param {string} logfile Path to log file.
 */
const startServer = function (host, port, resource_root, logfile) {
    // Loads configuration data from config.json file or config.ts.
    const Config = FS.existsSync(resource_root + '/config.json') ? Object.assign(Object.assign({}, config_1.DefConfig), JSON.parse((0, common_1.string)(FS.readFileSync(resource_root + '/config.json')))) : config_1.DefConfig;
    // loads passed param into Config object
    if (resource_root)
        Config.resource_root = resource_root;
    if (logfile)
        Config.log_path = resource_root + '/' + logfile;
    else
        Config.log_path = resource_root + '/' + Config.log_path;
    // loads data from Config to local variables
    logfile = Config.log_path;
    // if set to false
    if (!Config.trailing_slashes) {
        // insert '/' to beginning of array, directories always gain preference over file extensions
        Config.no_extension.splice(0, 0, '/');
    }
    // indexes rewrites
    Config.rewriteList = [];
    for (const rwrt of Config.rewrites) {
        Config.rewriteList.push(rwrt.req);
    }
    // indexes redirects
    Config.redirectList = [];
    for (const rdir of Config.redirects) {
        Config.redirectList.push(rdir.req);
    }
    // initializes http methods
    (0, methods_1.initMethods)(Config);
    /**
     * Get path to err_file if it exists, otherwise res.end with error code.
     */
    const putHTTPError = function (req, // HTTP request
    res, // HTTP response
    resource_root, // root of server resources
    log_msg // error log message
    ) {
        (0, common_1.writeLogs)(req, res, logfile, log_msg);
        const err_filepath = resource_root + '/' + Config.err_files[(0, common_1.string)(res.statusCode)];
        if (Config.err_files[(0, common_1.string)(res.statusCode)] && FS.existsSync(err_filepath)) {
            (0, methods_1.GET)(err_filepath, req, res);
        }
        else {
            res.end();
        }
    };
    HTTP.createServer(function (req, res) {
        // loads pathname from request
        let pathname = URL.parse(req.url || '', true).pathname || '/';
        // get query string from request
        const query_str = (function () {
            var _a, _b, _c;
            if (((_a = req.url) === null || _a === void 0 ? void 0 : _a.indexOf('?')) === -1)
                return '';
            else
                return ((_b = req.url) === null || _b === void 0 ? void 0 : _b.substring((_c = req.url) === null || _c === void 0 ? void 0 : _c.indexOf('?'))) || '';
        })();
        // replaces ../ with /, and excess ///// with a single /
        pathname = pathname.replace(/\.{2,}/g, '').replace(/\/{2,}/, '/');
        // Writes headers specified in config.json, sets statusCode = NaN
        for (const header in Config.default_headers) {
            res.setHeader(header, Config.default_headers[header]);
        }
        res.statusCode = NaN;
        (0, common_1.writeLogs)(req, res, logfile, 'requested');
        /* This prevents server from crashing
         * for paths containing %00, response is 'Bad Request'.
         */
        if (pathname.includes('%00')) {
            res.statusCode = 400;
            const error_msg = 'jshp server: error: the requested url is not valid\n'
                + '    character 0 or \'%00\' is not allowed in requests';
            res.end((0, common_1.getHTMLerrMessage)(error_msg));
            (0, common_1.writeLogs)(req, res, logfile, 'character 0 or \'%00\' is not allowed in requests');
            return;
        }
        /* If rewrite exist in Config, change pathname to rewritten name
         * This will cause the server to respond with data from the rewritten path
         */
        if (Config.rewriteList.includes(pathname)) {
            const rwrt = Config.rewrites[Config.rewriteList.indexOf(pathname)];
            pathname = rwrt.src || pathname;
            req.url = pathname + query_str;
        }
        /* If redirect exist in Config, change pathname to redirected name
         */
        else if (Config.redirectList.includes(pathname)) {
            const rdir = Config.redirects[Config.redirectList.indexOf(pathname)];
            pathname = rdir.src || pathname;
            res.statusCode = rdir.status || 300;
            res.setHeader('Location', pathname + query_str);
            res.end();
            req.url = pathname + query_str;
            (0, common_1.writeLogs)(req, res, logfile, 'redirected');
            return;
        }
        /* If path is jshpinfo, respond with data returned by 'nodejs-info' module.
         * The wierd backup of console.error is taken to hide the following error message:
         *
         * Handlebars: Access has been denied to resolve the property "headers" because it is not an "own property" of its parent.
         *     You can add a runtime option to disable the check or this warning:
         *     See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details.
         *
         * The error message comes from the 'handlebars' module, which is used by 'nodejs-info' module,
         * which inturn is used by this function. The error isn't anything serious.
         */
        if (pathname === '/jshpinfo' || pathname === '/jshpinfo/') {
            const console_error_bkp = console.error;
            console.error = function () { };
            res.statusCode = 200;
            res.end(require('nodejs-info')(req) + '<br>');
            console.error = console_error_bkp;
            (0, common_1.writeLogs)(req, res, logfile, 'jshpinfo');
            return;
        }
        // no_extension files
        if (!pathname.endsWith('/')) {
            for (const ext of Config.no_extension) {
                let possible_path = pathname + ext;
                if (FS.existsSync(resource_root + possible_path)) {
                    pathname = possible_path;
                    req.url = pathname + query_str;
                    break;
                }
            }
        }
        // always rewrites / to index value from Config
        if (pathname.endsWith('/')) {
            pathname += Config.index_file;
            req.url = pathname + query_str;
        }
        /* If requested path is blacklisted
         */
        if (Config.forbidden.includes(pathname)) {
            res.statusCode = 403;
            req.url = pathname + query_str;
            putHTTPError(req, res, resource_root, 'forbidden');
            return;
        }
        /* If requested path does not exist respond with 'Not Found'.
         */
        if (!FS.existsSync(resource_root + pathname)) {
            res.statusCode = 404;
            req.url = pathname + query_str;
            putHTTPError(req, res, resource_root, 'not found');
            return;
        }
        res.statusCode = 200;
        req.url = pathname + query_str;
        pathname = resource_root + pathname;
        pathname = pathname.replace(/\/{2,}/, '/');
        switch (req.method) {
            case 'GET': {
                (0, methods_1.GET)(pathname, req, res);
                break;
            }
            case 'POST': {
                (0, methods_1.POST)(pathname, req, res);
                break;
            }
            case 'PUT': {
                (0, methods_1.PUT)(pathname, req, res);
                break;
            }
            case 'DELETE': {
                (0, methods_1.DELETE)(pathname, req, res);
                break;
            }
            case 'OPTIONS': {
                (0, methods_1.OPTIONS)(pathname, req, res);
                break;
            }
            default: {
                res.statusCode = 405;
                putHTTPError(req, res, resource_root, 'unsupported method');
                break;
            }
        }
    }).listen(port, function () {
        const log = `[${(0, common_1.getLongDateTime)()}] NodeJS JSHP Server (http://${host}:${port}) started`;
        console.log(log);
        if (logfile)
            FS.appendFile(logfile, log + '\n', function (error) {
                if (!error)
                    return;
                console.trace(error);
                process.exit(1);
            });
    });
};
exports.startServer = startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGV2L3NyYy9zZXJ2ZXIvc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDJDQUE2QjtBQUM3Qix5Q0FBMkI7QUFDM0IsdUNBQXlCO0FBRXpCLDZDQUE4QztBQUM5Qyw2Q0FNMEI7QUFDMUIsdUNBQXlFO0FBRXpFOzs7Ozs7R0FNRztBQUNJLE1BQU0sV0FBVyxHQUFHLFVBQVMsSUFBWSxFQUFFLElBQVksRUFBRSxhQUFxQixFQUFFLE9BQWU7SUFFbEcsK0RBQStEO0lBQy9ELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUNBQ3RDLGtCQUFTLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLGVBQU0sRUFBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDLGtCQUFTLENBQUM7SUFFeEgsd0NBQXdDO0lBQ3hDLElBQUksYUFBYTtRQUFFLE1BQU0sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3hELElBQUksT0FBTztRQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7O1FBQ3hELE1BQU0sQ0FBQyxRQUFRLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBRTdELDRDQUE0QztJQUM1QyxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUUxQixrQkFBa0I7SUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtRQUMxQiw0RkFBNEY7UUFDNUYsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENB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