
const FILTERS = {
  hideUnpopular: {
    fn: (D) => D.filter(({data}) => data.some(st => st.delta !== 0))
  },
  notExtinguished: {
    fn: D => D.filter(({data}) => data.some(st => st.type !== 'EXTINGUISHED')),
  },
  // nowAvailable: ({data}) => data.some(st => st.rest !== 0),
  nowAvailable: {
    fn: D => D.filter(({data}) => data[data.length - 1].rest > 0)
  },
  limitDays: {
    fn: (data, {filter}) => {
      return data.map(
        (emission) => ({
          ...emission,
          data: emission.data.filter(
            day => (
              day.time >= new Date().getTime() - (filter.value * 24 * 60 * 60 * 1000)
            )
          )
        })
      )
    }
  }
}
export { FILTERS }