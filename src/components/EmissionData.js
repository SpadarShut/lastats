import React from 'react'
import {useEmission} from "../services/Firebase"

const EmissionData = ({emissionId}) => {
  const E = useEmission(emissionId)
  if (!E){
    return null;
  }

  return (
    <div className="whitespace-pre-wrap">
      {!E ?
        `...`
        :
        <div>
          <div>{E.issuer_name} #{E.issue_number}</div>
          <div>{E.full_issuer_name}</div>
          <pre>
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
                  "reference_on_site"
                ].reduce((a,b) => (a[b]=E[b], a),{}),
                null, 2
              )
            }
          </pre>
        </div>
      }
    </div>
  )
}

export default EmissionData
