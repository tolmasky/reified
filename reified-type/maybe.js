const given = f => f();


module.exports = ({ caseof, type }) => given((

    Maybe = type `Maybe` (T => type `Maybe<${T.name}>`
    ({
        [caseof `Just`]: [of => T],
        [caseof `None`]: { },

        fmap: (self, f) => caseof(self,
        {
            [Maybe(T).Just]: value => Maybe(T).Just(f(value)),
            [Maybe(T).None]: () => Maybe(T).None
        }),

        bind: (self, f) => caseof(self,
        {
            [Maybe(T).Just]: value => f(value),
            [Maybe(T).None]: () => Maybe(T).None
        }),

        join: (self, rhs) => caseof(self,
        {
            [Maybe(T).Just]: value => value,
            [Maybe(T).None]: () => Maybe(T).None
        }),

        from: (self, fallback) => caseof(self,
        {
            [Maybe(T).Just]: value => value,
            [Maybe(T).None]: () => fallback
        })
    }))) => Maybe);
