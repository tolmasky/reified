module.exports = function BindingSequenceElement(children)
{
    if (!(this instanceof BindingSequenceElement))
        return new BindingSequenceElement(children);

    this.children = children;
}
