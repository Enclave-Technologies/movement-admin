"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";

const Table = ({ head, rows }) => {
    return (
        <div className="w-full">
            <table className="w-full text-left rounded-md overflow-hidden">
                <thead className="">
                    <tr className="bg-gray-200 text-black">{head}</tr>
                </thead>
                <tbody className="border-t-0 border-white">
                    {rows.map((row, index) => row)}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
