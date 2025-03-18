export const FormSubmitButton = ({ name }) => {
  return (
    <div>
      <button>{name}</button>
    </div>
  )
}

export const Button = ({ name, onClick }) => {
  return (
    <>
      <button onClick={onClick}>{name}</button>
    </>
  )
}