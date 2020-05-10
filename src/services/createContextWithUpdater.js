import React from "react"

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
    const value = React.useMemo(() => ([
      state,
      newState => {
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

  const useContextHook = () => React.useContext(context)

  return [ContextProvider, useContextHook, context]
}

export default createContextWithUpdater;
