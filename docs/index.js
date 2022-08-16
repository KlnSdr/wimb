"use strict";
function startup() {
    edom.init();
    UI.render();
    Content.switchContext('scanner', { forceReload: true });
}
