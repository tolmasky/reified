const given = f => f();

const BindingIdentifier = require("../../grammar/binding-identifier");
const BindingRestElement = require("../../grammar/binding-rest-element");
const BindingSequenceElement = require("../../grammar/binding-sequence-element");

const { parseH1 } = require("ecmarkup/lib/header-parser");


const GetterRegExp = /^get\s+/g;
const SetterRegExp = /^set\s+/g;
const ParametersRegExp = /\s*\(.+$/g;

const classify = given((
    pairs =
    [
        ["getter", GetterRegExp],
        ["setter", SetterRegExp],
        ["function", ParametersRegExp],
        ["object"]
    ]) =>
    signature =>
        pairs.find(([type, regexp]) => !regexp || regexp.test(signature))[0]);

const toUnbracketedSignature = given((
    BracketedRegExp = /(^[^\(\s]+)\s*\[\s*([^\]\s]+)\s*\]/g) =>
    signature => signature.replace(BracketedRegExp,
        (_, prefix, bracketed) => `${prefix}.${bracketed}`));

const toFullyQualifiedName = signature =>
    toUnbracketedSignature(signature
        .replace(GetterRegExp, "")
        .replace(SetterRegExp, "")
        .replace(ParametersRegExp, ""));

const toFormalParameters = (restElements, parameters) =>
    parameters.map(({ name }) => given((
        identifierName = name.replace(/^_|_$/g, ""),
        isRestElement = restElements.has(name),
        bindingIdentifier = BindingIdentifier([identifierName])) =>
            isRestElement ?
                BindingRestElement([bindingIdentifier]) :
                bindingIdentifier));

const matchAll = (string, regexp) => [...string.matchAll(regexp)];
const toFunctionAttributes = given((
    RestElementRegExp = /\.\.\.(_[^_]+_)/g) =>
        signature => given((
            restElements = new Set(
                matchAll(signature, RestElementRegExp)
                    .map(([, name]) => name)),
            unrested = signature.replace(RestElementRegExp, (_, name) => name),
            parsed = parseH1(toUnbracketedSignature(unrested))) =>
({
    ... (parsed.type === "failure" &&
        ({ failed: true, signature, unrested, errors: parsed.errors })),

    ["[[FormalParameters]]"]: parsed.type !== "failure" &&
    {
        required: toFormalParameters(restElements, parsed.params),
        optional: toFormalParameters(restElements, parsed.optionalParams)
    }
})));

const parseSignature = signature => given((
    type = classify(signature),
    fullyQualifiedName = toFullyQualifiedName(signature)) =>
({
    type,
    fullyQualifiedName,
    fullyQualifiedKeyPath: fullyQualifiedName.split("."),
    ...(type === "function" && toFunctionAttributes(signature))
}));

module.exports = parseSignature;
