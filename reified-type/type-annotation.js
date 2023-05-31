const given = f => f();

const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");


exports.IsTypeAnnotation = args => IsTaggedCall(args);


exports.TypeAnnotate = (args, T) => given((
    annotation = ToResolvedString(args)) =>
        annotation === "?" ? type.Maybe(T) :
        annotation === "[]" ? type.array(T) :
        annotation === "=" ? value => value :
        annotation === "()=" ? value => value :
        annotation === "const" ? value => value :
        annotation === "const()" ? value => value :
        annotation === "where" ? value => value :
        fail.syntax(`Unrecgonized type annotation: "${annotation}"`));

