function Validation(values) {
  let error = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const password_pattern = /^.{8,}$/;

  if (values.name === "") {
    error.name = "Nama tidak boleh kosong";
  } else {
    error.name = "";
  }
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
    error.password = "Password salah";
  } else {
    error.password = "";
  }
  if (values.prodi === "") {
    error.prodi = "Program Studi tidak boleh kosong";
  } else {
    error.prodi = "";
  }
  if (values.nim === "") {
    error.nim = "NIM tidak boleh kosong";
  } else {
    error.nim = "";
  }
  if (values.no_telp === "") {
    error.no_telp = "Nomor Telepon tidak boleh kosong";
  } else {
    error.no_telp = "";
  }
  if (values.tgl_lahir === "") {
    error.tgl_lahir = "Tanggal lahir tidak boleh kosong";
  } else {
    error.tgl_lahir = "";
  }
  if (values.tempat_lahir === "") {
    error.tempat_lahir = "Tempat lahir tidak boleh kosong";
  } else {
    error.tempat_lahir = "";
  }
  return error;
}
export default Validation;
