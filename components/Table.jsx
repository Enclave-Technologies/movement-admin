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
      {/* <InfiniteScroll
        dataLength={clients.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <h4 className="text-center text-sm text-gray-700 w-full animate-pulse  mt-4">
            Loading...
          </h4>
        }
        endMessage={
          <p className="text-center text-sm text-gray-700 w-full mt-4">
            All data entries loaded.
          </p>
        }
      > */}
      <table className="w-full text-left rounded-md overflow-hidden">
        <thead className="">
          <tr className="bg-green-500 text-white">{head}</tr>
        </thead>
        <tbody className="border-t-0 border-white">
          {rows.map((row, index) => row)}
        </tbody>
      </table>
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default Table;
