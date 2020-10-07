export function Limit(rate: number = 250): MethodDecorator
{
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        const key = `__timeout__${propertyKey}`;

        descriptor.value = function (...args) {
            if (null == this[key]) {
                this[key] = setTimeout(() => {
                    original.apply(this, args);
                    delete this[key];
                }, rate);
            }
        };

        return descriptor;
    };
}
