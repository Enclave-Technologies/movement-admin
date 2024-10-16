// components/Breadcrumb.js

"use client"; // This component needs to be rendered on the client side

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Breadcrumb = ({ homeImage, homeTitle, customTexts }) => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); // Split the path into segments
    console.log(segments);
    // Base path for the breadcrumbs assuming the first segment after the base URL is the client ID
    const basePath = `/client/${segments[1]}`; // segments[1] corresponds to the [id]

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {/* Home link */}
                <li>
                    <Link
                        href={`/client/${segments[1]}`}
                        className="text-gray-700 hover:text-blue-600"
                    >
                        <Image
                            unoptimized
                            src={homeImage}
                            alt="Home"
                            width={20}
                            height={20}
                        />
                        <span>{homeTitle}</span>
                    </Link>
                </li>
                {segments.slice(2).map((segment, index) => {
                    const href = `${basePath}/${segments
                        .slice(2, index + 3)
                        .join("/")}`; // Build the breadcrumb link
                    // console.log(
                    //     "Inside segment creation ",
                    //     segments.slice(2, 3),
                    //     index,
                    //     href
                    // );
                    return (
                        <li key={index}>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <Link
                                    href={href}
                                    className="ml-1 text-gray-700 hover:text-blue-600"
                                >
                                    {customTexts[index] || segment}{" "}
                                    {/* Use custom text if available */}
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
