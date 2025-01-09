import { SideBarButton } from '@/components/ui/SideBarButton';
import Avatar from '../participants/Avatar';

export function SideBarHuntCreator () {


    return (
        <div className="relative flex h-screen w-[10vw] transition-all flex-col items-center justify-end bg-primary">
            <SideBarButton name={'castle'} link={'/organisateurs/chateaux'} imagePath={'/castle.svg'} />
            <SideBarButton name={'chest'} link={'/organisateurs/chasses'} imagePath={'/chest.svg'} />
            <SideBarButton name={'dashboard'} link={'/organisateurs'} imagePath={'/dashboard.svg'} />
            <SideBarButton name={'create'} link={'/organisateurs/creation_chasse'} imagePath={'create.svg'} />
            <Avatar />
        </div>
    );
}
