import { useState } from 'react'
import styles from './Forms.module.css'

export const Filter = ({ name, value, onChange }) => {
  return (
    <div>
      {name} <input value={value} name={name} onChange={onChange} autoComplete="given-name" />
    </div>
  )
}

export function Form({ onSubmit, name }) {
  const [input, setInput] = useState("")
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(input)
        }}
      >
        <input
          name={name}
          type="text"
          value={input}
          maxLength={16}
          onChange={(e) => setInput(e.target.value.split(/[^a-zA-Z0-9 ]/).join(''))}
        />
        <input
          type="submit"
          className={styles.submitButton}
          value="Submit"
        />
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
    </>
  );
}

export const DraftParameterCheckbox = ({ name, value, handleChange }) => {
  return (
    <>
      <label>
        {name}
      </label>
      <br />
      <input type="checkbox" value={value} onChange={handleChange} />
      <br />
    </>
  );
}