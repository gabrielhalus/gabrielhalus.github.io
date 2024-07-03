import Project from "@/types/project";
import { BicepsFlexed, Brain, ToyBrick } from "lucide-react";

export const PROJECTS: Project[] = [
    {
        Icon: BicepsFlexed,
        title: "Trekha",
        slug: "trekha",
        description: "A collaborative Pomodoro timer with social features.",
        image: "",
        url: "",
    },
    {
        Icon: Brain,
        title: "Paperlive",
        slug: "paperlive",
        description: "A platform for tracking and analyzing research paper metrics.",
        image: "",
        url: "http://demo.paperlive.gabrielhalus.com",
    },
    {
        Icon: ToyBrick,
        title: "Let's go Lego",
        slug: "letsgo-lego",
        description: "An e-auction website focused on LEGO products.",
        image: "",
        url: "",
    },
]