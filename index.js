#!/usr/bin/env node
const JSHP = require('@oogleglu/jshp');
JSHP.jshp(process.argv[2] || 'serve', process.argv[3] || `:${process.env.PORT}`, process.argv[4] || './Public');
