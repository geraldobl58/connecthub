import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link passHref href="/">
      <Image
        src="/assets/images/logo.svg"
        alt="Connecthub"
        width={30}
        height={30}
      />
    </Link>
  );
};
