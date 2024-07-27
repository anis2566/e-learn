import { AppKnockProviders } from "@/providers/knock-provider"
import TeacherLayoutPanel from "./_components/layout"

const TeacherLayout = async ({ children }: React.PropsWithChildren) => {
    return (
        <AppKnockProviders>
            <TeacherLayoutPanel>{children}</TeacherLayoutPanel>
        </AppKnockProviders>
    )
}

export default TeacherLayout