const given = f => f();

const { I, GetMethod, HasMethod } = require("@reified/ecma-262");

const fail = require("@reified/core/fail");
const { α, ø } = require("@reified/object");
const SymbolEnum = require("@reified/core/symbol-enum");
const Declaration = require("@reified/core/declaration");
const { copy } = require("@reified/delta/copy-value");

const toBindings = require("./to-bindings");

const Δ = require("@reified/delta");
const update = require("@reified/delta/update");
const Mutation = require("@reified/delta/mutation");

const
{
    ƒnamed,
    IsFunctionObject,
    IsTaggedCall,
    IsTagCoercibleCall,
    ToResolvedString
} = require("@reified/core/function-objects");

const toBoundArguments = (f, argumentsList) => given((
    bindings = f[ƒSymbols["[[Bindings]]"]]) =>
        bindings.size <= 0 ? argumentsList :
        Δ(bindings, Δ.reduce(
            (argumentsList, update) =>
                false ? //update.effectiveKeyPath.hasOwn(argumentsList) ?
                    argumentsList :
                    update(argumentsList),
            argumentsList)));


const ReifiedCallEvaluateBody = (f, thisArgument, ...args) =>

    IsTaggedCall(args) && HasMethod(f, ƒSymbols.tag) ?
        GetMethod(f, ƒSymbols.tag)(f, thisArgument, ToResolvedString(args)) :

    HasMethod(f, ƒSymbols.apply) ?
        GetMethod(f, ƒSymbols.apply)(f, thisArgument, toBoundArguments(f, args)) :

    HasMethod(f, ƒSymbols.target) ?
        I.Call(GetMethod(f, ƒSymbols.target), thisArgument, ...toBoundArguments(f, args)) :

    // FIXME: How should we handle this when we have TagObject,
    // and should we make it an option whether this should be coercible?
    HasMethod(f, ƒSymbols.tag) && IsTagCoercibleCall(args)?
        GetMethod(f, ƒSymbols.tag)(ƒ, thisArgument, args[0]) :

        fail.type(`${f.name} can't respond to this kind of call.`);

const ƒSymbols = SymbolEnum(
    "apply",
    "tag",
    "target",
    "[[SourceText]]",
    "[[Bindings]]");

const ToSourceText = f => I `.Function.prototype.toString` (f);

// Should we setPrototypeOf parent?
// And we need to handle the ƒ(f) case...
const ƒ = Declaration `ƒ` (({ name, tail }) =>
    !name && tail.length === 1 && tail[0] instanceof ƒ ? tail[0] : given((
    [first, ...rest] = tail,
    target = IsFunctionObject(first) && first,
    firstSource = target ? { [ƒSymbols.target]: target, ...target } : first,
    bindingsSource = { [ƒSymbols["[[Bindings]]"]]: new Map() },
    f = I `Object.setPrototypeOf` (ƒnamed(name, function (...args)
    {
        return ReifiedCallEvaluateBody(f, this, ...args);
    }), target ? I `Object.getPrototypeOf` (target) : Function)) =>
        α(f, bindingsSource, firstSource, ...rest, ƒ.prototype /* ugh */)),
{
    ...ƒSymbols,

    method: Declaration `ƒ.method`
        (({ name, tail: [method, ...rest] }) =>
            ƒ (name, { [ƒ.apply]: method }, ...rest)),

    // Should we make this taggedCoercible?
    // Or "stringTaggable"?
    tagged: Declaration `ƒ.tagged`
        (({ name, tail: [ƒtag, ...rest] }) =>
            ƒ (name, { [ƒ.tag]: ƒtag }, ...rest)),

    curry: (f, shorthand, rest) => given((
        ƒf = ƒ(f),
        target = GetMethod(ƒf, ƒSymbols["target"]),
        Δbindings = toBindings(target, shorthand, rest)) =>
            update(ƒf, ƒSymbols["[[Bindings]]"], Mutation.Update(bindings =>
                bindings ?
                    Δ.assignEntriesFrom(Δbindings)(bindings) :
                    Δbindings))),

    prototype:
    {
        // FIXME: Should this just be handled in CopyValue?...
        [copy]: function (target)
        {
            return I `Object.setPrototypeOf` (
                ƒ(target.name, () => {}, target),
                I `Object.getPrototypeOf` (target));
        },

        toString()
        {
            return this[ƒSymbols["[[SourceText]]"]];
        },

        get [ƒSymbols["[[SourceText]]"]]()
        {
            return ToSourceText(
                GetMethod(this, ƒSymbols.target) ||
                GetMethod(this, ƒSymbols.apply) ||
                GetMethod(this, ƒSymbols.tag));
        }
    }
});

module.exports = α(ƒ, { ƒ });
