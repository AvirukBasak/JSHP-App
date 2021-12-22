# JSHP
JavaScript Hypertext Preprocessor - Inspired by PHP, in JavaScript

Note that JSHP is not PHP, it's meant to be a lot different from PHP in functionality.
It is not meant copy each and every feature of PHP into itself.

Are there new stuff to learn about JSHP? Yes.

### Index
1. [Requirements](#requirements)
    - [Why not older NodeJS versions?](#why-not-older-nodejs-versions)
2. [How to run](#how-to-run)
3. [How to compile](#how-to-compile)
4. [CLI help message](#cli-help-message)
5. [The server configuration file](#the-server-configuration-file)
6. [Config properties](#config-properties)
    - [host](#1-host)
    - [port](#2-port)
    - [default_headers](#3-default_headers)
    - [resource_root](#4-resource_root)
    - [log_path](#5-log_path)
    - [index_file](#6-index_file)
    - [timeout_sec](#7-timeout_sec)
    - [exec_extensions](#8-exec_extensions)
    - [trailing_slashes](#9-trailing_slashes)
    - [no_extension](#10-no_extension)
    - [forbidden](#11-forbidden)
    - [rewrites](#12-rewrites)
    - [redirects](#13-redirects)
    - [err_files](#14-err_files)
7. [Coding](#coding)
    - [JSHP HTML file](#jshp-html-file-jshphtml)
    - [HTML templates](#html-templates)
    - [Syntax](#syntax)
8. [Global variables](#global-variables)
9. [Functions](#functions)
10. [Module variables](#module-variables)
11. [Excess variables](#excess-variables)
12. [Other functions](#other-functions)
13. [How are tags parsed](#how-are-tags-parsed)
14. [Warning against async functions](#warning-against-async-functions)
    - [Solutions](#solutions)
15. [Security bug 1](#security-bug-1)

### Requirements
- NodeJS `>= 11.7.0`
- NPM `>= 6.5.0`

#### Why not older NodeJS versions?
- This is because `worker-thread` is used to execute`JSHP` codes.
- This ensures lengthy or buggy do not block server operations.
- This also prevents server from crashing due to errors in async JSHP codes.

### How to run
- Clone this repository.
- From repo root, run `npm i` to install dependencies.
- Run `npm start`.

### How to compile
- Code is pre-compiled.
- Before re-compilation, run `npm i -g typescript`.
- Compile with `npm run build`.

### CLI help message
```
USAGE: npm start [option] [args]
    help                                Display this message
    serve [host:port] [path]            Serve files from path at host:port
    serve [host:port] [path] [logfile]  Log file path is optional
    version                             Display version information
```

### The server configuration file
A file named `config.json` placed at the root of server resources will contain configurations for the server.
Some default configurations are hard coded in `[repo]/dev/src/config.ts`.

Note that objects from default config object and JSON file get merged by spread syntax.
This is done to load default values for unspecified config properties.

Any property specified in `config.json` fully overwrites default values because of shallow object merging.

### Config properties
The server can understand only the following properties.
If you declare a property the server doesn't understand, it won't cause any errors.
You will still be able to access such properties from the `$_CONFIG` object in your JSHP code.

#### 1. host
Quite self explanatory. The host where the server listens.

**Default**: `"host": "localhost"`.

#### 2. port
Self explanatory.

**Default**: `"port": 8080`.

#### 3. default_headers
Headers specified here are written to every response.

**Default**: `"default_headers": {}` i.e. an empty object.

#### 4. resource_root
Directory path containing server resources (HTML, CSS, assets, JSHP files).
Any path `'/path'` automatically means `${resource_root}/path`.

**Default**: `"resource_root": "~/"`.

#### 5. log_path
Path to server log file. Logging cannot be turned off. Nor can you control what you log. The following is the general log format.

Example:
```
[date time] <request/response by> <method> <response code> <path>
```

**Default**: `"log_path": "/server.log"`.

#### 6. index_file
Path to the index file if requested path is a directory.
Directories must end with a `/` in the get request. Otherwise they are considered files.

Example: If `"index_file": "main.jshp.html"`
then for request
```
GET /msg/ HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/msg/main.jshp.html`.
But as the file has a `.jshp.html` extension, it gets executed.

**Default**: `"index_file": "index.jshp.html"`.

#### 7. timeout_sec
Request times out with `500` after a specified number of seconds.
This timeout dictates how long a JSHP code is allowed to be parsed.
If JSHP code contains an infinite loop or something, it'll be killed after specified seconds.

**Default**: `"timeout_sec": 10`

#### 8. exec_extensions
Extensions of files that needs to be parsed for executing JSHP codes.

Example: If `"exec_extensions": [ ".jshp.html" ]`
then any file ending with those extensions will get parsed.

On parsing, if the parser finds any executable JavaScript, it'll get executed, and any non-executable part will be copy-pasted.

**Default**: `"exec_extensions": [ ".jshp.html" ]`

#### 9. trailing_slashes
Trailing slashes after a directory isn't required if set to false.

**Default**: `"trailing_slashes": true`

#### 10. no_extension
If requested path is a file and has no extension, server will look for a file having requested name and one of these extensions.
If specified extension is a `'/'`, then for a directory `/msg/`, trailing slashes will not be required.

Example: If `"no_extension": [ "/", ".jshp.html" ]`
then for request
```
GET /msg/main HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/msg/main.jshp.html`.
That is because `main.jshp.html` is a file having name `main` and ending with and extension specified in `no_extension`.
But as the file has a `.jshp.html` extension, it gets executed.

**Default**: `"exec_extensions": [ ".jshp.html" ]`

#### 11. forbidden
If these files are requested, response is `403`.

**Default**: `"forbidden": [ "/config.json" ]`.

#### 12. rewrites
For a specified path, server sends response from another specified path.

Example: If
```JSON
"rewrites": [
    {
        "req": "/chat",
        "src": "/messaging/chat/index.jshp.html"
    }
]
```
then for request
```
GET /chat HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/messaging/chat/index.jshp.html`.
This request is not a redirection, so it'll result in `200` if `/messaging/chat/index.jshp.html` is valid.

**Default**: `"rewrites": []` i.e. an empty array.

#### 13. redirects
For a specified path, server sends response `3xx` with a `Location` header.

Example: If
```JSON
"redirects": [
    {
        "req": "/chat",
        "src": "/messaging/chat/index.jshp.html",
        "status": 301
    }
]
```
then for request
```
GET /chat HTTP/1.1
Host: xyz.net
Connection: close

```
the server responds with
```
HTTP/1.1 301 Moved Parmanently
Location: /messaging/chat/index.jshp.html
.
.
.

```
This request is a redirection, so it'll result in `3xx`.

**Default**: `"redirects": []` i.e. an empty array.

**NOTE**: Redirects work for external domains as well.
But redirects are not open to the client.
The server redirects only if you specify it in `config.json`.

**NOTE**: If a `req` path is present in both `rewrites` and `redirects`, the server will
prefer a rewrite over a redirection.

This is because for a request, the request is either
rewritten, or redirected, or neither is done.

#### 14. err_files
For a specified HTTP error, a specified file is sent as a response.

Example: If
```JSON
"err_files": {
    "404": "/404.jshp.html",
    "403": "/403.jshp.html"
}
```
Then for a `404` error, server serves the file `/404.jshp.html`.

**Default**: `"err_files": {}` i.e. an empty object.

### Coding
- Create a `<filename>.jshp.html` file.
- Write normal HTML code.
- For JSHP HTML tags, strictly use the following syntax.

#### JSHP HTML file (.jshp.html)
Uses standard HTML/CSS/JS syntax highlighting and is supported in all text editors.
The only caveat is a lengthy tag declaration.

```HTML
<!-- html code -->
    <script class="jshp">
        // JS code
    </script jshp>
<!-- more html code -->
```

#### HTML templates
During parsing, any code within `<? ?>` will be evaluated, regardless of the file.
The return value of that code will be the result of the code.

Example
```HTML
<body>
    <script class="jshp">
        const NAME = $_GET['name'];
        const UID = $_GET['id'];
    </script jshp>
    <p><b>Names: </b><? NAME ?></p>
    <p><b>UID: </b><? UID.toUpperCase() ?></p>
</body>
```

If the code inside has no return value, `undefined` will be the result.

#### Syntax
- Starting tag should exactly be as stated above.
- Ending tag should exactly be as stated above.
- Excess spaces and newlines within the tag declaration isn't valid.
- Tag declarations are case-insensitive.
- To write text/HTML string, use `echo()`.

### Global variables
- `$_ENV` - Object, Stores system environment variables
- `$_CONFIG` - Object, Stores server configuration data
- `$_RES_ROOT` - String, Stores the path to server resources
- `$_REQUEST` - Object, Some request data
- `$_REQUEST_PATH` - String, Requested path
- `$_QUERY_STRING` - String, Request query string
- `$_GET` - Object, Stores url parameters
- `$_POST` - Object, Not yet implemented
- `$_SERVER` - Object, Stores some server variables, work in progress
- `$_SESSION` - Object, Not yet implemented
- `$_COOKIES` - Object, Not yet implemented
- `$_STATUS_CODE` - Number, Stores HTTP response status code
- `$_HEADERS` - Object, Stores headers of response

### Functions
- `set_header(key: string, value: string)` - Sets header of current response
- `echo(str: string): string` - Displays text/HTML
- `Message.echo(str: string, color: string): string` - Displays text/HTML within a color bordered box
- `Message.error(str: string): string` - Displays text/HTML within a red bordered box
- `File.read(path: string, callback: function): Buffer | null` - Synchronously reads file, optional callback
- `File.write(path: string, data: Buffer, callback: function)` - Asynchronously writes file, optional callback
- `Cookie.set(name: string, value: string)` - Not yet implemented
- `Cookie.get(name: string)` - Not yet implemented

### Module variables
- `HTTP` - NodeJS `http` module
- `URL` - NodeJS `url` module
- `FS` - NodeJS `fs` module

### Excess variables
Usage of the following variables is not encouraged.
Messing with these variables can change the way code is executed.
Directly adding un-sanitized user input to these variables can result in RCE (remote code execution).

- `__RAW_CODE__` - String, Code read from file
- `__EVAL_BUFFER__` - Array, Odd position contains executable code
- `__postParse_EVAL_BUFFER__` - Array, Code to be executed
- `__OUTPUT_BUFFER__` - String, Output of execution

### Other functions
- `getLongDateTime(): string` - Gets full date and time, useful for logs

### How are tags parsed?
- The code is read from file in plain text.
- Then the code is split (using `string.split()`) at the tags.
- Any even position of the array is non-executable code.
- Any odd position is executable JavaScript code.
- The even positions get copied to output buffer.
- Odd positions get `eval()`ed.
- `echo()` writes strings into output buffer directly.

### Warning against async functions

```HTML
<script class="jshp">
    require('fs').readFile(`${$_RES_ROOT}/index.template.html`, (error, data) => {
        if (data) echo(String(data));
        if (error) Message.error(String(error.stack));
    });
</script jshp>
```

The above code may not echo into the response.

This code uses the asynchronous `readFile` method from the `fs` module.
Being asynchronous, the code is executed after all synchronous code is completed.

As a result it may not echo the result.

#### Solutions

- There are pre-puilt functions named `File.read` and `File.write`.
- Do not use async functions without knowing their behaviour properly.
- To be added - you'll soon be able to add your own functions, with safety features built according to your needs.

### Security bug 1
Refer to [GHSA-8r4g-cg4m-x23c](https://github.com/advisories/GHSA-8r4g-cg4m-x23c).
- `node-static` v <= 0.7.11 is affected.
- as of 18th Nov, 2021, no fix is available.
- this issue is dealt with in this repo.
- for solution, see commit [038321f](https://github.com/OogleGlu/JSHP/commit/038321ff4271b001544da30394703093aea750f4).
