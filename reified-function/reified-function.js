const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const { α, ø, mapEntries } = require("@reified/object");
const SymbolEnum = require("@reified/object/symbol-enum");
const Declaration = require("@reified/language/declaration");

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

function ReifiedCallEvaluateBody(ƒ, thisArgument, ...arguments)
{
    const tagged = ƒ[ƒSymbols.tagged];

    return IsTaggedCall(arguments) && tagged ?
        I.Call(tagged, thisArgument, ToResolvedString(arguments), ƒ) :
        I.Call(ƒ[ƒSymbols.called], thisArgument, ...arguments);
}

const ƒSymbols = SymbolEnum("called", "tagged", "[[ThisMode]]", "[[SourceText]]");

const IsFunction = value => typeof value === "function";
const ToSourceText = f => I `.Function.prototype.toString` (f);

const ƒ = Declaration `ƒ` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunction(first) ? { [ƒSymbols.called]: first } : first,
    body = ø(firstSource, ...rest),
    ƒCalled = body[ƒSymbols.called],
    kind = GetFunctionKind(ƒCalled),
    ƒGenerator = GetƒGeneratorForFunctionKind(kind)) =>
    α(ƒGenerator(ReifiedCallEvaluateBody),
    {
        name,
        toString()
        {
            return this[ƒSymbols["[[SourceText]]"]];
        },
        [ƒSymbols["[[ThisMode]]"]]: GetApproximateThisMode(ƒCalled),
        [ƒSymbols["[[SourceText]]"]]: ToSourceText(ƒCalled)
    }, body)));

module.exports = α(ƒ, { ƒ }, ƒSymbols);
