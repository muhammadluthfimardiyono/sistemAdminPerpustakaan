import React, { useState } from "react";
import { TextInput, Button } from "flowbite-react";

const SearchBar = ({ onSearch, data }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const filteredData = data.filter((item) => {
      const judulMatch = item.judul
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const pengarangMatch = item.pengarang
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const penerbitMatch = item.penerbit
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const tahunTerbitMatch = String(item.tahun_terbit)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const kodeBarcodeMatch = item.kode_barcode
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const kodeRakMatch = item.kode_rak
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const statusMatch =
        (searchQuery.toLowerCase() === "tersedia" && item.tersedia === 1) ||
        searchQuery.toLowerCase() === "tidak tersedia" ||
        (searchQuery.toLowerCase() === "tidak" && item.tersedia === 0);
      return (
        judulMatch ||
        pengarangMatch ||
        penerbitMatch ||
        tahunTerbitMatch ||
        kodeBarcodeMatch ||
        kodeRakMatch ||
        statusMatch
      );
    });

    onSearch(filteredData);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="w-full my-5">
      <div className="flex flex-wrap gap-5 justify-end mr-5">
        <TextInput
          id="searchInput"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
};

export default SearchBar;
