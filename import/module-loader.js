const given = f => f();

const require = path => given((
    request = new XMLHttpRequest()) =>
[
    request.open("GET", path, false),
    request.send(null),
    new Function(request.responseText)()
].at(-1));

require("packages/@babel/standalone/babel.js");

// https://mimesniff.spec.whatwg.org/#javascript-mime-type
const JavaScriptMIMETypes = new Set
([
    "application/ecmascript",
    "application/javascript",
    "application/x-ecmascript",
    "application/x-javascript",
    "text/ecmascript",
    "text/javascript",
    "text/javascript1.0",
    "text/javascript1.1",
    "text/javascript1.2",
    "text/javascript1.3",
    "text/javascript1.4",
    "text/javascript1.5",
    "text/jscript",
    "text/livescript",
    "text/x-ecmascript",
    "text/x-javascript"
]);

const BuiltInScriptTypes = new Set
([
    ...JavaScriptMIMETypes,
    "module",
    "importmap",
]);

// FIXME: essentials
const toLowerCase = string => string.toLowerCase();
const hasNonScriptGoal = node =>
    node.tagName === "SCRIPT" &&
    !JavaScriptMIMETypes.has(
        node.hasAttribute("type") ?
            node.getAttribute("type") :
            "text/javascript");

new MutationObserver((list, observer) => list
    .flatMap(({ type, addedNodes }) =>
        type !== "childList" ? [] :
        Array
            .from(addedNodes)
            .filter(hasNonScriptGoal))
    .map(node => (node.parentNode.removeChild(node), console.log(node.textContent, node.src))))
    .observe(document, { childList: true, subtree: true });

console.log("HI");