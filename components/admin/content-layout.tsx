import { Navbar } from "./layout/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container p-2 md:p-4 space-y-2">{children}</div>
    </div>
  );
}