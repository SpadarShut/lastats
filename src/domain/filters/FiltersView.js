import React from 'react'
import {useAppState} from '../app/appStateContext'

const FiltersView = () => {
  // const [appState, setAppState] = useAppState();
  const [filters, setFilters] = useAppState('filters')
  const [stackChart, setStackChart] = useAppState('stackChart')

  const addFilter = React.useCallback(() => {
    setFilters([
      ...filters,
      {}
    ])
  }, [filters, setFilters])

  const updateFilter = React.useCallback((name, value) => {
    setFilters(filters.map(f => {
      return  f.name === name ?
        {...f, ...value} :
        f
    }))
  }, [filters, setFilters])

  const limitDaysFilter = filters.find((f) => f.name === 'limitDays')

  return (
    <div>
      {
        filters
          .filter((f) => f.hasOwnProperty('enabled'))
          .map((f) => (
            <label
              className="block mb-4"
              key={f.name}
            >
              <input
                type="checkbox"
                value={f.name}
                checked={f.enabled}
                className="mr-2"
                onChange={({target}) => {
                  console.log('onchange handler',target.value, target.checked)
                  updateFilter(target.value, {
                    enabled: target.checked
                  })
                }}
              />
                {f.name}
              </label>
          ))
      }
      {
        <div>
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={stackChart}
              onChange={e => setStackChart(e.target.checked)}
            />
            Stack Chart
          </label>
        </div>
      }
      {
        limitDaysFilter &&
        <div>
          <label htmlFor="">Апошнія</label>
          <input
            type="number"
            className={'border mb'}
            value={limitDaysFilter.value}
            onChange={({target}) => {
              let value = parseInt(target.value) || 0;
              value = Math.max(value, 1)
              updateFilter(limitDaysFilter.name, {value})
            }}
          />
        </div>
      }
      <button
        onClick={addFilter}
        className="border p-2"
      >
        + Дадаць
      </button>
    </div>
  )
}

export default FiltersView
