import {Inject, Injectable} from '@angular/core';
import {DDR_STORAGE_PREFIX} from '../ddr-extensions.module';

@Injectable({
    providedIn: 'root'
})
export class JwtService
{
    /**
     * The current token.
     */
    private token: string | null = null;

    /**
     * The expiry of the current token.
     */
    private tokenExpiry: number | null = null;

    constructor(@Inject(DDR_STORAGE_PREFIX) private storagePrefix: string)
    {
    }

    /**
     * Sets the current token and a refresh token.
     */
    public setTokens(token: string, refreshToken: string): void
    {
        this.setToken(token);
        localStorage.setItem(this.getRefreshTokenStorageKey(), refreshToken);
    }

    /**
     * Sets the current token.
     */
    public setToken(token: string): void
    {
        this.token = token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        this.tokenExpiry = decodedToken.exp * 1000;
        console.log('New refresh token, expiry', new Date(this.tokenExpiry));
    }

    /**
     * Gets the current token.
     */
    public getToken(): string | null
    {
        return this.token;
    }

    /**
     * Gets the refresh token.
     */
    public getRefreshToken(): string | null
    {
        return localStorage.getItem(this.getRefreshTokenStorageKey());
    }

    /**
     * Checks if the current token expired.
     */
    public isExpired(): boolean
    {
        const now = new Date().getTime();
        return null == this.tokenExpiry || this.tokenExpiry < now;
    }

    /**
     * Checks if the current token is about to expire.
     * @param expiryMs
     */
    public isAboutToExpire(expiryMs: number = 60000): boolean
    {
        const now = new Date().getTime();
        return null == this.tokenExpiry || this.tokenExpiry - expiryMs < now;
    }

    /**
     * Clears all token information.
     */
    public clear(): void
    {
        this.token = null;
        this.tokenExpiry = null;
        localStorage.removeItem(this.getRefreshTokenStorageKey());
    }

    private getRefreshTokenStorageKey(): string
    {
        return this.storagePrefix + '.jwt.refresh_token';
    }
}
