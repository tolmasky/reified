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

module.exports =
{
    ls: spawn .for ("git", "ls-files", "-z") .split("\0")
};
