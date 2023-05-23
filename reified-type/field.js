const given = f => f();


module.exports = ({ type, caseof }) => given((
    Key = type `Key`
    ({
        [caseof `String`]: [of => type.string],
        [caseof `Symbol`]: [of => type.symbol]
    })) =>
({
    Key: { value: Key, enumerable: true },
}));
