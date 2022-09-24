export class OAuth2Error extends Error
{
    public static readonly CODE_NOT_FOUND = 'code_not_found';

    public static readonly ACCESS_DENIED = 'access_denied';

    constructor(error: string)
    {
        super(error);
    }
}
