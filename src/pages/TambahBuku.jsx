import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Textarea, Select } from "flowbite-react";
import SectionHeading from "../components/SectionHeading";
import axios from "axios";
import BackButton from "../components/BackButton";
import { Radio } from "flowbite-react";

const TambahBuku = () => {
  const [kode_barcode, setKodeBarcode] = useState("");
  const navigate = useNavigate();

  const generateKodeBarcode = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(6, "0");
    setKodeBarcode(formattedNumber);
  };

  useEffect(() => {
    generateKodeBarcode();
  }, []);

  const kodeRakOptions = [
    { value: "000001", label: "000001" },
    { value: "000002", label: "000002" },
    { value: "000003", label: "000003" },
    { value: "000004", label: "000004" },
    { value: "000005", label: "000005" },
    { value: "000006", label: "000006" },
  ];

  const sumberOptions = [
    { value: "Pembelian", label: "Pembelian" },
    { value: "Pertukaran", label: "Pertukaran" },
    { value: "Hibah", label: "Hibah" },
    { value: "Keanggotaan organisasi", label: "Keanggotaan organisasi" },
  ];

  const formik = useFormik({
    initialValues: {
      pengarang: "",
      judul: "",
      penerbit: "",
      tahun_terbit: "",
      isbn_issn: "",
      jumlah_halaman: "",
      deskripsi: "",
      sumber: "",
      kode_rak: "",
    },
    validationSchema: Yup.object({
      pengarang: Yup.string()
        .min(3, "Mohon isi Nama pengarang dengan lengkap")
        .required("Nama Pengarang harus diisi"),

      judul: Yup.string().required("Judul harus diisi"),

      penerbit: Yup.string()
        .min(3, "Mohon isi Penerbit dengan benar")
        .required("Penerbit harus diisi"),

      tahun_terbit: Yup.number()
        .min(4, "Mohon isi tahun dengan benar")
        .required("Tahun terbit harus diisi"),

      isbn_issn: Yup.string()
        .min(3, "Mohon isi ISBN/ISSN dengan benar")
        .required("ISBN/ISSN harus diisi"),

      isbn_issn: Yup.string().matches(
        /^[0-9-]+$/,
        "Hanya simbol - dan angka yang diizinkan"
      ),

      jumlah_halaman: Yup.string().required("Jumlah halaman harus diisi"),

      deskripsi: Yup.string().required("Deskripsi harus diisi"),

      sumber: Yup.string().required("Sumber Buku harus diisi"),

      kode_rak: Yup.string().required("Kode rak harus diisi"),
    }),

    onSubmit: async (values) => {
      const {
        pengarang,
        judul,
        penerbit,
        tahun_terbit,
        isbn_issn,
        jumlah_halaman,
        deskripsi,
        sumber,
        kode_rak,
      } = values;

      try {
        const bukuBaru = {
          pengarang: pengarang,
          judul: judul,
          penerbit: penerbit,
          tahun_terbit: tahun_terbit,
          isbn_issn: isbn_issn,
          jumlah_halaman: jumlah_halaman,
          deskripsi: deskripsi,
          tersedia: 1,
          sumber: sumber,
          kode_rak: kode_rak,
          kode_barcode: kode_barcode,
        };

        console.log(bukuBaru);
        const response = await axios.post(
          `https://server.libraryselfservice.site/add-buku`,
          bukuBaru
        );
        console.log("Book added successfully:", response.data);
        localStorage.setItem("addSuccess", true);
        navigate("/books");
      } catch (error) {
        alert(error.message);
      }
    },
  });

  return (
    <div className="mx-5 my-5">
      <SectionHeading title={"Tambah Buku"}></SectionHeading>

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
                  htmlFor="pengarang"
                  value="Pengarang"
                  color={formik.errors.pengarang ? "failure" : ""}
                />
              </div>
              <TextInput
                id="pengarang"
                name="pengarang"
                type="text"
                value={formik.values.pengarang}
                onChange={formik.handleChange}
                color={formik.errors.pengarang ? "failure" : ""}
                placeholder="Masukkan nama pengarang"
                helperText={formik.errors.pengarang}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="judul"
                  value="Judul Buku"
                  color={formik.errors.judul ? "failure" : ""}
                />
              </div>
              <TextInput
                id="judul"
                name="judul"
                type="judul"
                value={formik.values.judul}
                onChange={formik.handleChange}
                placeholder="Masukkan Judul Buku"
                color={formik.errors.judul ? "failure" : ""}
                helperText={formik.errors.judul}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="penerbit"
                  value="Penerbit"
                  color={formik.errors.penerbit ? "failure" : ""}
                />
              </div>
              <TextInput
                id="penerbit"
                name="penerbit"
                type="text"
                value={formik.values.penerbit}
                onChange={formik.handleChange}
                color={formik.errors.penerbit ? "failure" : ""}
                placeholder="Masukkan Penerbit Buku"
                helperText={formik.errors.penerbit}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="tahun_terbit"
                  value="Tahun Terbit"
                  color={formik.errors.tahun_terbit ? "failure" : ""}
                />
              </div>
              <TextInput
                id="tahun_terbit"
                name="tahun_terbit"
                type="number"
                value={formik.values.tahun_terbit}
                onChange={formik.handleChange}
                color={formik.errors.tahun_terbit ? "failure" : ""}
                placeholder="Masukkan tahun terbit buku"
                helperText={formik.errors.tahun_terbit}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="jumlah_halaman"
                  value="Jumlah Halaman"
                  color={formik.errors.jumlah_halaman ? "failure" : ""}
                />
              </div>
              <TextInput
                id="jumlah_halaman"
                name="jumlah_halaman"
                type="number"
                value={formik.values.jumlah_halaman}
                onChange={formik.handleChange}
                color={formik.errors.jumlah_halaman ? "failure" : ""}
                placeholder="Masukkan jumlah halaman buku"
                helperText={formik.errors.jumlah_halaman}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="isbn_issn"
                  value="ISBN/ISSN"
                  color={formik.errors.isbn_issn ? "failure" : ""}
                />
              </div>
              <TextInput
                id="isbn_issn"
                name="isbn_issn"
                type="string"
                value={formik.values.isbn_issn}
                onChange={formik.handleChange}
                color={formik.errors.isbn_issn ? "failure" : ""}
                placeholder="Masukkan ISBN/ISSN buku"
                helperText={formik.errors.isbn_issn}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="deskripsi"
                  value="Deskripsi"
                  color={formik.errors.deskripsi ? "failure" : ""}
                />
              </div>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                type="text"
                value={formik.values.deskripsi}
                onChange={formik.handleChange}
                color={formik.errors.deskripsi ? "failure" : ""}
                placeholder="Masukkan deskripsi buku"
                helperText={formik.errors.deskripsi}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="sumber"
                  value="Sumber Buku"
                  color={formik.errors.sumber ? "failure" : ""}
                />
              </div>
              <div className="flex gap-4">
                {sumberOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <Radio
                      id={option.value}
                      name="sumber"
                      value={option.value}
                      onChange={formik.handleChange}
                      checked={formik.values.sumber === option.value}
                      className={formik.errors.sumber ? "failure" : ""}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </div>
              {formik.errors.sumber && (
                <p className="failure">{formik.errors.sumber}</p>
              )}
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="kode_rak"
                  value="Kode Rak"
                  color={formik.errors.kode_rak ? "failure" : ""}
                />
              </div>
              <Select
                id="kode_rak"
                name="kode_rak"
                value={formik.values.kode_rak}
                onChange={formik.handleChange}
                className={formik.errors.kode_rak ? "failure" : ""}
              >
                <option value="" label="Pilih Kode Rak" disabled />
                {kodeRakOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {formik.errors.kode_rak && (
                <p className="failure">{formik.errors.kode_rak}</p>
              )}
            </div>

            <Button type="submit">Tambah Buku</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahBuku;
