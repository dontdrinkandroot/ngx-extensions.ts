export class ObjectUtils
{
    public static deepCopy<T>(value: T): T
    {
        return JSON.parse(JSON.stringify(value));
    }

    public static getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K]
    {
        return o[propertyName];
    }
}
