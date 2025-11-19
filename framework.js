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

  function jsx(params) {

  }
  function createElement(params) {

  }
  function rander(params) {

  }


})()

