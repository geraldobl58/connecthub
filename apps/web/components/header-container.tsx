import { SidebarTrigger } from "./ui/sidebar";

interface ProjectHeaderProps {
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
}

export const HeaderContainer = ({
  title,
  subtitle,
  content,
}: ProjectHeaderProps) => {
  return (
    <header className="flex items-center justify-between shadow-md p-3 mb-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        {(title || subtitle) && (
          <div className="flex flex-col">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">{content}</div>
    </header>
  );
};
