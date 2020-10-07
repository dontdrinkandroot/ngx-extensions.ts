export class ObjectUtils
{
    public static deepCopy<T>(value: T): T
    {
        return JSON.parse(JSON.stringify(value));
    }
}
