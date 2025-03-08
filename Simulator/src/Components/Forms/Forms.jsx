import { useState } from 'react'

export const Filter = ({ name, value, onChange }) => {
  return (
    <div>
      {name} <input value={value} name={name} onChange={onChange} autoComplete="given-name" />
    </div>
  )
}

export function Form({ onSubmit, name }) {
  const [username, setUsername] = useState("")
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(username)
        }}
      >
        <input
          name={name}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" />
      </form>
    </>
  )
}


export const DraftParametersForm = ({ name, value, handleChange, defaultVal }) => {
  return (
    <>
      <label>
        {name}
      </label>
      <input type="number" value={value} min={0} max={10} defaultValue={defaultVal} onChange={handleChange} />
      <br />
    </>
  );
}

export const DraftParameterCheckbox = ({ name, value, handleChange }) => {
  return (
    <>
      <label>
        {name}
      </label>
      <input type="checkbox" value={value} onChange={handleChange} />
      <br />
    </>
  );
}