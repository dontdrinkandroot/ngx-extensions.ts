import Timeout = NodeJS.Timeout;

export function Debounce(delay: number = 250): MethodDecorator
{
    let timeoutReference: Timeout | undefined = undefined

    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const original = descriptor.value;
        descriptor.value = function (...args: any) {
            if (null != timeoutReference) clearTimeout(timeoutReference);
            timeoutReference = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    };
}
