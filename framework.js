const framework = (function name() {

  let callIndex = -1
  const stateValues = []
  function useState(initialValue) {
    callIndex++
    const currentIndex = Number(callIndex)

    if (stateValues[currentIndex] === undefined) {
      stateValues[currentIndex] = initialValue

    }
    function setValue(newValue) {
      stateValues[currentIndex] = newValue
      rander()
    }
    return [stateValues[currentIndex], setValue]
  }
  let effects = []
  let effectsIndex = 0
  let pendingEffects = []

  function useEffect(callback, deps) {
    const oldDeps = effects[effectsIndex]
    let hasChanged = true

    if (oldDeps) {
      hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]))
    }

    if (hasChanged) {
      pendingEffects.push(callback)
    }

    effects[effectsIndex] = deps
    effectsIndex++
  }

  function jsx(tags, props, ...child) {
    if (typeof tags == "function") {
      return { ...props, child }
    }

    return { tags, props: props || {}, ...child }

  }
  function createElement(node) {
    if (typeof node == "string" || typeof node == "number") {
      document.createTextNode(String(node))
    }
    const el = document.createElement(node.tags)


    for ([type, value] of Object.entries(node.props)) {
      if (type.startsWith("on") && typeof value === "function") {
        el.addEventListener(type.slice(2).toLowerCase, value)

      } else if (type === "className") {
        el.clasName = value
      } else if (type === "id") {
        el.id = value
      } else {
        el.setAttribute(type, value)
      }
    }



    for (let child of node.child.flat()) {
      if (typeof child == "string" || typeof child == "number") {
        el.appendChild(document.createTextNode(String(child)))
      }
      el.appendChild(document.createElement(child))

    }
    return el
  }



  function rander() {
    pendingEffects.forEach((v) => v)
    effectsIndex = 0
    callIndex = -1

    const root = document.getElementById("root")
    root.innerHTML = ""
    const app = App()

    root.appendChild(createElement(app))


  }


})()

