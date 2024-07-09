import { LucideIcon } from "lucide-react"

import { Badge } from "./ui/badge";

interface ListBoxProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const ListBox = ({icon: Icon, title, description}:ListBoxProps) => {

    return (
        <div className="flex gap-x-4">
            <div className="bg-accent flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0">
                <Icon className="text-white" />
            </div>
            <div>
                <h4 className="font-semibold">{title}</h4>
                <Badge>{description}</Badge>
            </div>
        </div>
    )
}