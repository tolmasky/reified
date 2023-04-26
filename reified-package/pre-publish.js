#!/usr/bin/env -S clf

const PromiseArrayPromise = require("./promise-array-promise");

const { join, resolve, relative } = require("path");
const { writeFileSync: write } = require("fs");
const { inc: increment } = require("semver");
const Package = require("./package");

Error.stackTraceLimit = 1000;

const tab = "    ";

const { PWD } = process.env;
const git = require("./git");

const fromWorkspace = async cwd =>
    (await git.ls("*/package.json", { cwd }))
        .map(filename => join(cwd, filename));


module.exports = async function 
({
    workspaces = [],
}, ...packagePaths)
{
    const packages = await PromiseArrayPromise
        .from(workspaces)
        .flatMap(name => fromWorkspace(resolve(PWD, name)))
        .concat(packagePaths.map(name => resolve(PWD, name)))
        .map(Package.fromPath);

    
/*
    
    const projects = await Promise.all(targets
        .map(name => resolve(PWD, name))
        .map(Project.fromPath));
*/
console.log("going to do ", packages);
}
/*
projects.reduce(function (updated, project)
{
    const { changes } = project;

    if (changes.size <= 0 && updated.size <= 0)
        return updated;

    const { name, version: fromVersion } = project;
    const toVersion = increment(fromVersion, "prerelease");

    console.log(`↑ ${name}: ${fromVersion} -> ${toVersion}`);

    const newVersion = dependency =>
        (scope =>
            updated.has(scope) && updated.get(scope) ||
            scope === name && toVersion)
        (dependency.split("/")[0]);
    const updateDependencies = dependencies => (changes =>
    [
        dependencies.map((version, name) =>
            changes.get(name, [,, version])[2]),
        changes
    ])(dependencies
//        .filter(dependency => dependency.indexOf("/") >= 0)
        .map((fromVersion, dependency) =>
            [dependency, fromVersion, newVersion(dependency)])
        .filter(([,, newVersion]) => newVersion))
    const messages = updates => updates
        .map(([dependency, fromVersion, newVersion]) =>
            `${tab}${tab}${tab}↑ ${dependency}: ${fromVersion} -> ${newVersion}`);

    for (const [_, package] of project.packages)
    {
        console.log(`\n${tab}↑ ${package.name}: ${fromVersion} -> ${toVersion}`);

        if (package.changes.size > 0)
        {
            console.log(`\n${tab}${tab}Changes\n`);
            console.log(package.changes.map(path =>
                `${tab}${tab}${tab}${relative(project.path, path)}`).join("\n"));
        }

        const [dependencies, dependenciesUpdates] =
            updateDependencies(package.dependencies);
        const [peerDependencies, peerDependenciesUpdates] =
            updateDependencies(package.peerDependencies);

        if (dependenciesUpdates.size > 0)
        {
            console.log(`\n${tab}${tab}Dependencies\n`)
            console.log(`${messages(dependenciesUpdates).join("\n")}`);
        }

        if (peerDependenciesUpdates.size > 0)
        {
            console.log(`\n${tab}${tab}Peer Dependencies\n`)
            console.log(`${messages(peerDependenciesUpdates).join("\n")}`);
        }

        if (process.env.DO)
        {
            const packageJSONPath = `${package.path}/package.json`;
            const packageJSON = PackageJSON(require(packageJSONPath))
                .merge(PackageJSON(
                {
                    version: toVersion,
                    ...(dependencies.size > 0 && { dependencies }),
                    ...(peerDependencies.size > 0 && { peerDependencies })
                }));

            writeFileSync(packageJSONPath,
                JSON.stringify(packageJSON, null, 2) + "\n", "utf-8");
        }
    }

    return updated.set(project.name, toVersion);
}, OrderedMap(string, string)());
*/