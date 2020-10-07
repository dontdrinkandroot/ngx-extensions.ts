export class NumberUtils
{
    public static getNextPowerOfTwo(value: number): number
    {
        let target = 2;
        while (target < value) {
            target *= 2;
        }

        return target;
    }
}
