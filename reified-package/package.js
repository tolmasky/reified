const { basename, join } = require("node:path");
const { ø } = require("@reified/object");

/* const { data, string } = require("@algebraic/type");
 const { List, OrderedMap } = require("@algebraic/collections");


const Package = data `Package` (
    name    => string,
    path    => string,
    version => string,
    changes => [List(string), List(string)()],
    dependencies => DependencyMap,
    peerDependencies => DependencyMap );
const DependencyMap = OrderedMap(string, string);
*/

const Package = function Package(options)
{
    if (!(this instanceof Package))
        return new Package(options);

    return Object.assign(this, options);
}

module.exports = Package;

Package.fromPath = function (ambiguous)
{
    const filename = basename(ambiguous) === "package.json" ?
        ambiguous :
        join(ambiguous, "package.json");
        
    const { name, version, ...rest } = require(filename);

    const dependencies = ø(rest.dependencies);
    const peerDependencies = ø(rest.peerDependencies);

    return Package({ name, filename, version, dependencies, peerDependencies });
}
