// CATEGORY
import { DeleteCategoryModal } from "@/components/modal/admin/category/delete-category.modal"

// CHAPTER
import { DeleteChapterModal } from "@/components/modal/admin/course/delete-chapter.modal"

// COURSE
import { DeleteCourseModal } from "@/components/modal/admin/course/delete-course.modal"

export const ModalProvider = () => {
    return (
        <>
            {/* CATEGORY */}
            <DeleteCategoryModal />

            {/* CHAPTER */}
            <DeleteChapterModal />

            {/* COURSE */}
            <DeleteCourseModal />
        </>
    )
}