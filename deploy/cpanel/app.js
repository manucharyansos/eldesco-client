// Entry point for cPanel  ->  "Setup Node.js App"  (Application startup file: app.js).
// The real site lives in ~/eldesco-web (server.js, .next, node_modules, public);
// this tiny file only starts it. Keeping them apart stops the Node.js Selector from touching node_modules.
const path = require('path');
const os = require('os');

process.env.NODE_ENV = 'production';
// Must be "localhost": the host name that hosting panels put in HOSTNAME breaks the standalone server.
process.env.HOSTNAME = 'localhost';

require(path.join(process.env.ELDESCO_WEB_DIR || path.join(os.homedir(), 'eldesco-web'), 'server.js'));
