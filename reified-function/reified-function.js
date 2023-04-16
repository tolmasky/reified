const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const { α, ø, mapEntries } = require("@reified/object");
const SymbolEnum = require("@reified/object/symbol-enum");
const Declaration = require("@reified/language/declaration");

const Δ = require("@reified/delta");

const { GetApproximateThisMode } = require("./reflect");

const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/language/tagged-templates");

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
         `return ((F =`, A `async`, `function`, G `*`, `(...arguments)`,
         `{ return`, G `yield *`, A `await`,
         `R(F, this, ...arguments); }) => F)()`
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
    I.Call(ƒ[ƒSymbols.target], thisArgument, ...args);

const ƒSymbols = SymbolEnum(
    "apply",
    "tag",
    "target",
    "[[ThisMode]]",
    "[[SourceText]]");

const IsFunction = value => typeof value === "function";
const ToSourceText = f => I `.Function.prototype.toString` (f);

const ƒ = Declaration `ƒ` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunction(first) ? { [ƒSymbols.target]: first } : first,
    body = ø(firstSource, ...rest),
    ƒBasis = body[ƒSymbols.target] || body[ƒSymbols.apply],
    kind = GetFunctionKind(ƒBasis),
    ƒGenerator = GetƒGeneratorForFunctionKind(kind)) =>
    α(ƒGenerator(ReifiedCallEvaluateBody),
    {
        name,
        toString()
        {
            return this[ƒSymbols["[[SourceText]]"]];
        },
        [ƒSymbols["[[ThisMode]]"]]: GetApproximateThisMode(ƒBasis),
        [ƒSymbols["[[SourceText]]"]]: ToSourceText(ƒBasis)
    }, body)));

const curry = (f, Δa) => Δ(f, Δ.update(ƒ.bindings, Δa))

module.exports = α(ƒ, { ƒ }, ƒSymbols);
