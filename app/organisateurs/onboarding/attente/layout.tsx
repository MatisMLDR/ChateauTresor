import { SideBarMenu } from '@/components/ui/SideBarMenu';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SideBarMenu type={"organisateur"}>{children}</SideBarMenu>
  );
};

export default Layout;