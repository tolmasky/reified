import { ƒCall, ƒCopy } from "./utilities.mjs";
import { IsObject, IsString, IsSymbol } from "./types-and-values.mjs";

const given = f => f();


// 7.2.2 IsArray ( argument )
// https://tc39.es/ecma262/#sec-isarray
//
// Direct call from:
// 23.1.2.2 Array.isArray ( arg )
// https://tc39.es/ecma262/#sec-isarray

export const IsArray = ƒCopy(Array.isArray);


// 7.2.3 IsCallable ( argument )
// https://tc39.es/ecma262/#sec-iscallable

export const IsCallable = argument => typeof argument === "function";


// 7.2.4 IsConstructor ( argument )
// https://tc39.es/ecma262/#sec-isconstructor

export const IsConstructor = given((
    SymbolSpecies = Symbol.species,
    PromisePrototypeFinally = Promise.prototype.finally) =>
    function IsConstructor (argument)
    {
        if (!IsObject(argument))
            return false;

        try
        {
            ƒCall(
                PromisePrototypeFinally,
                { constructor: { [SymbolSpecies]: argument }, then() { } });
        }
        catch (error)
        {
            return false;
        }
    
        return true;
    });

// 7.2.6 IsIntegralNumber ( argument )
// https://tc39.es/ecma262/#sec-isintegralnumber
//
// Direct call from:
// 21.1.2.3 Number.isInteger ( number )
// https://tc39.es/ecma262/#sec-number.isinteger

export const IsIntegralNumber = ƒCopy(Number.isInteger);

// 7.2.7 IsPropertyKey ( argument )
// https://tc39.es/ecma262/#sec-ispropertykey

export const IsPropertyKey = argument =>
    IsString(argument) ||
    IsSymbol(argument);
