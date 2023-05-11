const given = f => f();
const I = { Map, WeakMap };

const ObjectKeys = new Map();
const ProxyKeys = new WeakMap();

const { toPrimitive } = Symbol;

const ProxyKeyDescription = Symbol("ProxyKeyDescription");

const ObjectKey = 
{
    [toPrimitive]: function ()
    {
        return GetProxyForObjectKey(this);
    }
}

const GetProxyForObjectKey = objectKey =>
    ProxyKeys.get(objectKey) || given((
        proxyKey = Symbol(objectKey[ProxyKeyDescription])) => (
        ProxyKeys.set(objectKey, proxyKey),
        ObjectKeys.set(proxyKey, objectKey),
        proxyKey));

const GetObjectKeyForProxyKey = key => ProxiedKeys.get(key);

const cheese = { a: 10, [ProxyKeyDescription]: "cheese", ...ObjectKey };


({ [cheese]: 20, [cheese]: 30 })