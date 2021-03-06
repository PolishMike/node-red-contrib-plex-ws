var utils = require('../lib/utils.js');

module.exports = function(RED) {
    class NotificationNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.server = RED.nodes.getNode(config.server);
            utils.bindStateHandlers(this, this.server);

            if (!this.plex) {
                utils.updateNodeStatusFailed(this, 'plex not configured');
                return;
            }

            this.begin();
        }

        get plex() {
            return !!this.server ? this.server.plex : null;
        }

        begin() {
            this.plex.on('notification', (data) => {
                const msg = { payload: data };
                this.send(msg);
            });
        }
    }

    RED.nodes.registerType('plex-ws-notification', NotificationNode);
};
