const prvremadr = prequire('js:prvremadr');

exports.getRemoteAddr = function() {
    return prvremadr.adr();
}
