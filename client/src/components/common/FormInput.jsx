const FormInput = ({ label, error, className = '', ...inputProps }) => (
  <div className={className}>
    {label && <label className="label-text" htmlFor={inputProps.id}>{label}</label>}
    <input className="input-field" {...inputProps} />
    {error && <p className="mt-1 text-sm text-danger">{error}</p>}
  </div>
);

export default FormInput;
