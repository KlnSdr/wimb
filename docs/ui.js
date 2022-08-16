"use strict";
class UI {
    static render() {
        this.setTitle();
        this.setFavicon();
        Content.render();
        Navbar.render();
    }
    static setTitle() {
        document.title = 'wimb';
    }
    static setFavicon() {
        // set favicon dynamically for all pages
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = './favicon.svg';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}
