const Form = ({name, value, onChange}) => {
	return (
	  <div>
	  {name} <input value={value} name={name} onChange={onChange} autoComplete="given-name" />
	  </div>
	)
  }
  
  export default Form