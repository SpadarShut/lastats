import React from 'react'
import {useChartProps} from './StateContext'
// import { Form, Field } from 'react-final-form'

const Settings = () => {
  const [props, setProps] = useChartProps();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={props.enableGridX}
          name="enableGridX"
          className="mr-2"
          onChange={({target}) => {
            console.log(target.checked)
            setProps({
              [target.name]: target.checked
            })
          }}
        />
        enableGridX
      </label>
      {/*<pre>*/}
      {/*  <code>*/}
      {/*    {JSON.stringify(props, null, 2)}*/}
      {/*  </code>*/}
      {/*</pre>*/}
    </div>
  )
}

export {Settings}
