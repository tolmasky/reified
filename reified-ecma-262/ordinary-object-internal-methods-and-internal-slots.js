// 10.1 Ordinary Object Internal Methods and Internal Slots
// https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots

const { I } = require("./intrinsics");


// 10.1.12 OrdinaryObjectCreate ( proto [ , additionalInternalSlotsList ] )
// https://tc39.es/ecma262/#sec-ordinaryobjectcreate
exports.OrdinaryObjectCreate = proto => I `Object.create` (proto);
