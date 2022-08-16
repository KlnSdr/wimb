class Store {
    public static appName: string = 'wimb';

    public static init() {
        localStorage.setItem(this.appName, '{}');
    }

    public static get(): obj {
        const raw: string = localStorage.getItem(this.appName) || '{}';

        if (raw === '{}') {
            this.init();
        }

        return JSON.parse(raw);
    }

    public static set(data: obj) {
        localStorage.setItem(this.appName, JSON.stringify(data));
    }
}

namespace Datahandler {
    export class local {
        public static get(key: string): obj {
            return Store.get()[key] || { name: '', contents: [] };
        }

        public static set(key: string, data: obj) {
            let store: obj = Store.get();
            store[key] = data;
            Store.set(store);
        }
    }

    export class remote {
        public static get(key: string): Promise<obj> {
            return new Promise<obj>((resolve) => {
                remoteDB.read(key).then((data: string) => {
                    resolve(JSON.parse(data));
                });
            });
        }

        public static create(data: obj): string {
            return remoteDB.write(data);
        }

        public static update(id: string, data: obj) {}
    }
}

class remoteDB {
    private static firebaseConfig = {
        databaseURL: 'https://easyshopping-ac502.firebaseio.com',
    };

    private static isInitialized: boolean = false;
    private static database;

    private static init() {
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

    public static write(data: obj): string {
        this.init();
        let ref = this.database.ref(Store.appName + '/');
        return ref.push(JSON.stringify(data)).key;
    }

    public static read(id: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this.init();
            const ref = this.database.ref(Store.appName + '/' + id);
            ref.once('value', (data) => {
                resolve(data.val());
            });
        });
    }
}
