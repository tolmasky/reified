const given = f => f();

const I = require("@reified/intrinsics");
const Declaration = require("./declaration");
const { ƒnamed } = require("./function-objects");


const Definition = Declaration `Definition` (
    ({ name, tail:[instantiate] }) => given((
    definitions = new WeakMap()) =>
[
    ƒnamed(name, function Definition(...argumentsList)
    {
        if (!(this instanceof Definition))
            return new Definition(...argumentsList);

        const properties = instantiate(...argumentsList);

        definitions.set(properties.implementation, this);

        return I `Object.assign` (this, properties);
    }),
    ƒnamed(`Get${name}Of`, implemenation => definitions.get(implemenation))
]));

module.exports = Definition;
