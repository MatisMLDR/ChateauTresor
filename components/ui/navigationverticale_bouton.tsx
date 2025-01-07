import Image from "next/image";
import Link from "next/link";
import {NavigationVerticaleItemsProps} from "@/types";

export function NavigationVerticale_Bouton ({link, name, imagePath, className} : NavigationVerticaleItemsProps) {
    return (
        <Link href={link} className={`child border-t border-b border-secondary p-4 first:border-t-0 last:border-b-0 ${className}`}>
            <Image src={imagePath} alt={name} width={64} height={64}/>
        </Link>
    );
}
