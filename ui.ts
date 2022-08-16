class UI {
    public static render() {
        this.setTitle();
        this.setFavicon();
        Content.render();
        Navbar.render();
    }

    private static setTitle() {
        document.title = 'wimb';
    }

    private static setFavicon() {
        // set favicon dynamically for all pages
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = './favicon.svg';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}
