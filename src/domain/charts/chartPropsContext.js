import createContextWithUpdater from '../../utils/createContextWithUpdater';

const [ChartPropsContextProvider, useChartProps] = createContextWithUpdater({
  enableGridX: false,
  enableGridY: false,
  enableCrosshair: false,
  animate: false,
})

export {
  ChartPropsContextProvider,
  useChartProps
}