export function Limit(rate = 250): MethodDecorator
{
    let timeoutReference: ReturnType<typeof setTimeout> | null = null;

    // eslint-disable-next-line
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const original = descriptor.value;
        descriptor.value = function (...args: unknown[]) {
            if (null == timeoutReference) {
                timeoutReference = setTimeout(() => {
                    original.apply(this, args);
                    timeoutReference = null
                }, rate);
            }
        };

        return descriptor;
    };
}
