const thenFor = (resolve, reject) =>
    object => Array.isArray(object) ?
        Promise.all(object).then(resolve, reject) :
        object.then(thenFor(resolve, reject), reject);

class PromiseArrayPromise extends Promise
{
    constructor(internal)
    {
        super((resolve, reject) =>
            thenFor(resolve, reject)(internal));
    }

    flatMap(...args)
    {
        return this.map(...args).flat();
    }
    
    static from(internal)
    {
        return new PromiseArrayPromise(internal);
    }
}

module.exports = PromiseArrayPromise;

const toPromiseArrayPromiseMethod = method => function (...args)
{
    return new PromiseArrayPromise(this.then(array => method.call(array, ...args)));
}

const methods = Object.fromEntries(Object
    .entries(Object.getOwnPropertyDescriptors(Array.prototype))
    .filter(([name, { value }]) => name !== "flatMap" && typeof value === "function")
    .map(([name, { value }]) =>
        [name, { value: toPromiseArrayPromiseMethod(value) }]));

Object.defineProperties(PromiseArrayPromise.prototype, methods);
    
    