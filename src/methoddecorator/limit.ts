export function Limit(rate: number = 250): MethodDecorator
{
    let timeoutReference: any = null;

    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const original = descriptor.value;
        descriptor.value = function (...args: any) {
            if (null == timeoutReference) {
                timeoutReference = setTimeout(() => {
                    original.apply(this, args);
                    timeoutReference = undefined
                }, rate);
            }
        };

        return descriptor;
    };
}
