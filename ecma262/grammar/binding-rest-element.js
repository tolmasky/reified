module.exports = function BindingRestElement(children)
{
    if (!(this instanceof BindingRestElement))
        return new BindingRestElement(children);

    this.children = children;
}
