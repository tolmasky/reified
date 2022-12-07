const given = f => f();

const BindingIdentifier = require("../../grammar/binding-identifier");
const BindingRestElement = require("../../grammar/binding-rest-element");
const BindingSequenceElement = require("../../grammar/binding-sequence-element");

const { parseH1 } = require("ecmarkup/lib/header-parser");


const GetterRegExp = /^get\s+/;
const SetterRegExp = /^set\s+/;
const ParametersRegExp = /\s*\(.+$/;

const toUnbracketedSignature = given((
    BracketedRegExp = /(^[^\(\s]+)\s*\[\s*([^\]\s]+)\s*\]/g) =>
    signature => signature.replace(BracketedRegExp,
        (_, prefix, bracketed) => `${prefix}.${bracketed}`));

const toClassifier = (pairs, fallback) => given((
    withFallback = [...pairs, [fallback]]) =>
    signature =>
        withFallback.find(([type, regexp]) =>
            !regexp || regexp.test(signature))[0]);

const toType = toClassifier
([
    ["function", GetterRegExp],
    ["function", SetterRegExp],
    ["function", ParametersRegExp]
], "object");

const toFullyQualifiedKeyPath = given((
    toDescriptorKind = toClassifier
    ([
        ["[[Get]]", GetterRegExp],
        ["[[Set]]", SetterRegExp]
    ], "[[Value]]")) =>
        signature => given((
        lastDescriptorKind = toDescriptorKind(signature),
        normalized = toUnbracketedSignature(signature
            .replace(GetterRegExp, "")
            .replace(SetterRegExp, "")
            .replace(ParametersRegExp, "")),
        components = normalized.split("."),
        last = components.length - 1) =>
        [
            lastDescriptorKind,
            components.map((key, index) =>
                index === last && lastDescriptorKind !== "[[Value]]" ?
                    [key, lastDescriptorKind] :
                    key)
        ]));

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
                .replace(GetterRegExp, "")
                .replace(SetterRegExp, "")
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
    type = toType(signature),
    [DK, fullyQualifiedKeyPath] = toFullyQualifiedKeyPath(signature)) =>
({
    type,
    fullyQualifiedName: JSON.stringify(fullyQualifiedKeyPath),
    fullyQualifiedKeyPath,
    ...(type === "function" && DK === "[[Value]]" && toFunctionAttributes(signature))
}));

module.exports = parseSignature;
