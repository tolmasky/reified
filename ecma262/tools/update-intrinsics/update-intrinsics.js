const given = f => f();

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
const { parseH1 } = require("ecmarkup/lib/header-parser");

const downloadSpecification = require("../download-specification");
const toFormalParameters = require("./to-formal-parameters");
const parseSignature = require("./parse-signature");

const warn = message => (console.warn(message), false);

const ExcludedTypes = new Set(["abstract operation", "internal method", "sdo"]);

const deintrinsify = name => name.replace(/^%|%$/g, "");
const toSectionIDXPathQuery = given((
    dashcased = name =>
        name.replace(/([a-z])([A-Z])/g, (_, lhs, rhs) => `${lhs}-${rhs}`),
    lowercased = name => name.toLowerCase(),
    transforms = [deintrinsify, dashcased],
    permutations = [0, 1, 2, 3].map(permutation => given((
        filtered = transforms
            .filter((_, index) => permutation & (1 << index))) =>
        name => filtered
            .reduce((name, transform) => transform(name), name)
            .toLowerCase())),
    toPermutedVariants = name =>
        permutations.map(transform => transform(name))) =>
        name => given((
            IDs = toPermutedVariants(name)
                .flatMap(ID => [`sec-${ID}`, `sec-get-${ID}`])) =>
                    `//emu-clause[${IDs
                        .map(ID => `starts-with(@id, "${ID}")`)
                        .join(" or ")}]`));

const toDestination = tag =>
    join(__dirname, "..", "..", tag, "well-known-intrinsic-objects.json");


// constructor
// non-objects like "length"?
// ToProperty(V) -> P
// we need get AND set for __proto__
// Should the signature be more like x.{get}y?
module.exports = async function
({
    tag = "es2022"
}, destination = toDestination(tag))
{
    const specificationLocation = await downloadSpecification({ tag });
    const specification = read(specificationLocation, "utf-8");

    const { window: { document } } = new JSDOM(specification);

    const TopLevelWellKnownIntrinsicObjects =
        fromTable("table-well-known-intrinsic-objects", document);

    const ConcreteTypedArraySubclasses =
        fromTable("table-the-typedarray-constructors", document)
            .map(({ IntrinsicName }) => IntrinsicName.match(/^([^\s]+)/g)[0]);

    const toConcreteTypedArrays =
        ({ fullyQualifiedName, fullyQualifiedKeyPath, ...rest }) =>
            ConcreteTypedArraySubclasses.map(name =>
            ({
                fullyQualifiedName:
                    fullyQualifiedName.replace("%TypedArray%", name),
                fullyQualifiedKeyPath:
                    [name, ...fullyQualifiedKeyPath.slice(1)],
                ...rest
            }));

    const WellKnownIntrinsicsRegExp = new RegExp(`^(?:[gs]et\\s+)?(?:${
        TopLevelWellKnownIntrinsicObjects
            .flatMap(({ IntrinsicName }) =>
                [IntrinsicName, deintrinsify(IntrinsicName)])
            .join("|")})(\\.[^\\s]+|\\s*\\[[^\\]]+\\])*(\\s*\\(|$)`);

    const WellKnownIntrinsicObjects = TopLevelWellKnownIntrinsicObjects
        .flatMap(WKIO => XPathQueryAll
            `${toSectionIDXPathQuery(WKIO.IntrinsicName)}` (document))
        .filter(clause => !ExcludedTypes.has(clause.getAttribute("type")))
        .map(clause => XPathQuerySingle `./h1` (clause).textContent)
        .filter(contents => WellKnownIntrinsicsRegExp.test(contents) ? true : console.log("NO :", contents))
        .map(signature => (console.log("YES: ", signature), signature))
        .map(parseSignature)
        .flatMap(WKIO =>
            WKIO.fullyQualifiedKeyPath[0] === "%TypedArray%" ?
                [WKIO, ...toConcreteTypedArrays(WKIO)] :
                [WKIO])
        .filter(WKIO =>
            !WKIO.failed ||
            warn(`Failure ${WKIO.signature}: ${WKIO.normalized} ${WKIO.errors[0].message}`));

    mkdirp(dirname(destination));
    write(destination, JSON.stringify(WellKnownIntrinsicObjects, null, 2), "utf-8");
}

const toWellKnownIntrinsicObject = (type, fullyQualifiedName, attributes) =>
({
    type,
    fullyQualifiedName,
    keyPath: fullyQualifiedName.split("."),
    ...attributes
});

const toXPathResultArray = result => Array.from(
({
    [Symbol.iterator]: () => ({
        next: () =>
            given((value = result.iterateNext()) =>
                ({ value, done: !value })) })
}));

const XPathQueryAll = tagged `XPathQueryAll` ((query, from) => given((
    document = from.ownerDocument || from,
    { XPathResult: { ANY_TYPE } } = document.defaultView) =>
        toXPathResultArray(document.evaluate(query, from, null, ANY_TYPE, null))));

const XPathQuerySingle = tagged `XPathQuerySingle` ((query, from) =>
    XPathQueryAll `${query}` (from)[0]);

const toTableRows = (id, from) =>
    XPathQueryAll `//*[@id="${id}"]//tr[not(descendant::th)]` (from);
const toTableCells = from => XPathQueryAll `.//td` (from);
const toTableCellTextContents = from =>
    toTableCells(from).map(({ textContent }) => textContent.trim());

const fromTable = (id, from) =>
    toTableRows(id, from)
        .flatMap(row => given((
            [IntrinsicName, GlobalName, documentation] =
                toTableCellTextContents(row)) =>
                    ({ IntrinsicName, GlobalName, documentation })));
