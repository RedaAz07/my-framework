const framework = (function () {
let oldVDOM = null; // store the previous virtual DOM
const root = document.getElementById("root");

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

  function updateElement(parent, newNode, oldNode, index = 0) {
    // If oldNode doesn't exist, create new DOM
    if (!oldNode) {
          console.log("Created new element:");

      parent.appendChild(createElement(newNode));
      return;
    }

    // If newNode doesn't exist, remove old DOM
    if (!newNode) {
          console.log("Created new element 1111111:");

      parent.removeChild(parent.childNodes[index]);
      return;
    }

    // If types differ, replace
    if (newNode.type !== oldNode.type || typeof newNode !== typeof oldNode) {
          console.log("Created new element 222222:");

      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
      return;
    }

    // If text node, update textContent
    if (typeof newNode === "string" || typeof newNode === "number") {
      if (newNode !== oldNode) {
          console.log("Created new element 444444:");

        parent.childNodes[index].textContent = newNode;
      }
      return;
    }

    // Update attributes
    const el = parent.childNodes[index];

    // Remove old attributes not in newNode
    for (const key in oldNode.props) {
      if (!(key in newNode.props)) {
        if (key.startsWith("on")) {
          el.removeEventListener(key.slice(2).toLowerCase(), oldNode.props[key]);
        } else {
          el.removeAttribute(key);
        }
      }
    }

    // Set new/changed attributes
    for (const key in newNode.props) {
      const value = newNode.props[key];
      if (key.startsWith("on")) {
        // For simplicity, remove old and add new
        if (oldNode.props[key] !== value) {
          if (oldNode.props[key]) {
            el.removeEventListener(key.slice(2).toLowerCase(), oldNode.props[key]);
          }
          el.addEventListener(key.slice(2).toLowerCase(), value);
        }
      } else if (key === "className") {
          console.log("Created new element 888888888:");
        
        el.className = value;
      } else if (key === "id") {
        el.id = value;
      } else {
        el.setAttribute(key, value);
      }
    }

    // Diff children
    const maxLen = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < maxLen; i++) {
      updateElement(el, newNode.children[i], oldNode.children[i], i);
    }
  }


  function render() {
    pendingEffects.forEach(fn => fn());
    pendingEffects = [];

    effectsIndex = 0;
    callIndex = 0;

    const newVDOM = App(); // new virtual DOM
    updateElement(root, newVDOM, oldVDOM); // diff & patch
    oldVDOM = newVDOM; // save for next render
  }


  return { useState, useEffect, jsx, createElement, render };

})();

const { useState, useEffect, jsx, createElement, render } = framework;
