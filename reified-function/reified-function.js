const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const { α, ø } = require("@reified/object");
const SymbolEnum = require("@reified/foundation/symbol-enum");
const Declaration = require("@reified/foundation/declaration");
const { copy } = require("@reified/delta/copy-value");
const { GetMethod, HasMethod } = require("@reified/foundation/operations-on-objects");

const Δ = require("@reified/delta");

const
{
    ƒnamed,
    IsFunctionObject,
    IsTaggedCall,
    IsTagCoercibleCall,
    ToResolvedString
} = require("@reified/foundation/function-objects");

const ReifiedCallEvaluateBody = (f, thisArgument, ...args) =>

    IsTaggedCall(args) && HasMethod(f, ƒSymbols.tag) ?
        GetMethod(f, ƒSymbols.tag)(f, thisArgument, ToResolvedString(args)) :

    HasMethod(f, ƒSymbols.apply) ?
        GetMethod(f, ƒSymbols.apply)(f, thisArgument, args) :

    HasMethod(f, ƒSymbols.target) ?
        I.Call(GetMethod(f, ƒSymbols.target), thisArgument, ...args) :

    // FIXME: How should we handle this when we have TagObject,
    // and should we make it an option whether this should be coercible?
    HasMethod(f, ƒSymbols.tag) && IsTagCoercibleCall(args)?
        GetMethod(f, ƒSymbols.tag)(ƒ, thisArgument, args[0]) :

        fail.type(`${f.name} can't respond to this kind of call.`);

const ƒSymbols = SymbolEnum(
    "apply",
    "tag",
    "target",
    "[[SourceText]]");

const ToSourceText = f => I `.Function.prototype.toString` (f);

const ƒ = Declaration `ƒ` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunctionObject(first) ? { [ƒSymbols.target]: first } : first,
    f = I `Object.setPrototypeOf` (ƒnamed(name, function (...args)
    {
        return ReifiedCallEvaluateBody(f, this, ...args);
    }), ƒ.prototype)) => α(f, firstSource, ...rest)));

α(ƒ.prototype,
{
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
});

// Should we make this taggedCoercible?
// Or "stringTaggable"?
const tagged = Declaration `ƒ.tagged`
    (({ name, tail: [ƒtag, ...rest] }) =>
        ƒ (name, { [ƒ.tag]: ƒtag }, ...rest));

const curry = (f, Δa) => Δ(f, Δ.update(ƒ.bindings, Δa))

module.exports = α(ƒ, { ƒ, tagged }, ƒSymbols);
