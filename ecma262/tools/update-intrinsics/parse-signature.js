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

const toFormalParameters = (restElements, sequenceElements, parameters) =>
    parameters.map(({ name }) => given((
        identifierName = name.replace(/^_|_$/g, ""),
        isRestElement = restElements.has(name),
        isSequenceElement = sequenceElements.has(name),
        bindingIdentifier = BindingIdentifier([identifierName])) =>
            isRestElement ?
                BindingRestElement([bindingIdentifier]) :
            isSequenceElement ?
                BindingSequenceElement([identifierName]) :
                bindingIdentifier));

const matchAll = (string, regexp) => [...string.matchAll(regexp)];
const toFunctionAttributes = given((
    RestElementRegExp = /\.\.\.(_[^_]+_)/g,
    SequenceElementRegExp =
        /_([a-zA-Z])\d+_(\s*,\s*_\1\d+_)*\s*,\s*…\s*,\s*_\1n_/g) =>
        signature => given((
            restElements = new Set(
                matchAll(signature, RestElementRegExp)
                    .map(([, name]) => name)),
            sequenceElements = new Set(
                matchAll(signature, SequenceElementRegExp)
                    .map(([, name]) => name)),
            normalized = toUnbracketedSignature(signature
                .replace(RestElementRegExp, (_, name) => name)
                .replace(SequenceElementRegExp, (_, name) => `_${name}_`)),
            parsed = parseH1(normalized)) =>
({
    ... (parsed.type === "failure" &&
        ({ failed: true, signature, normalized, errors: parsed.errors })),

    ["[[FormalParameters]]"]: parsed.type !== "failure" &&
    {
        required: toFormalParameters(restElements, sequenceElements, parsed.params),
        optional: toFormalParameters(restElements, sequenceElements, parsed.optionalParams)
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
