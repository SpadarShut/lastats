import * as FirestoreService from '../../services/Firebase'
import { useAppState } from '../app/appStateContext'
import { getPriceInUSD} from '../../services/Firebase'
import { FILTERS } from '../filters/filters'

export function useChartData() {
  const [_data] = FirestoreService.useStatuses()
  const [emissions] = FirestoreService.useEmissions()
  const [appState] = useAppState()

  if (!_data || !emissions) {
    return null
  }

  const {filters} = appState;
  let data = filters
    .reduce((result, filter) => {
      const F = FILTERS[filter.name]
      const enabled = filter.enabled || filter.enabled === undefined;

      if (!enabled) {
        return result
      }
      if (F && F.fn) {
        return F.fn(result, {
          filter,
          filters,
          emissions
        })
      }

      return result
    }, _data)

    .map(emission => {
      const showDeltaFilter = filters.find(f => f.name === 'showDelta')
      const processingFn = showDeltaFilter && showDeltaFilter.enabled ? yDelta : yTotal

      emission.data = emission.data.map((status, i, all) => {
        return processingFn(status, emissions[status.id], all)
      })
      return emission
    })

  return data;
}


function yTotal(status, emission) {
  const date = getStatusDate(status)

  if (!emission) {
    console.log('Unknown emission', {
      em: emission,
      status: status,
    })
    return {
      x: date,
      y: 0
    }
  }
  const bought = emission.count - status.rest;
  return ({
    ...status,
    x: date,
    y: getPriceInUSD(bought, emission, status)
  })
}

function yDelta(status, emission, all) {
  if (!emission) {
    return 0
  }
  const base = all[0];
  // total 1000, rest 9 =>
  // 1000
  const baseBoughtCount = emission.count - base.rest
  const currBoughtCount = emission.count - status.rest
  // const baseBoughtValue = getPriceInUSD(baseBoughtCount, emission, status)
  // 8 9 => 1
  const relativeBoughtCount = currBoughtCount - baseBoughtCount;

  return {
    ...status,
    boughtFromStartDelta: relativeBoughtCount,
    x: getStatusDate(status),
    y: getPriceInUSD(relativeBoughtCount, emission, status)
  }
}

function getStatusDate(status){
  return new Date(Number(status.time))
}