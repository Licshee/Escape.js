"use strict";
!function(self){
  var objDefProp = Object.defineProperty;

  function hardenMember(o, name, value){
    if(arguments.length < 3)
      value = o[name];
    objDefProp(o, name, { value: value, writable: false });
  }
  if(typeof objDefProp !== "function"){
    objDefProp = function(o, n, d){
      o[n] = d.value;
    };
  }

  hardenMember(self, "hardenMember", hardenMember);

  var funcProto = Function.prototype;
  //hardenMember(Function, funcProto);
  hardenMember(funcProto, "call");
  hardenMember(funcProto, "apply");
}(this);
