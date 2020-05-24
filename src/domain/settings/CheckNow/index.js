import React from 'react'
import { checkStatus } from '../../../services/lacerta'

const CheckNow = () => {
  const [checking, setChecking] = React.useState()
  return (
    <div>
      <button
        className={'border px-4 py-2'}
        disabled={checking}
        onClick={()=>{
          if (checking) {
            return;
          }
          setChecking(true);
          checkStatus().then(() => {
            setChecking(false)
          })
        }}
      >
        {
          checking ?
            'Пачакайце...' :
            'Праверыць зараз'
        }
      </button>
    </div>
  )
}

export default CheckNow
