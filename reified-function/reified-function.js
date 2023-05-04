const given = f => f();

const { I, GetMethod, HasMethod } = require("@reified/ecma-262");

const fail = require("@reified/core/fail");
const { α, ø } = require("@reified/object");
const SymbolEnum = require("@reified/core/symbol-enum");
const Declaration = require("@reified/core/declaration");
const { copy } = require("@reified/delta/copy-value");

const toBindings = require("./to-bindings");

const Δ = require("@reified/delta");

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

const ƒ = Declaration `ƒ` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunctionObject(first) ? { [ƒSymbols.target]: first } : first,
    bindingsSource = { [ƒSymbols["[[Bindings]]"]]: new Map() },
    f = I `Object.setPrototypeOf` (ƒnamed(name, function (...args)
    {
        return ReifiedCallEvaluateBody(f, this, ...args);
    }), ƒ.prototype)) => α(f, bindingsSource, firstSource, ...rest)),
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

    curry: (f, shorthand, rest) => Δ.update(
        ƒSymbols["[[Bindings]]"],
        bindings => given((
            Δbindings = toBindings(GetMethod(f, ƒ.target), shorthand, rest)) => bindings ?
                Δ.assignEntriesFrom(Δbindings)(bindings) :
                Δbindings))(f instanceof ƒ ? f : ƒ(f)),

    prototype:
    {
        // FIXME: Should this just be handled in CopyValue?...
        [copy]: function (target) { return ƒ(target.name, () => {}, target); },

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
