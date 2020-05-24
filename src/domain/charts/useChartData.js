import * as FirestoreService from '../../services/Firebase'
import { useAppState } from '../app/appStateContext'
import { getPrice} from '../../services/Firebase'
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

      debugger;
      return result
    }, _data)

    .map(emission => {
      emission.data = emission.data.map((st) => {
        const em = emissions[st.id]
        const bought = em.count - st.rest;
        return ({
          ...st,
          x: new Date(Number(st.time)),
          y: getPrice(bought, em, st)
        })
      })
      return emission
    })

  return data;
}