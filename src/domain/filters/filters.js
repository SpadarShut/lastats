const FILTERS = {
  notExtinguished: {
    fn: D => D.filter(
      ({data}) => data.some(st => st.type !== 'EXTINGUISHED')
    ),
  },
  // nowAvailable: ({data}) => data.some(st => st.rest !== 0),
  nowAvailable: {
    fn: D => D.filter(({data}) => data[data.length - 1]?.rest > 0)
  },
  limitDays: {
    fn: (data, {filter}) => {
      return data.map(
        (emission) => ({
          ...emission,
          data: emission.data.filter(
            day => {
              const filterDays = filter.value * 24 * 60 * 60 * 1000;
              const now = new Date().getTime()
              return (
                day.time >= now - filterDays
              )
            }
          )
        })
      )
    }
  },
  hideUnpopular: {
    fn: (D, {emissions}) => D.filter(
      ({data, id}) => {
        return data.some(
          (status, i, arr) => {
            if (arr.length === 1) {
              return true
            }
            if (i === 0) {
              return false
            }
            // const countChanged = emissions[id].count
            const prev = arr[i - 1]
            const prevRest = prev.rest
            const rest = status.rest
            const typeChanged = prev.type !== status.type
            const restChanged = prevRest !== rest
            if (typeChanged) {
              // console.log(`${emissions[id].issuer_name} changed`, {
              //   prev: prev.type,
              //   now: status.type
              // })
            }
            return restChanged || typeChanged
          }
        )
      }
    )
  },
  showDelta: {
    fn: (D) => {
      return D.map((emission) => {

        emission.data = emission.data.map(
          (day, i, all) => {
            const prevStatus = all[i-1];
            const restDelta = prevStatus ?
              prevStatus.rest - day.rest :
              0;

            return {
              ...day,
              restDelta
            }
          }
        )

        return emission;
      })
    }
  },
  groupByIssuer: {
    fn: (data, {emissions}) => {
      data.reduce((issuers, curr) => {
        const emission = emissions[curr.id]
        const issuerId = emission.issuer_id
        let issuer = issuers.find(I => I.id === issuerId)

        if (!issuer) {
          issuer = {
            id: issuerId,
            data: mergeStats(data),
          }
          issuers.push(issuer)
        } else {
          issuer.data = mergeStats(data, issuer.data)
        }

        function mergeStats(data, oldData = {}){
          // todo sum rest in usd
          // getPriceInUSD
          const oldRest = oldData[data.time].rest || 0
          oldData[data.time].rest = oldRest
          // const restPrice = emission.currency_type === 'BYN' ?
          //   getPriceInUSD(1, emission, curr) :
          //   data.rest *

        }
        // debugger;
        return issuers
      }, [])
      debugger;
      return data
    }
  },
  stackedChart: {

  }
}
export { FILTERS }