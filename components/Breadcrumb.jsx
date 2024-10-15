// components/Breadcrumb.js

"use client"; // This component needs to be rendered on the client side

import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumb = ({ customTexts }) => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); // Split the path into segments

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
                        Client
                    </Link>
                </li>
                {segments.slice(2).map((segment, index) => {
                    const href = `${basePath}/${segments
                        .slice(2, index + 2)
                        .join("/")}`; // Build the breadcrumb link
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
