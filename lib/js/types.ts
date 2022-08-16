interface Mission {
    name: string;
    acronyms: string;
    vehicle: string;
    status: string;
    type: string;
    body: string;
    apogee: number;
    perigee: number;
}

interface Vehicle {
    name: string;
    isReusable: boolean,
    tal: number,
    stages: number,
    status: string
}
interface obj extends Object {
    [key: string]: any;
}
