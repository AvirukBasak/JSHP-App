'use strict';

/* note that config object can't have objects of depth > 2,
 * where the config object itself is at depth 0
 */
export const DefConfig: NodeJS.Dict<any> = {
    "host": "localhost",
    "port": "8080",
    "default_headers": {},
    "resource_root": "~/",
    "log_path": "/server.log",
    "index_file": "index.jshp.html",
    "timeout_sec": 10,
    "exec_extensions": [ ".jshp.html" ],
    "trailing_slashes": true,
    "no_extension": [ ".jshp.html" ],
    "forbidden": [
        "/config.json"
    ],
    "rewrites": [
    ],
    "redirects": [
    ],
    "err_files": {},
    "mimetypes" : {
        "txt": "text/plain",
        "htm": "text/html",
        "html": "text/html",
        "jhp": "text/html",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "css": "text/css",
        "js": "text/javascript",
        "json": "application/json"
    }
};
