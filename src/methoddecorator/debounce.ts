export function Debounce(delay = 250): MethodDecorator
{
    let timeoutReference: ReturnType<typeof setTimeout> | null = null;

    // eslint-disable-next-line
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const original = descriptor.value
        descriptor.value = function (...args: unknown[]) {
            if (null != timeoutReference) clearTimeout(timeoutReference);
            timeoutReference = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    };
}
