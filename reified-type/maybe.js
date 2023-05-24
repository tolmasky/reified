const given = f => f();


module.exports = ({ caseof, type }) => given((

    Maybe = type `Maybe` (T => type `Maybe<${T.name}>`
    ({
        [caseof `Just`]: [of => T],
        [caseof `None`]: { },

        map: (self, f) => caseof(self,
        {
            [Maybe(T).Just]: value => Maybe(T).Just(f(value)),
            [Maybe(T).None]: () => Maybe(T).None
        })
    }))) => Maybe);
