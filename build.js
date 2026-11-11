/* Assemble src/*.js (dans l'ordre des numéros) en app.js, dans une seule fonction. Usage : node build.js */
var fs = require('fs'), path = require('path');
var dir = path.join(__dirname, 'src');
var files = fs.readdirSync(dir).filter(function (f) { return /\.js$/.test(f); }).sort();
var body = files.map(function (f) { return fs.readFileSync(path.join(dir, f), 'utf8'); }).join('');
var out = '/* FICHIER GÉNÉRÉ par build.js à partir de src/. Ne le modifie pas à la main : modifie src/ puis lance : node build.js */\n(function () {\n\'use strict\';\n\n' + body + '})();\n';
fs.writeFileSync(path.join(__dirname, 'app.js'), out);
console.log('app.js : ' + files.length + ' modules, ' + out.length + ' octets');
