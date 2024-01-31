export const Form = ({name, value, onChange}) => {
  return (
	<div>
	  {name} <input value={value} name={name} onChange={onChange} autoComplete="given-name" />
	</div>
  )
}

export const Dropdown = ({name, value, handleChange}) => {
  return (
	<>
	  <label>{name}
		<select value={value} onChange={handleChange}>
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