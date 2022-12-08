const given = f => f();

const XPath = require("./x-path");
const fromSpecification = require("./from-specification");

const toWellKnownID = require("../../to-well-known-id");
const { parseH1 } = require("ecmarkup/lib/header-parser");

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

const fromTable = (id, from) =>
    XPath.toTableCellTextContentRows(id, from)
        .map(([IntrinsicName, GlobalName, documentation]) =>
            ({ IntrinsicName, GlobalName, documentation }));

// constructor
// non-objects like "length"?
// ToProperty(V) -> P
// we need get AND set for __proto__
// Should the signature be more like x.{get}y?
module.exports = fromSpecification `well-known-intrinsic-objects`
    (document => given((
        scope = "ES2022",

        TopLevelWellKnownIntrinsicObjects =
            fromTable("table-well-known-intrinsic-objects", document),

        ConcreteTypedArraySubclasses =
            fromTable("table-the-typedarray-constructors", document)
                .map(({ IntrinsicName }) =>
                    IntrinsicName.match(/^([^\s]+)/g)[0]),

        toConcreteTypedArrays =
            ({ descriptorKeyPath: [first, ...restDescriptorKeyPath], ...rest }) =>
                ConcreteTypedArraySubclasses.map(key => given((
                    descriptorKeyPath =
                        [({ ...first, key }), ...restDescriptorKeyPath]) =>
                ({
                    WKID: toWellKnownID("ES2022", descriptorKeyPath),
                    descriptorKeyPath,
                    ...rest
                }))),

        WellKnownIntrinsicsRegExp = new RegExp(`^(?:[gs]et\\s+)?(?:${
            TopLevelWellKnownIntrinsicObjects
                .flatMap(({ IntrinsicName }) =>
                    [IntrinsicName, deintrinsify(IntrinsicName)])
                .join("|")})(\\.[^\\s]+|\\s*\\[[^\\]]+\\])*(\\s*\\(|$)`)) =>

        TopLevelWellKnownIntrinsicObjects
            .flatMap(WKIO => XPath.queryAll
                `${toSectionIDXPathQuery(WKIO.IntrinsicName)}` (document))
            .filter(clause => !ExcludedTypes.has(clause.getAttribute("type")))
            .map(clause => XPath.querySingle `./h1` (clause).textContent)
            .filter(contents => WellKnownIntrinsicsRegExp.test(contents) ? true : console.log("NO :", contents))
            .map(signature => (console.log("YES: ", signature), signature))
            .map(signature => parseSignature(scope, signature))
            .flatMap(WKIO =>
                WKIO.descriptorKeyPath[0].key === "%TypedArray%" ?
                    [WKIO, ...toConcreteTypedArrays(WKIO)] :
                    [WKIO])
            .filter(WKIO =>
                !WKIO.failed ||
                warn(`Failure ${WKIO.signature}: ${WKIO.normalized} ${WKIO.errors[0].message}`))));


