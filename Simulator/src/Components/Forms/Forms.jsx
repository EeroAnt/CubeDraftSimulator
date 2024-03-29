import { useState } from 'react'

export const Filter = ({name, value, onChange}) => {
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


export const Dropdown = ({name, value, handleChange}) => {
  return (
	<>
	  <label>{name}
		<select name={name} value={value} onChange={handleChange}>
		  <option value="1">1</option>
		  <option value="2">2</option>
		  <option value="3">3</option>
		  <option value="4">4</option>
		  <option value="5">5</option>
		  <option value="6">6</option>
		  <option value="7">7</option>
		  <option value="8">8</option>
		  <option value="9">9</option>
	    </select>
	  </label>
	</>		
  );
}