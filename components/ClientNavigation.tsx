"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const ClientNavigation = () => {
  const path = usePathname();

  return (
    <nav className="w-full flex flex-row justify-start">
      <div className="flex flex-row items-center gap-4">
        <span>
          <IoIosArrowBack />
        </span>
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row items-center gap-1">
            <Image
              src="https://movementfitnesshk.com/wp-content/uploads/2024/07/Gina-Lai.png"
              height={60}
              width={60}
              className="object-cover rounded-full w-8 aspect-square"
              alt="Client Image"
            />
            <p>Richard Parker</p>
          </div>
          <span>
            <IoIosArrowForward />
          </span>
          <p>Personal Goals</p>
        </div>
      </div>
    </nav>
  );
};
