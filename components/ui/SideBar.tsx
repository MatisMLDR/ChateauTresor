import { SideBarButton } from '@/components/ui/SideBarButton';
import Avatar from '../participants/Avatar';

export function SideBar() {


  return (
    <div className="relative flex h-screen w-[10vw] transition-all flex-col items-center justify-end bg-primary">
      <SideBarButton name={'book'} link={'/participants/historique'} imagePath={'/book.svg'} />
      <SideBarButton name={'map'} link={'/participants'} imagePath={'/map.svg'} />
      <SideBarButton name={'castle'} link={'/participants/chateaux'} imagePath={'/castle.svg'} />
      <SideBarButton name={'chest'} link={'/participants/chasses'} imagePath={'/chest.svg'} />
      <Avatar />
    </div>
  );
}
