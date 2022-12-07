const given = f => f();

const { tagged } = require("ftagged");


const queryAll = tagged `XPath.queryAll` ((query, from) => given((
    document = from.ownerDocument || from,
    { XPathResult: { ANY_TYPE } } = document.defaultView) =>
        toXPathResultArray(document.evaluate(query, from, null, ANY_TYPE, null))));

exports.queryAll = queryAll;

exports.querySingle = tagged `XPath.querySingle` ((query, from) =>
    quaryAll `${query}` (from)[0]);

const toTableRows = (id, from) =>
    queryAll `//*[@id="${id}"]//tr[not(descendant::th)]` (from);
const toTableCells = from => queryAll `.//td` (from);
const toTableCellTextContents = from =>
    toTableCells(from).map(({ textContent }) => textContent.trim());

exports.toTableCellTextContentRows = (id, from) =>
    toTableRows(id, from)
        .map(row => toTableCellTextContents(row));

const toXPathResultArray = result => Array.from(
({
    [Symbol.iterator]: () => ({
        next: () =>
            given((value = result.iterateNext()) =>
                ({ value, done: !value })) })
}));
