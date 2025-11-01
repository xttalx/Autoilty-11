declare module 'geoip-lite' {
  export interface Lookup {
    range: [number, number];
    country: string;
    region: string;
    city: string;
    ll: [number, number];
    metro: number;
    area: number;
    timezone: string;
  }

  export function lookup(ip: string): Lookup | null;
}

