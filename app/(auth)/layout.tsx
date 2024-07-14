interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({children}:Props) => {
    return (
        <section className="h-screen w-full flex justify-center items-center">
            {children}
        </section>
    )
}

export default AuthLayout