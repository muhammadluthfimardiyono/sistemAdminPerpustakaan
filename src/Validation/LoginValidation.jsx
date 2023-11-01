function Validation(values) {
  let error = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const password_pattern = /^.{8,}$/;

  if (values.email === "") {
    error.email = "Email tidak boleh kosong";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email tidak sesuai";
  } else {
    error.email = "";
  }
  if (values.password === "") {
    error.password = "Password tidak boleh kosong";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password tidak sesuai";
  } else {
    error.password = "";
  }
  return error;
}
export default Validation;
