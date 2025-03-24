export const FormSubmitButton = ({ name }) => {
  return (
    <div>
      <button>{name}</button>
    </div>
  )
}

export const Button = ({ name, onClick, className="main" }) => {
  return (
    <>
      <button className={className} onClick={onClick}>{name}</button>
    </>
  )
}