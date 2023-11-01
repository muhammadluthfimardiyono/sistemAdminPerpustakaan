import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Label, TextInput, Button, Modal } from "flowbite-react";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import Validation from "../Validation/SignUpValidation";

function SignUp() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    no_telp: "",
    tempat_lahir: "",
    tgl_lahir: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const err = Validation({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
      no_telp: values.no_telp.trim(),
      tempat_lahir: values.tempat_lahir.trim(),
      tgl_lahir: values.tgl_lahir.trim(),
    });

    setErrors(err);

    if (
      err.name === "" &&
      err.email === "" &&
      err.password === "" &&
      err.no_telp === "" &&
      err.tempat_lahir === "" &&
      err.tgl_lahir === ""
    ) {
      axios
        .post("https://server.libraryselfservice.site/signup", values)
        .then((res) => {
          setShowModal(true);

          const closeModal = document.getElementById("closeModal");
          closeModal.addEventListener("click", function () {
            navigate("/");
          });
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response.data.error;
            setErrors({ ...err, email: errorMessage });
            setShowModal(true);
          } else {
            console.log(error);
          }
        });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-blue-800 py-5">
      <div className="m-auto w-full flex justify-center">
        <div className="w-full flex justify-center">
          <Modal show={showModal} size="md" popup={true} onClose={closeModal}>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <MdOutlineCheckCircleOutline className="mx-auto mb-4 h-14 w-14 text-green-500" />

                {errors.email ? (
                  <h3 className="mb-5 text-lg font-normal text-red-600">
                    {errors.email}
                  </h3>
                ) : (
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Sign Up Success
                  </h3>
                )}

                <div className="flex justify-center gap-4">
                  <Button
                    id="closeModal"
                    color="blue"
                    onClick={() => setShowModal(false)}
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <Card className="w-3/6 px-5 py-3">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Pendaftaran Admin Perpustakaan
            </h1>
            <div className="text-center flex justify-center flex-col items-center">
              <IoPersonCircle
                size="8rem"
                className="text-blue-900"
              ></IoPersonCircle>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex">
                <div className="w-1/4">
                  <Label htmlFor="name" value="Nama" />
                </div>
                <div className="row w-3/4">
                  <TextInput
                    type="name"
                    id="name"
                    placeholder="Masukkan nama"
                    name="name"
                    onChange={handleInput}
                    className="w-full"
                  />
                  {errors.name && (
                    <span className="text-red-600 text-xs"> {errors.name}</span>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/4">
                  <Label htmlFor="tempat_lahir" value="Tempat Tanggal Lahir" />
                </div>
                <div className="flex w-3/4 gap-4">
                  <div className="w-1/2 row">
                    <TextInput
                      type="text"
                      id="tempat_lahir"
                      placeholder="Masukkan Tempat Lahir"
                      name="tempat_lahir"
                      onChange={handleInput}
                      className="w-full"
                    />
                    {errors.tempat_lahir && (
                      <span className="text-red-600 text-xs">
                        {" "}
                        {errors.tempat_lahir}
                      </span>
                    )}
                  </div>

                  <div className="w-1/2 row">
                    <TextInput
                      type="date"
                      id="tgl_lahir"
                      name="tgl_lahir"
                      onChange={handleInput}
                      className="w-full"
                    />
                    {errors.tgl_lahir && (
                      <span className="text-red-600 text-xs">
                        {" "}
                        {errors.tgl_lahir}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-1/4">
                  <Label htmlFor="no_telp" value="Nomor Telepon" />
                </div>
                <div className="w-3/4">
                  <TextInput
                    type="text"
                    id="no_telp"
                    placeholder="Masukkan Nomor Telepon"
                    name="no_telp"
                    onChange={handleInput}
                    className="w-full "
                  />
                  {errors.no_telp && (
                    <span className="text-red-600 text-xs">
                      {" "}
                      {errors.no_telp}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/4">
                  <Label htmlFor="email" value="Email" />
                </div>
                <div className="w-3/4">
                  <TextInput
                    type="email"
                    id="email"
                    placeholder="Masukkan Email"
                    name="email"
                    onChange={handleInput}
                    className="w-full"
                  />
                  {errors.email && (
                    <span className="text-red-600 text-xs">
                      {" "}
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/4">
                  <Label htmlFor="password" value="Password" />
                </div>
                <div className="w-3/4">
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    onChange={handleInput}
                    className="w-full"
                  />
                  {errors.password && (
                    <span className="text-red-600 text-xs">
                      {" "}
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>

              <Button type="submit">Konfirmasi Pendaftaran</Button>

              <div className="text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Jika anda sudah memiliki akun silahkan
                </span>
                <Link to="/">
                  <span className="text-sm font-bold"> Masuk</span>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
