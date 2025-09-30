interface HeaderProps {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export const Header = ({ title, description, content }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b w-full h-[55px] px-6 py-3 bg-white">
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div>{content && content}</div>
    </header>
  );
};
