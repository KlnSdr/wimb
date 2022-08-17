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
            return Store.get()[key] || { id: '', name: '', contents: [] };
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
                remoteDB.read(key).then((data: obj) => {
                    resolve(data);
                });
            });
        }

        public static create(data: obj): string {
            return remoteDB.write(data) as string;
        }

        public static update(id: string, data: obj): Promise<obj> {
            return remoteDB.write(data, true, id) as Promise<obj>;
        }
    }
}

class remoteDB {
    private static firebaseConfig = {
        databaseURL: 'https://easyshopping-ac502.firebaseio.com',
    };

    private static isInitialized: boolean = false;
    // @ts-expect-error firebase db no type 'cause inlcude via js
    private static database;

    private static init() {
        if (this.isInitialized) {
            return;
        }

        // @ts-expect-error firebase not defined 'cause include via js
        firebase.initializeApp(this.firebaseConfig);
        // @ts-expect-error firebase not defined 'cause include via js
        this.database = firebase.database();
        window.onbeforeunload = () => {
            // @ts-expect-error firebase not defined 'cause include via js
            firebase.database().goOffline();
        };
        this.isInitialized = true;
    }

    public static write(
        data: obj,
        update: boolean = false,
        id: string = ''
    ): string | Promise<obj> {
        this.init();
        if (update) {
            let ref = this.database.ref(Store.appName + '/' + id);
            return ref.update(data);
        } else {
            let ref = this.database.ref(Store.appName + '/');
            return ref.push(data).key;
        }
    }

    public static read(id: string): Promise<obj> {
        return new Promise<obj>((resolve) => {
            this.init();
            const ref = this.database.ref(Store.appName + '/' + id);
            // @ts-expect-error implicit any type of data
            ref.once('value', (data) => {
                resolve(data.val());
            });
        });
    }
}
