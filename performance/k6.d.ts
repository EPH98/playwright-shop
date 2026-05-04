declare module 'k6' {
  export function sleep(seconds: number): void;
  export function check(value: any, checks: Record<string, (val: any) => boolean>): boolean;
  export const options: any;
}

declare module 'k6/http' {
  export function get(url: string, params?: any): any;
  export function post(url: string, payload?: any, params?: any): any;
  export function put(url: string, payload?: any, params?: any): any;
  export function del(url: string, params?: any): any;
  export function patch(url: string, payload?: any, params?: any): any;
  export function request(method: string, url: string, payload?: any, params?: any): any;
  export function batch(requests: any[]): any;
}

declare module 'k6/browser' {
  import type { Page } from 'k6/browser';

  export interface Page {
    goto(url: string, options?: any): Promise<void>;
    close(): Promise<void>;
    waitForLoadState(state: string): Promise<void>;
    locator(selector: string): any;
    click(selector: string): Promise<void>;
    fill(selector: string, text: string): Promise<void>;
    screenshot(options?: any): Promise<Buffer>;
    url(): string;
    title(): string;
    on(event: string, callback: Function): void;
  }

  export interface Browser {
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }

  const browser: {
    newPage(): Promise<Page>;
  };

  export default browser;
}
