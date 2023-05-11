const given = f => f();

const fail = require("@reified/core/fail");

const Declaration = require("./declaration");
const { Rudimentary, extending, any, string } = require("./rudimentary");

const GetTypeName = T => T.name

const FieldValueDefinition = Rudimentary `FieldValueDefinition` ({ });

FieldValueDefinition.Variable = Rudimentary `FieldValueDefinition.Variable`
({
    [extending]: FieldValueDefinition,
    default: any
});

FieldValueDefinition.Constant = T =>
    Rudimentary `FieldValueDefinition.Constant<${GetTypeName(T)}>`
    ({
        [extending]: FieldValueDefinition,
        value: T
    });

FieldValueDefinition.Computed = Rudimentary `FieldValueDefinition.Computed`
({
    [extending]: FieldValueDefinition,
    compute: Function
});

exports.FieldValueDefinition = FieldValueDefinition;


const FieldDefinition = Rudimentary `FieldDefinition`
({
    binding: string,
    type: any,
    value: FieldValueDefinition
});

exports.FieldDefinition = FieldDefinition;
