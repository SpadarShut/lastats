import createContextWithUpdater from '../../utils/createContextWithUpdater'

const [ AppStateContextProvider, useAppState ] = createContextWithUpdater({
  selectedEmissionId: null,
  filters: [
    {
      name: 'notExtinguished',
      enabled: true,
    },
    {
      name: 'nowAvailable',
      enabled: true
    },
    {
      name: 'hideUnpopular',
      enabled: false,
    },
    {
      name: 'limitDays',
      value: 7,
    }
  ],
})

export {
  AppStateContextProvider,
  useAppState,
}
