// components/Breadcrumb.js

"use client"; // This component needs to be rendered on the client side

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { defaultProfileURL } from "@/configs/constants";

const Breadcrumb = ({ homeImage, homeTitle, customTexts }) => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const basePath = `/client/${segments[1]}`;

    return (
        <nav className="flex p-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li>
                    <Link
                        href={`/client/${segments[1]}`}
                        className="flex items-center text-gray-700 hover:text-blue-600"
                    >
                        <Image
                            src={homeImage || defaultProfileURL}
                            alt="Home"
                            width={20}
                            height={20}
                            className="mr-2 rounded-full w-10"
                        />
                        <span className="font-medium">{homeTitle}</span>
                    </Link>
                </li>
                {segments.slice(2).map((segment, index) => {
                    const href = `${basePath}/${segments
                        .slice(2, index + 3)
                        .join("/")}`;
                    return (
                        <li key={index} className="flex items-center">
                            <IoIosArrowForward className="text-gray-400" />
                            <Link
                                href={href}
                                className={`ml-2 font-extrabold underline ${
                                    index === segments.slice(2).length - 1
                                        ? "gradient-animation bg-clip-text"
                                        : "text-gray-700 hover:text-blue-600"
                                }`}
                            >
                                {customTexts[index] || segment}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
