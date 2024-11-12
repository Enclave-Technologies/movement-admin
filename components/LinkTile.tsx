import Link from "next/link";

const LinkTile = ({
    href,
    label,
    stat,
    isLoading,
    className,
}: {
    href: string;
    label: string;
    stat: string;
    isLoading: boolean;
    className?: string;
}) => {
    const content = (
        <div
            className={`${className} ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            <p className="font-bold text-xl text-center">{label}</p>
            <p className="text-sm font-bold text-center">{stat}</p>
        </div>
    );

    if (isLoading) {
        return content;
    }

    return <Link href={href}>{content}</Link>;
};

export default LinkTile;
