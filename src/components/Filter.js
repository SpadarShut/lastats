import React from 'react'

const Filter = ({property, operator, valu}) => {
  return (
    <div className="flex-row space-x-4">
      <select
        name=""
        id=""
        className="border"
      />
      <select
        name=""
        id=""
        className="border"
        value={operator}
      >
        {['~', '=', '!=', '>', '<'].map(operator => (
          <option value={operator} key={operator}>{operator}</option>
        ))}
      </select>
      <input type="text" className="border" />
    </div>
  )
}

export default Filter
