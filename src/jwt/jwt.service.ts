import {Injectable} from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {Logger} from '../logger/logger.service';

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

    constructor(
        private storageService: StorageService,
        private loggerService: Logger
    )
    {
    }

    /**
     * Sets the current token and a refresh token.
     */
    public setTokens(token: string, refreshToken: string): void
    {
        this.setToken(token);
        this.storageService.store(this.getRefreshTokenStorageKey(), refreshToken)
    }

    /**
     * Sets the current token.
     */
    public setToken(token: string): void
    {
        this.token = token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        this.tokenExpiry = decodedToken.exp * 1000;
        this.loggerService.info('New refresh token, expiry', new Date(this.tokenExpiry));
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
        return this.storageService.retrieve(this.getRefreshTokenStorageKey())
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
    public isAboutToExpire(expiryMs = 60000): boolean
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
        this.storageService.remove(this.getRefreshTokenStorageKey())
    }

    private getRefreshTokenStorageKey(): string
    {
        return 'jwt.refresh_token';
    }
}
