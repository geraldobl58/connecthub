import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link passHref href="/">
      <Image src="/assets/images/logo.svg" alt="Logo" width={30} height={30} />
    </Link>
  );
};
