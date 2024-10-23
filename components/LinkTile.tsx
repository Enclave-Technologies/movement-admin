import Link from "next/link";

const LinkTile = ({
    href,
    label,
    stat,
    className,
}: {
    href: string;
    label: string;
    stat: string;
    className?: string; // Make className optional
}) => {
    return (
        <Link href={href}>
            <div className={`${className}`}>
                <p className="font-bold text-xl text-center">{label}</p>
                <p className="text-sm font-bold text-center">{stat}</p>
            </div>
        </Link>
    );
};

export default LinkTile;
