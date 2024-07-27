import type { Metadata } from "next";
import { ChapterDetails } from "./_components/chapter";

export const metadata: Metadata = {
    title: "E-Learn | Chapter",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
}

const Chapter = ({ params: { id, chapterId } }: Props) => {
    return (
        <ChapterDetails id={id} chapterId={chapterId} />
    )
}

export default Chapter
