const
{
    mkdirSync: mkdir,
    readFileSync: read,
    writeFileSync: write
} = require("fs");
const { dirname, join } = require("path");
const writep = (filename, ...rest) => mkdirp(dirname(filename), ...rest);
const mkdirp = filename => (mkdir(filename, { recursive: true }), filename);

const { tagged } = require("ftagged");
const { JSDOM } = require("jsdom");

const downloadSpecification = require("../download-specification");

const toDestination = (tag, name) =>
    join(__dirname, "..", "..", tag, `${name}.json`);

async function toDOMDocument(tag)
{
   const specificationLocation = await downloadSpecification({ tag });
   const specification = read(specificationLocation, "utf-8");

   return (new JSDOM(specification)).window.document;
}

module.exports = tagged `fromSpecification` ((name, extract) =>
    async function
    ({
        tag = "es2022",
        document = null,
    }, destination = toDestination(tag, name))
    {
        const extracted = extract(document || await toDOMDocument(tag));

        mkdirp(dirname(destination));
        write(destination, JSON.stringify(extracted, null, 2), "utf-8");
    });
