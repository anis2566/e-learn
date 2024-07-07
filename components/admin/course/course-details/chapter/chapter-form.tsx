import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Paperclip, Video } from "lucide-react";
import { Attachment, Chapter as PrismaChapter } from "@prisma/client";

import { Banner } from "@/components/admin/banner";
import { ChapterActions } from "./chapter-action";
import { IconBadge } from "../icon-badge";
import { ChapterTitleForm } from "./title-form";
import { ChapterDescriptionForm } from "./description-form";
import { ChapterAccessForm } from "./access-form";
import { ChapterAttachmentsForm } from "./attachment-form";
import { ChapterThumbnailForm } from "./thumbnail-form";
import { ChapterVideoForm } from "./video-form";

interface chapterWithAttachments extends PrismaChapter {
    attachments: Attachment[]
}

interface Props {
    chapter: chapterWithAttachments;
}

export const ChapterForm = async ({ chapter }: Props) => {
    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
        chapter.videoThumbnail
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    const { attachments, ...ChapterWithoutAttachments } = chapter;

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. It will not be visible in the course"
                />
            )}
            <div>
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/admin/course/${chapter.id}`}
                            className="flex items-center text-sm hover:opacity-75 transition my-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                isPublished={chapter.isPublished}
                                chapterId={chapter.id}
                                courseId={chapter.courseId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={ChapterWithoutAttachments}
                                courseId={chapter.courseId}
                                chapterId={chapter.id}
                            />
                            <ChapterDescriptionForm
                                initialData={ChapterWithoutAttachments}
                                courseId={chapter.courseId}
                                chapterId={chapter.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={ChapterWithoutAttachments}
                                courseId={chapter.courseId}
                                chapterId={chapter.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Paperclip} />
                                <h2 className="text-xl">
                                    Attachments
                                </h2>
                            </div>
                            <ChapterAttachmentsForm
                                attachments={chapter?.attachments}
                                chapterId={chapter.id}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video
                            </h2>
                        </div>
                        <ChapterThumbnailForm
                            initialData={ChapterWithoutAttachments}
                            chapterId={chapter.id}
                            courseId={chapter.courseId}
                        />
                        <ChapterVideoForm
                            initialData={ChapterWithoutAttachments}
                            chapterId={chapter.id}
                            courseId={chapter.courseId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
