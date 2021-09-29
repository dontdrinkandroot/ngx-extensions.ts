import {ObjectUtils} from './object-utils';

export class CollectionUtils
{
    /**
     * Maps an array into a Map by a specific property which should be unique.
     */
    public static mapByProperty<V extends object, K extends keyof V>(entries: Array<V>, property: K): Map<any, V>
    {
        const map = new Map<any, V>();
        for (const entry of entries) {
            map.set(ObjectUtils.getProperty(entry, property), entry);
        }

        return map;
    }

    /**
     * Maps an array into a Map by a specified property and aggregates them into an array.
     */
    public static mapArrayByProperty<V extends object, K extends keyof V>(entries: Array<V>, property: K): Map<any, V[]>
    {
        const map = new Map<any, V[]>();
        for (const entry of entries) {
            const value = ObjectUtils.getProperty(entry, property);
            const existingEntries = map.get(value) ?? []
            existingEntries.push(entry)
            map.set(value, existingEntries)
        }

        return map;
    }
}
