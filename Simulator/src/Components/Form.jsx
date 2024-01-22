import Image from './Image.jsx'

const Form = ({name, value, onChange}) => {
  return (
	<div>
	  {name} <input value={value} name={name} onChange={onChange} autoComplete="given-name" />
	</div>
  )
}

const Radio = ({name, id, onChange}) => {
  return (
	<>
	  <input type="radio" id={name} name="card_to_pick" value={id} className="radio-input" onChange={onChange} />
	</>
  )
}

  export default { Form, Radio }