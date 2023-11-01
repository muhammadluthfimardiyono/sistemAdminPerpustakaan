import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaMoneyBillWave } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { ImBook, ImUpload2, ImDownload2 } from "react-icons/im";
import { Link, useLocation } from "react-router-dom";
import LogOutButton from "./LogOutButton";

function SidebarNew(props) {
  const menus = [
    { name: "Data Buku", link: "/books", icon: ImBook },
    {
      name: "Data Anggota Perpustakaan",
      link: "/data-user",
      icon: BsPeopleFill,
    },
    {
      name: "Data Peminjaman",
      link: "/data-peminjaman",
      icon: ImUpload2,
    },
    {
      name: "Data Pengembalian",
      link: "/data-pengembalian",
      icon: ImDownload2,
    },
    { name: "Data Denda", link: "/denda", icon: FaMoneyBillWave },
  ];

  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(location.pathname);

  const handleMenuClick = (link) => {
    setActive(link);
  };

  return (
    <section className="flex gap-6">
      <div
        className={`bg-blue-800 min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={`${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md my-2 ${
                active === menu?.link ? "bg-gray-800" : ""
              }`}
              onClick={() => handleMenuClick(menu?.link)}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50`}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
        <div
          className={`whitespace-pre duration-500 my-5 ${
            !open && "opacity-0 -translate-x-28 overflow-hidden"
          }`}
        >
          <LogOutButton />
        </div>
      </div>

      <div className="w-full">{props.children}</div>
    </section>
  );
}

export default SidebarNew;
