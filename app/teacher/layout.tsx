import { AppKnockProviders } from "@/providers/knock-provider"
import TeacherLayoutPanel from "./_components/layout"
import { getUser } from "@/services/user.service"

const TeacherLayout = async ({ children }: React.PropsWithChildren) => {
    const {userId} = await getUser()

    return (
        <AppKnockProviders userId={userId}>
            <TeacherLayoutPanel>{children}</TeacherLayoutPanel>
        </AppKnockProviders>
    )
}

export default TeacherLayout