// 10.2 ECMAScript Function Objects
// https://tc39.es/ecma262/#sec-ecmascript-function-objects

import { given } from "./utilities.mjs";


// 10.2.3 OrdinaryFunctionCreate ( functionPrototype, sourceText, ParameterList, Body, thisMode, env, privateEnv )
// https://tc39.es/ecma262/#sec-ecmascript-function-objects
//
// FIXME: Should we modify toString to return SourceText somehow?
export const OrdinaryFunctionCreate = given((
    ObjectSetPrototypeOf = Object.setPrototypeOf) =>
        (functionPrototype, sourceText, ParameterList, Body) =>
            ObjectSetPrototypeOf (function F(...args)
            {
                return Body (F, this, args);
            }, functionPrototype));
