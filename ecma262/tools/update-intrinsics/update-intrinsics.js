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

const NotDirectlyAccessibleIntrinsicObjects = new Set(["ForInIteratorPrototype"]);

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
                    ...rest,
                    WKID: toWellKnownID("ES2022", descriptorKeyPath),
                    descriptorKeyPath
                }))),

        WellKnownIntrinsicsRegExp = new RegExp(`^(?:[gs]et\\s+)?(?:${
            TopLevelWellKnownIntrinsicObjects
                .filter(({ IntrinsicName }) =>
                    !NotDirectlyAccessibleIntrinsicObjects.has(deintrinsify(IntrinsicName)))
                .flatMap(({ IntrinsicName }) =>
                    [IntrinsicName, deintrinsify(IntrinsicName)])
                .join("|")})(\\.[^\\s]+|\\s*\\[[^\\]]+\\])*(\\s*\\(|$)`),

        PropertyReferenceToExistingIntrinsicRegExp =
            /property is %[^%]+%(, defined in )?\.$/,

        ConstructorReferenceToExistingIntrinsicRegExp =
            /^The initial value of (`([A-Za-z]+)|%([A-Za-z]+)%`).prototype.constructor` is %[^%]+%.?$/

        ) =>

        TopLevelWellKnownIntrinsicObjects
            .flatMap(WKIO => XPath.queryAll
                `${toSectionIDXPathQuery(WKIO.IntrinsicName)}` (document))
            .filter(clause => !ExcludedTypes.has(clause.getAttribute("type")))
            .map(clause => ["./h1", "./p"]
                .map(query => XPath.querySingle `${query}` (clause))
                .map(result => result ? result.textContent : ""))
            .filter(([signature, description]) =>
                WellKnownIntrinsicsRegExp.test(signature) &&
                !PropertyReferenceToExistingIntrinsicRegExp.test(description) &&
                !ConstructorReferenceToExistingIntrinsicRegExp.test(description)
                 ? (console.log("YES: ", signature), true) : console.log("NO :", signature))
//            .map(([signature]) => (console.log("YES: ", signature), [signature]))
            .map(([signature, description]) => parseSignature(scope, signature, description))
            .flatMap(WKIO =>
                WKIO.WKID === `${scope}.%TypedArray%` ?
                    [WKIO, ...toConcreteTypedArrays(WKIO)] :
                    [WKIO])
            .filter(WKIO =>
                !WKIO.failed ||
                warn(`Failure ${WKIO.signature}: ${WKIO.normalized} ${WKIO.errors[0].message}`))));


