import { HuntListItem } from "@/components/ui/HuntListItem";

export function HuntList () {


    return (
        <div className={"flex flex-col h-full overflow-auto gap-4 scroll-auto max-h-[400px] overflow-y-auto snap-y " +
            "scroll-px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700\ dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"}>
            <HuntListItem id={1} title={"Chasse 1"} winRate={95} imageUrl={"/logo.svg"} grade={2.5} />
            <HuntListItem id={1} title={"Chasse 1"} winRate={95} imageUrl={"/logo.svg"} grade={2.5} />
            <HuntListItem id={1} title={"Chasse 1"} winRate={95} imageUrl={"/logo.svg"} grade={2.5} />
            <HuntListItem id={1} title={"Chasse 1"} winRate={95} imageUrl={"/logo.svg"} grade={2.5} />
            <HuntListItem id={1} title={"Chasse 1"} winRate={95} imageUrl={"/logo.svg"} grade={2.5} />
        </div>
    );
}
