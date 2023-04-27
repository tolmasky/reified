const spawn = require("@await/spawn");

// We prune workspace because in CI workspace is in the /tonic folder, causing
// it to also pick up files there.
const find = Object.assign(async (source, ...args) => (await spawn("find",
[
    source,
    "-path", "*/node_modules", "-prune", "-o",
    "-path", `${HOME}/build-cache/workspace/*`, "-prune", "-o",
    ...args,
    "-print0"
]))
        .stdout
        .toString("utf-8")
        .trim()
        .split("\0")
        .filter(filename => !!filename)
        .map(filename => ({ name: relative(from, filename), filename })),
{
    suites: async () => (await find(HOME, "-name", "__tests__"))
        .map(({ name, ...rest }) =>
            ({ name: basename(dirname(name)), ...rest })),

    tests: async () => await Promise.all((await find.suites())
        .map(async suite =>
        ({
            ...suite,
            tests: (await find(suite.filename, "-name", "*.test.md"))
        })))
});