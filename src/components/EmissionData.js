import React from 'react'
import { getPriceInUSD, useEmission } from "../services/Firebase"
import { formatUSD } from '../utils'

const EmissionData = ({emissionId}) => {
  const E = useEmission(emissionId)
  if (!E){
    return null;
  }

  return (
    <div>
      {!E ?
        `...`
        :
        <div>
            {E.issuer_logo &&
            <div>
              <img src={E.issuer_logo} alt={E.issuer_name}/>
            </div>
            }
          <div>
            <a href={E.reference_on_site}>{E.issuer_name}</a>
            #{E.issue_number} {E.income_type}
          </div>
          <div>{E.emission_type} </div>
          <div>{E.provision} </div>
          <div>rest: {E.rest_count * E.rate} {E.currency_type} </div>
          <div>total: {E.currency_initial_count} {E.currency_type} </div>
          {/*<pre>
            {
              JSON.stringify(
                [
                  "currency_initial_count",
                  "currency_type",
                  "currency",
                  "computed_price",
                  "computed_price_origin_currency",
                  "price_in_exchange",
                  "real_price_in_byn",
                  "count",
                  "rest_count",
                  "rate",
                  "emission_type",
                ].reduce((a,b) => (a[b]=E[b], a),{}),
                null, 2
              )
            }
          </pre>*/}
        </div>
      }
    </div>
  )
}

export default EmissionData
