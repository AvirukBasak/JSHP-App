'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefConfig = void 0;
/* note that config object can't have objects of depth > 2,
 * where the config object itself is at depth 0
 */
exports.DefConfig = {
    "host": "localhost",
    "port": "8080",
    "default_headers": {},
    "resource_root": "~/",
    "log_path": "/server.log",
    "index_file": "index.jshp.html",
    "timeout_sec": 10,
    "exec_extensions": [".jshp.html"],
    "trailing_slashes": true,
    "no_extension": [".jshp.html"],
    "forbidden": [
        "/config.json"
    ],
    "rewrites": [],
    "redirects": [],
    "err_files": {},
    "mimetypes": {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGV2L3NyYy9jb25maWcvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWI7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBcUI7SUFDdkMsTUFBTSxFQUFFLFdBQVc7SUFDbkIsTUFBTSxFQUFFLE1BQU07SUFDZCxpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLFlBQVksRUFBRSxpQkFBaUI7SUFDL0IsYUFBYSxFQUFFLEVBQUU7SUFDakIsaUJBQWlCLEVBQUUsQ0FBRSxZQUFZLENBQUU7SUFDbkMsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixjQUFjLEVBQUUsQ0FBRSxZQUFZLENBQUU7SUFDaEMsV0FBVyxFQUFFO1FBQ1QsY0FBYztLQUNqQjtJQUNELFVBQVUsRUFBRSxFQUNYO0lBQ0QsV0FBVyxFQUFFLEVBQ1o7SUFDRCxXQUFXLEVBQUUsRUFBRTtJQUNmLFdBQVcsRUFBRztRQUNWLEtBQUssRUFBRSxZQUFZO1FBQ25CLEtBQUssRUFBRSxXQUFXO1FBQ2xCLE1BQU0sRUFBRSxXQUFXO1FBQ25CLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxZQUFZO1FBQ25CLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxVQUFVO1FBQ2pCLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsTUFBTSxFQUFFLGtCQUFrQjtLQUM3QjtDQUNKLENBQUMifQ==