import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {InfoBadgeProps} from "@/types";

export function InformationBadge({children, buttonClassName, popupClassName, hoverText} : InfoBadgeProps) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${buttonClassName || `text-secondary bg-primary`} cursor-pointer`}>{children}</Badge>
          </TooltipTrigger>
          <TooltipContent className={popupClassName}>
            <p>{hoverText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
}
