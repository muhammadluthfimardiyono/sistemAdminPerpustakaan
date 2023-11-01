import React, { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import BackButton from "../components/BackButton";
import { useParams } from "react-router-dom";
import { Label, TextInput, Textarea } from "flowbite-react";
import axios from "axios";

function DetailBuku() {
  const [bookData, setBookData] = useState({});
  const { id } = useParams();

  // Fungsi untuk mengambil data buku dari server
  const fetchBookData = async (id) => {
    axios
      .get(`https://server.libraryselfservice.site/data-buku/${id}`)
      .then(async (response) => {
        setBookData(response.data[0]);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchBookData(id);
  }, []);

  return (
    <div className="mx-5 my-5">
      <SectionHeading title={"Detail Buku"}></SectionHeading>
      <div>
        <div>
          <BackButton></BackButton>
        </div>
        <div className="mx-5 mt-5 mb-12">
          <form className="flex flex-col gap-4 mt-6">
            <div>
              <div className="block mb-2">
                <Label htmlFor="pengarang" value="Pengarang" />
              </div>
              <TextInput
                id="pengarang"
                name="pengarang"
                type="text"
                value={bookData.pengarang}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="judul" value="Judul Buku" />
              </div>
              <TextInput
                id="judul"
                name="judul"
                type="text"
                value={bookData.judul}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="penerbit" value="Penerbit" />
              </div>
              <TextInput
                id="penerbit"
                name="penerbit"
                type="text"
                value={bookData.penerbit}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="tahun_terbit" value="Tahun Terbit" />
              </div>
              <TextInput
                id="tahun_terbit"
                name="tahun_terbit"
                type="number"
                value={bookData.tahun_terbit}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="isbn_issn" value="ISBN/ISSN" />
              </div>
              <TextInput
                id="isbn_issn"
                name="isbn_issn"
                type="text"
                value={bookData.isbn_issn}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="jumlah_halaman" value="Jumlah Halaman" />
              </div>
              <TextInput
                id="jumlah_halaman"
                name="jumlah_halaman"
                type="text"
                value={bookData.jumlah_halaman}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="deskripsi" value="Deskripsi" />
              </div>
              <div className="text-justify text-gray-400 border border-gray-400 p-3 rounded-md bg-white">
                {bookData.deskripsi}
              </div>
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="sumber" value="Sumber Buku" />
              </div>
              <TextInput
                id="sumber"
                name="sumber"
                type="text"
                value={bookData.sumber}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="kode_rak" value="Kode Rak" />
              </div>
              <TextInput
                id="kode_rak"
                name="kode_rak"
                type="text"
                value={bookData.kode_rak}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="kode_barcode" value="Kode Barcode" />
              </div>
              <TextInput
                id="kode_barcode"
                name="kode_barcode"
                type="text"
                value={bookData.kode_barcode}
                shadow={true}
                disabled
                color={"black"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DetailBuku;
