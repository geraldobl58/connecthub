import Image from "next/image";

export const AvatarDisplay = ({
  avatar,
  initials,
  size = "sm",
}: {
  avatar?: string | null;
  initials: string;
  size?: "sm" | "md";
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
  };

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt="User avatar"
        width={96}
        height={96}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-300`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
    >
      {initials}
    </div>
  );
};
