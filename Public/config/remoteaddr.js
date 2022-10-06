const prvremadr = prequire('js:config/prvremadr');

exports.getRemoteAddr = function() {
    return prvremadr.adr();
}
