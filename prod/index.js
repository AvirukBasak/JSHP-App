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
exports.startServer = exports.getHTMLmessage = exports.writeLogs = exports.sysErrToHTTPcode = exports.getLongDateTime = void 0;
// Installs souce map support to map JS runtime line numbers to TS file.
const SourceMapSupport = __importStar(require("source-map-support"));
SourceMapSupport.install();
const common_1 = require("./src/common/common");
Object.defineProperty(exports, "getLongDateTime", { enumerable: true, get: function () { return common_1.getLongDateTime; } });
Object.defineProperty(exports, "sysErrToHTTPcode", { enumerable: true, get: function () { return common_1.sysErrToHTTPcode; } });
Object.defineProperty(exports, "writeLogs", { enumerable: true, get: function () { return common_1.writeLogs; } });
Object.defineProperty(exports, "getHTMLmessage", { enumerable: true, get: function () { return common_1.getHTMLmessage; } });
const server_1 = require("./src/server/server");
Object.defineProperty(exports, "startServer", { enumerable: true, get: function () { return server_1.startServer; } });
/**
 * Evaluates and executes CLI args.
 * @param {string[]} args CLI arguments.
 */
const runInCLI = function (args) {
    // If option is empty, 'h' or 'help'.
    if ([, 'h', 'help'].includes(args[2]))
        console.log('USAGE: jshp [option] [args]\n'
            + '  help                                Display this message\n'
            + '  serve [host:port] [path]            Serve files from path at host:port\n'
            + '  serve [host:port] [path] [logfile]  Log file path is optional\n'
            + '  version                             Display version information');
    // If option is 'v' or 'version'.
    else if (['v', 'version'].includes(args[2]))
        console.log('JSHP - JavaScript Hypertext Preprocessor\n'
            + `Version: ${common_1.VERSION}\n`
            + 'License: GNU General Public License (GPL) v3.0+');
    // If option is 's' or 'server'.
    else if (['s', 'serve'].includes(args[2])) {
        const host = args[3].split(':')[0];
        const port = (0, common_1.number)(args[3].split(':')[1]);
        const path = args[4];
        if (!host) {
            console.log('jshp serve: error: unspecified host');
            process.exit(1);
        }
        if (!port) {
            console.log('jshp serve: error: unspecified port');
            process.exit(1);
        }
        if (!path) {
            console.log('jshp serve: error: unspecified path');
            process.exit(1);
        }
        (0, server_1.startServer)(host, (0, common_1.number)(process.env.PORT || port), path, args[5]);
    }
    // For invalid options.
    else {
        console.log(`jshp: error: invalid option '${args[2]}'\n`
            + `try using 'help' option`);
        process.exit(1);
    }
};
// This checks if script was run from the shell.
const runs_in_shell = require.main === module;
if (runs_in_shell)
    runInCLI(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9kZXYvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsd0VBQXdFO0FBQ3hFLHFFQUF1RDtBQUN2RCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUUzQixnREFRNkI7QUEyRHBCLGdHQWpFTCx3QkFBZSxPQWlFSztBQUNmLGlHQWpFTCx5QkFBZ0IsT0FpRUs7QUFDaEIsMEZBakVMLGtCQUFTLE9BaUVLO0FBQ1QsK0ZBakVMLHVCQUFjLE9BaUVLO0FBN0R2QixnREFBa0Q7QUE4RHpDLDRGQTlEQSxvQkFBVyxPQThEQTtBQTVEcEI7OztHQUdHO0FBQ0gsTUFBTSxRQUFRLEdBQUcsVUFBUyxJQUFjO0lBRXBDLHFDQUFxQztJQUNyQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFFLE9BQU8sQ0FBQyxHQUFHLENBQzVDLCtCQUErQjtjQUMvQiw4REFBOEQ7Y0FDOUQsNEVBQTRFO2NBQzVFLG1FQUFtRTtjQUNuRSxtRUFBbUUsQ0FDeEUsQ0FBQztJQUVGLGlDQUFpQztTQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUNsRCw0Q0FBNEM7Y0FDNUMsWUFBWSxnQkFBTyxJQUFJO2NBQ3ZCLGlEQUFpRCxDQUN0RCxDQUFDO0lBRUYsZ0NBQWdDO1NBQzNCLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFBLG9CQUFXLEVBQUMsSUFBSSxFQUFFLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0RTtJQUVELHVCQUF1QjtTQUNsQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQ0wsZ0NBQWdDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztjQUM1Qyx5QkFBeUIsQ0FDOUIsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7QUFDTCxDQUFDLENBQUE7QUFFRCxnREFBZ0Q7QUFDaEQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7QUFDOUMsSUFBSSxhQUFhO0lBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9