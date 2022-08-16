function startup() {
    edom.init();
    UI.render();
    Content.switchContext('scanner', { forceReload: true });
}
