'use strict';

// Installs souce map support to map JS runtime line numbers to TS file.
import * as SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

import {
    VERSION,
    getLongDateTime,
    sysErrToHTTPcode,
    writeLogs,
    getHTMLmessage,
    string,
    number
} from './src/common/common';
import { startServer } from './src/server/server';

/**
 * Evaluates and executes CLI args.
 * @param {string[]} args CLI arguments.
 */
const runInCLI = function(args: string[]): void {

    // If option is empty, 'h' or 'help'.
    if ([, 'h', 'help'].includes(args[2])) console.log(
          'USAGE: jshp [option] [args]\n'
        + '  help                                Display this message\n'
        + '  serve [host:port] [path]            Serve files from path at host:port\n'
        + '  serve [host:port] [path] [logfile]  Log file path is optional\n'
        + '  version                             Display version information'
    );

    // If option is 'v' or 'version'.
    else if (['v', 'version'].includes(args[2])) console.log(
          'JSHP - JavaScript Hypertext Preprocessor\n'
        + `Version: ${VERSION}\n`
        + 'License: GNU General Public License (GPL) v3.0+'
    );

    // If option is 's' or 'server'.
    else if (['s', 'serve'].includes(args[2])) {
        const host = args[3].split(':')[0];
        const port = number(args[3].split(':')[1]);
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
        startServer(host, number(process.env.PORT || port), path, args[5]);
    }

    // For invalid options.
    else {
        console.log(
              `jshp: error: invalid option '${args[2]}'\n`
            + `try using 'help' option`
        );
        process.exit(1);
    }
}

// This checks if script was run from the shell.
const runs_in_shell = require.main === module;
if (runs_in_shell) runInCLI(process.argv);

export { getLongDateTime };
export { sysErrToHTTPcode };
export { writeLogs };
export { getHTMLmessage };
export { startServer };
