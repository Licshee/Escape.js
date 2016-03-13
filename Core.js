"use strict";
!function(self){
  var objDefProp = Object.defineProperty;

  function hardenMember(o, name, value){
    if(arguments.length < 3)
      value = o[name];
    objDefProp(o, name, { value: value, writable: false });
  }

  try{
    objDefProp({}, '', {});
  }catch(ex){
    objDefProp = function(o, n, d){
      o[n] = d.value;
    };
  }

  hardenMember(self, "hardenMember");

  var funcProto = Function.prototype;
  //hardenMember(Function, funcProto);
  hardenMember(funcProto, "call");
  hardenMember(funcProto, "apply");

  var objProto = Object.prototype;
  var objToString = objProto.toString;

  var isInteger = Number.isInteger;

  function isArray(o){
    return (o instanceof Array) || (objToString.apply(o) === "[object Array]");
  }

  function isString(s){
    return typeof s === "string" || (s instanceof String) || (objToString.apply(s) === "[object String]");
  }

  function isArrayLike(o){
    var len = o.length;
    return !(isString(o) || len !== ~~len || len < 0);
  }

  hardenMember(self, "isArray", isArray);
  hardenMember(self, "isArrayLike", isArrayLike);
  hardenMember(self, "isInteger", isInteger);
  hardenMember(self, "isString", isString);

  var escapeMap = {
    '\n': "\\n",
    '\r': "\\r",
    // the two below are not listed in most documents, but major implementations require we do this
    '\u2028': "\\u2028",
    '\u2029': "\\u2029",
    '\x00': "\\x00", // not necessary in most implementations, but just in case
    "\r\n": "\\r\\n"
  };
  function escapeMatchedChar(m, p, h){
    return escapeMap[m] || ('\\' + m);
  }

  var escapeStringPattern = /\r\n|[\x00\n\r"\\'\u2028\u2029]/g;
  function escapeString(s, indent){
    if(indent === void 0)
      return s.replace(escapeStringPattern, escapeMatchedChar);

    var localMap = {
      '\n': "\\n",
      '\r': "\\r",
      "\r\n": "\\r\\n"
    };
    function esc(m, p, h){
      return localMap[m] || ('\\' + m);
    }

    if(indent === null){
      for(var k in localMap)
        localMap[k] += '\\' + k;
    }else if(isString(indent) && /^\s*$/.test(indent)){
      for(var k in localMap)
        localMap[k] += "\" +" + k + indent + '"';
    }else
      throw "invalid indent";

    for(var key in escapeMap){
      if(key in localMap) continue;
      localMap[key] = escapeMap[key];
    }

    return s.replace(escapeStringPattern, esc);
  }

  //                                $ ()*+ -./ ? [\]^ {|}
  var escapeRegExpPattern = /[\x00\n\r$(-+\-.\/?[-^{|}\u2028\u2029]/g
  function escapeRegExp(s){
    return s.replace(escapeRegExpPattern, escapeMatchedChar);
  }

  hardenMember(self, "escapeString", escapeString);
  hardenMember(self, "escapeRegExp", escapeRegExp);
}(this);