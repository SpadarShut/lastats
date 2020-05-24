import React from "react"

export default createContextWithUpdater;

function createContextWithUpdater(...props) {
  const [
    defaultValue = {},
    updater = (newState, oldState) => ({
      ...oldState,
      ...newState,
    })
  ] = props;

  const context = React.createContext(defaultValue);

  const ContextProvider = (props = {}) => {
    const initialState = props.value !== undefined ? props.value : defaultValue
    const [state, setState] = React.useState(initialState)

    // The context value:
    const value = React.useMemo(() => ([
      state,
      newState => {
        console.log(newState)
        setState(oldState => updater(newState, oldState))
      }
    ]), [state, setState])

    return (
      <context.Provider
        {...props}
        value={value}
      />
    )
  }

  const useContextHook = (key) => {
    const contextVal = React.useContext(context)
    if (key !== undefined) {
      const [state, setState] = contextVal;

      const oldVal = state[key]
      return [
        oldVal,
        (newVal) => {
          setState({
            [key]: typeof newVal === 'function' ? newVal(oldVal) : newVal
          })
        }
      ]
    }
    return contextVal;
  }

  return [ContextProvider, useContextHook, context]
}

