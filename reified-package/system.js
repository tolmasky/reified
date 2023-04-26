const { join } = require("path");
const { readdirSync, existsSync } = require("fs");

module.exports.readdir = path => readdirSync(path)
    .map(name => join(path, name));

module.exports.exists = existsSync;

const { execSync } = require("child_process");
const exec = (...args) => execSync(...args).toString("utf-8");

exec.lines = (...args) =>
    exec(...args).split("\n").filter(x => !!x);

module.exports.exec = exec;
