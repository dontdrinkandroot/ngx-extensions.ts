// This service is based on the `ng2-cookies` package which sadly is not a service and does
// not use `DOCUMENT` injection and therefore doesn't work well with AoT production builds.
// Package: https://github.com/BCJTI/ng2-cookies

import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CookieService {
    private readonly documentIsAccessible: boolean;

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        // To avoid issues with server side prerendering, check if `document` is defined.
        this.documentIsAccessible = document !== undefined;
    }

    /**
     * @param name Cookie name
     */
    check(name: string): boolean {
        if (!this.documentIsAccessible) {
            return false;
        }

        name = encodeURIComponent(name);

        const regExp: RegExp = this.getCookieRegExp(name);
        return regExp.test(this.document.cookie);
    }

    /**
     * @param name Cookie name
     */
    get(name: string): string {
        if (this.documentIsAccessible && this.check(name)) {
            name = encodeURIComponent(name);

            const regExp = this.getCookieRegExp(name);
            const result = regExp.exec(this.document.cookie);
            if (null == result) return ''

            return decodeURIComponent(result[1]);
        } else {
            return '';
        }
    }

    parse(): Record<string, string> {
        if (!this.documentIsAccessible) {
            return {};
        }

        const cookieRecord: Record<string, string> = {};
        const document = this.document;

        if (document.cookie && document.cookie !== '') {
            const cookieParts = document.cookie.split(';');
            for (const currentCookie of cookieParts) {
                const cookie = currentCookie.split('=');
                const cookieName = cookie[0].replace(/^ /, '');
                const cookieValue = cookie[1];
                cookieRecord[cookieName] = decodeURIComponent(cookieValue);
            }
        }

        return cookieRecord;
    }

    /**
     * @param name    Cookie name
     * @param value   Cookie value
     * @param expires Number of days until the cookies expires or an actual `Date`
     * @param path    Cookie path
     * @param domain  Cookie domain
     * @param secure  Secure flag
     */
    set(
        name: string,
        value: string,
        expires?: number | Date,
        path?: string,
        domain?: string,
        secure?: boolean
    ): void {
        if (!this.documentIsAccessible) {
            return;
        }

        let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

        if (expires) {
            if (typeof expires === 'number') {
                const dateExpires: Date = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);

                cookieString += 'expires=' + dateExpires.toUTCString() + ';';
            } else {
                cookieString += 'expires=' + expires.toUTCString() + ';';
            }
        }

        if (path) {
            cookieString += 'path=' + path + ';';
        }

        if (domain) {
            cookieString += 'domain=' + domain + ';';
        }

        if (secure) {
            cookieString += 'secure;';
        }

        this.document.cookie = cookieString;
    }

    /**
     * @param name   Cookie name
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    delete(name: string, path?: string, domain?: string): void {
        if (!this.documentIsAccessible) {
            return;
        }

        this.set(name, '', -1, path, domain);
    }

    /**
     * @param path   Cookie path
     * @param domain Cookie domain
     */
    deleteAll(path?: string, domain?: string): void {
        if (!this.documentIsAccessible) {
            return;
        }

        const cookies = this.parse();

        for (const cookieName in cookies) {
            if (Object.hasOwn(cookies, cookieName)) {
                this.delete(cookieName, path, domain);
            }
        }
    }

    /**
     * @param name Cookie name
     */
    private getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([[\]{}()|=;+?,.*^$])/ig, '\\$1');

        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }
}
