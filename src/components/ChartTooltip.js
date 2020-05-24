import React from 'react'
import * as FirestoreService from "../services/Firebase"
import {formatUSD} from '../utils'

const ChartTooltip = ({point}) => {
  const {id, rest} = point.data;
  const E = FirestoreService.useEmission(id)
  if (!E) {
    return null;
  }

  const restUSD = formatUSD(FirestoreService.getPrice(rest, E))
  const boughtUSD = formatUSD(FirestoreService.getPrice(E.count - rest, E))

  return (
    <div style={{background: '#f0f0f0', padding: '.5ex 1ex', fontSize: 10}}>
      <div>{E.issuer_name} #{E.issue_number}</div>
      <div>Куплена: {E.count - rest} ({boughtUSD})</div>
      <div>Засталося: {rest} ({restUSD})</div>
      <div>Адна: {E.currency} {E.currency_type}</div>
      <div>Rate: {E.rate} {E.price_compute_type}</div>
      <div>{E.emission_type}</div>
    </div>
  )
}

export default ChartTooltip
