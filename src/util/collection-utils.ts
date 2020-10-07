export class CollectionUtils
{
    /**
     * Maps an array into a Map by a specific property which should be unique.
     * TODO: Maybe there is something like that in typescript, couldn't find it yet.
     */
    public static mapByProperty<V>(entries: Array<V>, property: string): Map<any, V>
    {
        let map = new Map<any, V>();
        for (let entry of entries) {
            map.set(entry[property], entry);
        }

        return map;
    }

    /**
     * Maps an array into a Map by a specified property and aggregates them into an array.
     * TODO: Maybe there is something like that in typescript, couldn't find it yet.
     */
    public static mapArrayByProperty<V>(entries: Array<V>, property: string): Map<any, V[]>
    {
        let map = new Map<any, V[]>();
        for (let entry of entries) {
            let value = entry[property];
            if (!map.has(value)) {
                map.set(value, []);
            }
            map.get(value).push(entry);
        }

        return map;
    }
}
