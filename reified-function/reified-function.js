const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const { α, ø, mapEntries } = require("@reified/object");
const SymbolEnum = require("@reified/foundation/symbol-enum");
const Declaration = require("@reified/foundation/declaration");
const { copy } = require("@reified/delta/copy-value");

const Δ = require("@reified/delta");

const
{
    GetApproximateThisMode,
    IsFunctionObject,
    IsTaggedCall,
    IsTagCoercibleCall,
    ToResolvedString
} = require("@reified/foundation/function-objects");

const
{
    FunctionKinds,
    FunctionKindGenerator,
    FunctionKindAsync,
    GetFunctionKind
} = require("./function-kind");

const GetƒGeneratorForFunctionKind = given((
    toConditionalCode = C => C ? ([S]) => S : () => false,
    toGA = kind =>
    ({
        G: toConditionalCode(kind & FunctionKindGenerator),
        A: toConditionalCode(kind & FunctionKindAsync)
    }),
    ƒGeneratorTemplate = ({ G, A }) => I `@reified/array-chain` (
    [
         `return ((F =`, A `async`, `function`, G `*`, `(...args)`,
         `{ return`, G `yield *`, A `await`,
         `R(F, this, ...args); }) => F)()`
    ], { filter: string => !!string }, { join: " " }),
    toƒGenerator = kind =>
        I `Function` ("R", `${ƒGeneratorTemplate(toGA(kind))}`),
    ƒGenerators = mapEntries(FunctionKinds,
        ([_, kind]) => [kind, toƒGenerator(kind)])) =>
    kind => ƒGenerators[kind]);

const ReifiedCallEvaluateBody = (ƒ, thisArgument, ...args) =>

    IsTaggedCall(args) && ƒ[ƒSymbols.tag] ?
        ƒ[ƒSymbols.tag](ƒ, thisArgument, ToResolvedString(args)) :

    ƒ[ƒSymbols.apply] ?
        ƒ[ƒSymbols.apply](ƒ, thisArgument, args) :

    ƒ[ƒSymbols.target] ?
        I.Call(ƒ[ƒSymbols.target], thisArgument, ...args) :

    // FIXME: How should we handle this when we have TagObject,
    // and should we make it an option whether this should be coercible?
    ƒ[ƒSymbols.tag] && IsTagCoercibleCall(args)?
        ƒ[ƒSymbols.tag](ƒ, thisArgument, args[0]) :

        fail.type(`${ƒ.name} can't respond to this kind of call.`);

const ƒSymbols = SymbolEnum(
    "apply",
    "tag",
    "target",
    "[[ThisMode]]",
    "[[SourceText]]");

const ToSourceText = f => I `.Function.prototype.toString` (f);

const ƒ = Declaration `ƒ` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunctionObject(first) ? { [ƒSymbols.target]: first } : first,
    body = ø(firstSource, ...rest),
    ƒBasis =
        body[ƒSymbols.target] ||
        body[ƒSymbols.apply] ||
        body[ƒSymbols.tag],
    kind = GetFunctionKind(ƒBasis),
    ƒGenerator = GetƒGeneratorForFunctionKind(kind)) =>
    α(ƒGenerator(ReifiedCallEvaluateBody),
    {
        name,
        toString()
        {
            return this[ƒSymbols["[[SourceText]]"]];
        },
        [copy]: function (target) { return ƒ(target.name, () => {}, target); },
        [ƒSymbols["[[ThisMode]]"]]: GetApproximateThisMode(ƒBasis),
        [ƒSymbols["[[SourceText]]"]]: ToSourceText(ƒBasis)
    }, body)));

// Should we make this taggedCoercible?
// Or "stringTaggable"?
const tagged = Declaration `ƒ.tagged`
    (({ name, tail: [ƒtag, ...rest] }) =>
        ƒ (name, { [ƒ.tag]: ƒtag }, ...rest));

const curry = (f, Δa) => Δ(f, Δ.update(ƒ.bindings, Δa))

module.exports = α(ƒ, { ƒ, tagged }, ƒSymbols);
