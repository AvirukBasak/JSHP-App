#!/usr/bin/env node
const JSHP = require('@oogleglu/jshp');
JSHP.jshp('serve', `:${process.env.PORT}`, './Public');
