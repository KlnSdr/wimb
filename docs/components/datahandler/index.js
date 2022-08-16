"use strict";
class Store {
    static init() {
        localStorage.setItem(this.appName, '{}');
    }
    static get() {
        const raw = localStorage.getItem(this.appName) || '{}';
        if (raw === '{}') {
            this.init();
        }
        return JSON.parse(raw);
    }
    static set(data) {
        localStorage.setItem(this.appName, JSON.stringify(data));
    }
}
Store.appName = 'wimb';
var Datahandler;
(function (Datahandler) {
    class local {
        static get(key) {
            return Store.get()[key] || { name: '', contents: [] };
        }
        static set(key, data) {
            let store = Store.get();
            store[key] = data;
            Store.set(store);
        }
    }
    Datahandler.local = local;
    class remote {
        static get(key) {
            return new Promise((resolve) => {
                remoteDB.read(key).then((data) => {
                    resolve(JSON.parse(data));
                });
            });
        }
        static create(data) {
            return remoteDB.write(data);
        }
        static update(id, data) { }
    }
    Datahandler.remote = remote;
})(Datahandler || (Datahandler = {}));
class remoteDB {
    static init() {
        if (this.isInitialized) {
            return;
        }
        firebase.initializeApp(this.firebaseConfig);
        this.database = firebase.database();
        window.onbeforeunload = () => {
            firebase.database().goOffline();
        };
        this.isInitialized = true;
    }
    static write(data) {
        this.init();
        let ref = this.database.ref(Store.appName + '/');
        return ref.push(JSON.stringify(data)).key;
    }
    static read(id) {
        return new Promise((resolve) => {
            this.init();
            const ref = this.database.ref(Store.appName + '/' + id);
            ref.once('value', (data) => {
                resolve(data.val());
            });
        });
    }
}
remoteDB.firebaseConfig = {
    databaseURL: 'https://easyshopping-ac502.firebaseio.com',
};
remoteDB.isInitialized = false;
