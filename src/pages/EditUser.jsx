import axios from "axios";
import { TextInput, Button, Label } from "flowbite-react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SectionHeading from "../components/SectionHeading";
import BackButton from "../components/BackButton";
import Datepicker from "tailwind-datepicker-react";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const handleChange = (selectedDate) => {
    setSelectedDate(selectedDate);
    console.log(selectedDate);
  };
  const handleClose = (state) => {
    setShow(state);
  };

  const fetchUserData = (id) => {
    axios
      .get(`https://server.libraryselfservice.site/user-data/${id}`)
      .then((response) => {
        const userDataFromServer = response.data[0];

        const formattedDate = userDataFromServer.tgl_lahir
          ? format(new Date(userDataFromServer.tgl_lahir), "yyyy-MM-dd")
          : "";

        setUserData({
          ...userDataFromServer,
          tgl_lahir: formattedDate,
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchUserData(id);
    setSelectedDate(userData.tgl_lahir);
    console.log(id);
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      nama: userData.nama || "",
      tempat_lahir: userData.tempat_lahir || "",
      tgl_lahir: userData.tgl_lahir || "",
      prodi: userData.prodi || "",
      email: userData.email || "",
      nim: userData.nim || "",
      no_telp: userData.no_telp || "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama harus diisi"),
      tempat_lahir: Yup.string().required("Tempat Lahir harus diisi"),
      tgl_lahir: Yup.date().required("Tanggal Lahir harus diisi"),
      prodi: Yup.string().required("Program Studi harus diisi"),
      email: Yup.string().required("Email harus diisi"),
      nim: Yup.string().required("NIM harus diisi"),
      no_telp: Yup.string().required("Nomor Telepon harus diisi"),
    }),

    onSubmit: async (values) => {
      const { nama, tempat_lahir, tgl_lahir, prodi, nim, no_telp, email } =
        values;

      try {
        const userBaru = {
          nama: nama,
          tempat_lahir: tempat_lahir,
          tgl_lahir: tgl_lahir,
          prodi: prodi,
          nim: nim,
          no_telp: no_telp,
          email: email,
        };

        console.log(userBaru);
        const response = await axios.put(
          `https://server.libraryselfservice.site/user-update/${id}`,
          userBaru
        );
        console.log("User updated successfully:", response.data);
        localStorage.setItem("EditSuccess", true);
        navigate("/data-user");
      } catch (error) {
        alert(error.message);
      }
    },
  });

  return (
    <div className="mx-5 my-5">
      <SectionHeading title={"Edit Anggota Perpustakaan"}></SectionHeading>
      <div>
        <div>
          <BackButton></BackButton>
        </div>
        <div className="mx-5 my-5">
          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="nama"
                  value="Nama"
                  color={formik.errors.nama ? "failure" : ""}
                />
              </div>
              <TextInput
                id="nama"
                name="nama"
                type="text"
                value={formik.values.nama}
                onChange={formik.handleChange}
                color={formik.errors.nama ? "failure" : ""}
                placeholder="Masukkan nama"
                helperText={formik.errors.nama}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="email"
                  value="Email"
                  color={formik.errors.email ? "failure" : ""}
                />
              </div>
              <TextInput
                id="email"
                name="email"
                type="text"
                value={formik.values.email}
                onChange={formik.handleChange}
                color={formik.errors.email ? "failure" : ""}
                placeholder="Masukkan email"
                helperText={formik.errors.email}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="tempat_lahir"
                  value="Tempat Lahir"
                  color={formik.errors.tempat_lahir ? "failure" : ""}
                />
              </div>
              <TextInput
                id="tempat_lahir"
                name="tempat_lahir"
                type="text"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
                placeholder="Masukkan Tempat Lahir"
                color={formik.errors.tempat_lahir ? "failure" : ""}
                helperText={formik.errors.tempat_lahir}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="tgl_lahir"
                  value="Tanggal Lahir"
                  color={formik.errors.tgl_lahir ? "failure" : ""}
                />
              </div>
              <div>
                <input
                  type="date"
                  id="tgl_lahir"
                  name="tgl_lahir"
                  value={formik.values.tgl_lahir}
                  onChange={formik.handleChange}
                  color={formik.errors.tgl_lahir ? "failure" : ""}
                  placeholder="Masukkan Tanggal Lahir"
                />
              </div>
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="prodi"
                  value="Program Studi"
                  color={formik.errors.prodi ? "failure" : ""}
                />
              </div>
              <TextInput
                id="prodi"
                name="prodi"
                type="text"
                value={formik.values.prodi}
                onChange={formik.handleChange}
                color={formik.errors.prodi ? "failure" : ""}
                placeholder="Masukkan Program Studi"
                helperText={formik.errors.prodi}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="nim"
                  value="Nomor Induk Mahasiswa"
                  color={formik.errors.nim ? "failure" : ""}
                />
              </div>
              <TextInput
                id="nim"
                name="nim"
                type="text"
                value={formik.values.nim}
                onChange={formik.handleChange}
                color={formik.errors.nim ? "failure" : ""}
                placeholder="Masukkan Nomor Induk Mahasiswa"
                helperText={formik.errors.nim}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="no_telp"
                  value="Nomor Telepon"
                  color={formik.errors.no_telp ? "failure" : ""}
                />
              </div>
              <TextInput
                id="no_telp"
                name="no_telp"
                type="text"
                value={formik.values.no_telp}
                onChange={formik.handleChange}
                color={formik.errors.no_telp ? "failure" : ""}
                placeholder="Masukkan Nomor Telepon"
                helperText={formik.errors.no_telp}
                shadow={true}
              />
            </div>
            <Button type="submit">Edit Anggota Perpustakaan</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
