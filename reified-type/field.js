const given = f => f();


module.exports = ({ type, caseof }) => given((
    Key = type `Key`
    ({
        [caseof `String`]: { value  :of => type.string },
        [caseof `Symbol`]: { value  :of => type.symbol }
    })) =>
({
    Key: { value: Key, enumerable: true },
}));
