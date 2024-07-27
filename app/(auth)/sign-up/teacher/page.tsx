import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { TeacherForm } from "./_components/teacher-form"

const TeacherApply = () => {
    return (
        <section className="w-full max-w-screen-xl mx-auto">
            <div className="mx-4 md:mx-0 p-4 shadow-sm shadow-primary rounded-md space-y-4">
                <div className="space-y-2">
                    <div className="w-[80px] h-[80px] flex items-center justify-center rounded-full mx-auto ring-2 ring-secondary/60 p-2">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h4 className="text-2xl text-center font-bold tracking-widest">E-<span className="text-primary">Learn</span></h4>
                </div>

                <Separator />

                <div className="space-y-2">
                    <h2 className="text-xl text-center text-primary font-semibold">Application Form</h2>
                    <p className="text-center text-muted-foreground text-sm">Fill up the form to get complete registration.</p>
                </div>

                <TeacherForm />
            </div>
        </section>
    )
}

export default TeacherApply