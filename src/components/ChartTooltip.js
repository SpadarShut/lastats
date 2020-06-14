import React from 'react'
import {getPriceInUSD,useEmission} from "../services/Firebase"
import {formatUSD} from '../utils'

const style = {background: '#f0f0f0', padding: '.5ex 1ex', fontSize: 10}

const ChartTooltip = ({point}) => {
  const {id, rest, restDelta, boughtFromStartDelta = 0} = point.data;
  const E = useEmission(id)
  if (!E) {
    return null;
  }

  if (!restDelta && restDelta !== 0) {
    console.log({
      restDelta,
      data: point.data
    })
  }
  const restUSD = formatUSD(getPriceInUSD(rest, E)) // todo show in %
  const deltaUSD = formatUSD(getPriceInUSD(restDelta, E))
  const boughtUSD = formatUSD(getPriceInUSD(E.count - rest, E))
  const boughtFromStartDeltaUSD = formatUSD(getPriceInUSD(boughtFromStartDelta, E))

  return (
    <div style={style}>
      <div>{E.issuer_name} #{E.issue_number}</div>
      {
        restDelta !== undefined &&
          <div>Рух: {deltaUSD}</div>
      }
      {
        boughtFromStartDelta !== undefined &&
          <div>Рух ад пачатку: {boughtFromStartDeltaUSD}</div>
      }
      <div>Куплена: {boughtUSD}</div>
      <div>Засталося: {restUSD} </div>
      <div>Адна: {E.currency} {E.currency_type}</div>
    </div>
  )
}

export default ChartTooltip
