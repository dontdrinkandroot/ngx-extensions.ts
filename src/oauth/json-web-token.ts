export interface JsonWebToken
{
    /**
     * Audience
     */
    aud: string;

    /**
     * Expiration Time
     */
    exp: number;

    /**
     * Issued At
     */
    iat: number;

    /**
     * JWT ID
     */
    jti: string;

    /**
     * Not Before
     */
    nbf: number;

    /**
     * Scopes
     */
    scopes: string[];

    /**
     * Subject
     */
    sub: string;
}
