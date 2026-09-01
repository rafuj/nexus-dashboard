"use client";
import { Helmet } from "react-helmet-async";
import ManageCabinet from "../components/ManageCabinet";

export default function AddCabinets() {
  return (
    <>
      <Helmet>
        <title>Add Cabinets | Updaid</title>
      </Helmet>
      <ManageCabinet className="border bg-white rounded-[15px] mt-4 p-5" />
    </>
  );
}
