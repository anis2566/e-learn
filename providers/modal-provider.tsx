// CATEGORY
import { DeleteCategoryModal } from "@/components/modal/admin/category/delete-category.modal"

// CHAPTER
import { DeleteChapterModal } from "@/components/modal/admin/course/delete-chapter.modal"

// COURSE
import { DeleteCourseModal } from "@/components/modal/admin/course/delete-course.modal"

// TEACHER
import { TeacherStatusModal } from "@/app/admin/teacher/request/_components/status-modal"
import TeacherDeleteModal from "@/app/admin/teacher/request/_components/delete-modal"
import { QuestionReplyModal } from "@/app/teacher/courses/[id]/chapters/[chapterId]/_components/reply-modal"
import { StudentQuestionReplyModal } from "@/app/dashboard/courses/[id]/chapters/[chapterId]/_components/reply-modal"
import { DeleteQuestionModal } from "@/app/admin/question/[id]/_components/delete-modal"
import { DeleteReplyModal } from "@/app/admin/question/[id]/_components/delete-reply-modal"


export const ModalProvider = () => {
    return (
        <>
            {/* CATEGORY */}
            <DeleteCategoryModal />

            {/* CHAPTER */}
            <DeleteChapterModal />

            {/* COURSE */}
            <DeleteCourseModal />

            {/* Teacher */}
            <TeacherStatusModal />
            <TeacherDeleteModal />
            <QuestionReplyModal />
            <StudentQuestionReplyModal />
            <DeleteQuestionModal />
            <DeleteReplyModal />
        </>
    )
}