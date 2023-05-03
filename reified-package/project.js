const given = f => f();
const fail = require("@reified/core/fail");
const { group } = require("@reified/collection");

const spawn = require("@await/spawn");

const { basename, dirname, join } = require("node:path");
const { existsSync: exists } = require("node:fs");
const readdir = given((
    { join } = require("node:path"),
    { readdirSync } = require("node:fs")) =>
        dirname => readdirSync(dirname)
            .map(filename => join(dirname, filename)));

const latest = given((
    { rsort, valid } = require("semver"),
    tags = spawn .for("git", "tag") .split("\n")) =>
    async path =>
        rsort((await tags({ cwd: path })).filter(valid))[0]);

const diff = given((
    files = spawn .for ("git", "diff", "--name-only") .split("\n")) =>
    async (path, tag) =>
        (await files(tag, { cwd: path }))
            .map(filename => join(path, filename)));

const Package = require("./package");


const Project = function Project(options)
{
    if (!(this instanceof Project))
        return new Project(options);

    return Object.assign(this, options);
}

module.exports = Project;

Project.fromPath = async function (path)
{
    const name = basename(path);
    const gitDirectoryPath = join(path, ".git");

    if (!exists(gitDirectoryPath))
        fail(`Project ${name} is not backed by git.`);

    const version = await latest(path);

    if (!version)
        fail(`Project ${name} doesn't have a tagged version`);

    const changes = await diff(path, version);
    const perDirectory = group(
        changes,
        changePath =>
            dirname(changePath.substr(path.length + 1)));

    const packages = Object.fromEntries(readdir(path)
        .filter(path => exists(join(path, "package.json")))
        .filter(path => !basename(path).startsWith("_"))
        .map(Package.fromPath)
        .map(package => [package,
            perDirectory[basename(package.path), []]])
        .map(([package, changes]) => Package({ ...package, changes }))
        .map(package => [package.name, package]));

    return Project({ name, path, version, packages, changes });
}

/*
const Package = require("./package");


const Project = function Project(options)
{
    if (!(this instanceof Project))
        return new Project(options);

    return Object.assign(this, options);
}

module.exports = Project;

Project.fromPath = (function (projectPath)
{
    const { exists, exec, readdir } = require("./system");

    const tags = cwd => exec.lines("git tag", { cwd });
    const latest = path =>
        semver.rsort(tags(path).filter(semver.valid))[0];
    const diff = (cwd, latest) => exec
        .lines(`git diff ${latest} --name-only`, { cwd })
        .map(path => join(cwd, path));

    return function ProjectFromPath(path)
    {
        const name = basename(path);
        const gitDirectoryPath = join(path, ".git");

        if (!exists(gitDirectoryPath))
            fail(`Project ${name} is not backed by git.`);

        const version = latest(path);

        if (!version)
            fail(`Project ${name} doesn't have a tagged version`);

        const changes = List(string)(diff(path, version));
        const perDirectory = changes
            .groupBy(changePath =>
                dirname(changePath.substr(path.length + 1)));
        const packages = Map(string, Package)(readdir(path)
            .filter(path => exists(join(path, "package.json")))
            .filter(path => !basename(path).startsWith("_"))
            .map(Package.fromPath)
            .map(package => [package,
                perDirectory.get(basename(package.path), List(string)())])
            .map(([package, changes]) => Package({ ...package, changes }))
            .map(package => [package.name, package]));

        return Project({ name, path, version, packages, changes });
    }
})();



/*
const { data, string } = require("@algebraic/type");
const { List, Map } = require("@algebraic/collections");
const Package = require("./package");

const Project = data `Project` (
    name        => string,
    path        => string,
    version     => string,
    changes     => List(string),
    packages    => Map(string, Package) );

    
    
    const exec = (...args) => execSync(...args).toString("utf-8");
const execl = (...args) => exec(...args).split("\n").filter(x => !!x);
const tags = cwd => execl("git tag", { cwd })
const latest = path => semver.rsort(tags(path).filter(semver.valid))[0];
const diff = (cwd, latest) => execl(`git diff ${latest} --name-only`, { cwd })
    .map(path => join(cwd, path));

// FIXME: We are lucky these are sorted alphabetically, we should ensure that.
const directory = process.cwd();
const projects = readdir(directory)
    .filter(path => exists(join(path, ".git")))
    .map(path => ({ path, latest: latest(path) }))
    .map(({ path, latest }) => ({ path, latest, diff: diff(path, latest) }))
    .filter(({ diff }) => diff.length > 0);
}


const { execSync } = require("child_process");
const semver = require("semver");
const exec = (...args) => execSync(...args).toString("utf-8");
const execl = (...args) => exec(...args).split("\n").filter(x => !!x);
const tags = cwd => execl("git tag", { cwd })
const latest = path => semver.rsort(tags(path).filter(semver.valid))[0];
const diff = (cwd, latest) => execl(`git diff ${latest} --name-only`, { cwd })
    .map(path => join(cwd, path));

// FIXME: We are lucky these are sorted alphabetically, we should ensure that.
const directory = process.cwd();
const projects = readdir(directory)
    .filter(path => exists(join(path, ".git")))
    .map(path => ({ path, latest: latest(path) }))
    .map(({ path, latest }) => ({ path, latest, diff: diff(path, latest) }))
    .filter(({ diff }) => diff.length > 0);
    
    
*/