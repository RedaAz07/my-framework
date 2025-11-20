const framework = (function () {

  let callIndex = 0;
  const stateValues = [];

  function useState(initialValue) {
    callIndex++;
    const currentIndex = callIndex;

    if (stateValues[currentIndex] === undefined) {
      stateValues[currentIndex] = initialValue;
    }

    function setValue(newValue) {
      stateValues[currentIndex] = newValue;
      render();
    }

    return [stateValues[currentIndex], setValue];
  }

  let effects = [];
  let effectsIndex = 0;
  let pendingEffects = [];

  function useEffect(callback, deps) {
    const oldDeps = effects[effectsIndex];
    let hasChanged = true;

    if (oldDeps) {
      hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }

    if (hasChanged) {
      pendingEffects.push(callback);
    }

    effects[effectsIndex] = deps;
    effectsIndex++;
  }

  function jsx(type, props, ...children) {
    return { type, props: props || {}, children };
  }

  function createElement(node) {
    if (typeof node === "string" || typeof node === "number") {
      return document.createTextNode(String(node));
    }

    if (typeof node.type === "function") {
      return createElement(node.type({ ...node.props, children: node.children }));
    }

    const el = document.createElement(node.type);

    for (const [key, value] of Object.entries(node.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "className") {
        el.className = value;
      } else if (key === "id") {
        el.id = value;
      } else {
        el.setAttribute(key, value);
      }
    }

    node.children.flat().forEach(child => {
      el.appendChild(createElement(child));
    });

    return el;
  }

  function render() {
    const root = document.getElementById("root");

    pendingEffects.forEach(fn => fn());
    pendingEffects = [];

    effectsIndex = 0;
    callIndex = 0;

    root.innerHTML = "";
    const app = App();
    root.appendChild(createElement(app));
  }

  return { useState, useEffect, jsx, createElement, render };

})();

const { useState, useEffect, jsx, createElement, render } = framework;
