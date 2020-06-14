import createContextWithUpdater from '../../utils/createContextWithUpdater'

const [ AppStateContextProvider, useAppState ] = createContextWithUpdater({
  selectedEmissionId: null,
  stackChart: false,
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
      enabled: true,
    },
    {
      name: 'limitDays',
      value: 8,
    },
    {
      name: 'showDelta',
      enabled: true,
    },
    {
      name: 'groupByIssuer',
      enabled: false
    },
  ],
})

export {
  AppStateContextProvider,
  useAppState,
}
