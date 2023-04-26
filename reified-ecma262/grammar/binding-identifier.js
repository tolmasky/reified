module.exports = function BindingIdentifier(children)
{
    if (!(this instanceof BindingIdentifier))
        return new BindingIdentifier(children);

    this.children = children;
}
