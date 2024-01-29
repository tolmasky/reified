const given = f => f();
// const request = async URL => given((
//    response = await fetch(URL, { method: "GET", mode: "no-cors" })) =>
//    ());

const tstat = async URL => given(async (
    toStat = ({ status }) => status === 404 ? false : "file") =>
    toStat(await fetch(URL, { method: "HEAD", mode: "no-cors" })));

const Maybe = function Maybe() { };

Object.assign(Maybe,
{
    Just: value => Object.assign(new Maybe(), { just: value }),
    None: new Maybe()
});

const caseof = (maybe, { Just, None }) =>
    maybe === Maybe.None ?
        None ? None() : Maybe.None :
        Just ? Just(maybe.just) : maybe;

const fetchₘₚ = async URL => given(async (
    toMaybe = response => response.status === 404 ? Maybe.None : Maybe.Just(response)) =>
    toMaybe(await fetch(URL, { method: "GET", mode: "no-cors" })));

function Module(contents)
{console.log(contents);
    if (!(this instanceof Module))
        return new Module(contents);
   
    this.contents = contents;
}

const reduceₚ = async (f, array, start, index = 0, length = array.length) =>
    index === length ? start :
    await reduceₚ(f, array, await f(start, array[index], index), index + 1, length);

const reduceₘₚ = async (f, array, start) =>
    reduceₚ((current, item, index) =>
        caseof(current, { None: () => f(item, index) }),
        array,
        Maybe.None);

const LoadModuleAsFileₘₚ = async (specifier, extensions) =>
    reduceₘₚ(async extension =>
        caseof(await fetchₘₚ(`${specifier}${extension}`),
        {
            Just: async response => Maybe.Just(Module(await response.text()))
        }), extensions);

const LoadModuleₘₚ = async specifier =>
    /^(\.\/|\/|\.\.\/)/.test(specifier) ?
        await LoadModuleAsFileₘₚ(specifier, ["", ".js", ".json"]) :
        "OH NO";

/*
LOAD_AS_FILE(X)
1. If X is a file, load X as its file extension format. STOP
2. If X.js is a file, load X.js as JavaScript text. STOP
3. If X.json is a file, parse X.json to a JavaScript Object. STOP
4. If X.node is a file, load X.node as binary addon. STOP*/

//const require = (URL, module)

(async function ()
{
    console.log(await fetchₘₚ("./test"));
    console.log(Maybe.Just(10));
    console.log(await LoadModuleₘₚ("./test"));
})();


