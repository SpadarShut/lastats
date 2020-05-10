import createContextWithUpdater from './services/createContextWithUpdater';

const [StateContextProvider, useChartProps] = createContextWithUpdater({
  enableGridX: false,
  enableGridY: false,
  enableCrosshair: false,
})

export {
  StateContextProvider,
  useChartProps
}