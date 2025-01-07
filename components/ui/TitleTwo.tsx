import {TitleTwoProps} from "@/types";

export function TitleTwo({ text, className, color}: TitleTwoProps) {
    return (
        <h2 className={`mb-4 text-center text-3xl font-bold tracking-tighter ${color === "dark" ? "text-primary" : "text-secondary"} sm:text-5xl ${className}`}>
            {text}
        </h2>
    );
}
