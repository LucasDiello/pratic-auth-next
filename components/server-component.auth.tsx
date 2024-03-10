import { getCurrentUser } from "@/lib/session"

export default async function ServerComponentAuth() {
    const user = await getCurrentUser()

    return <>
        {!!user && (
            <div className="bg-slate-500 text-white border-2 h-60 max-w-md overflow-scroll">
                <h2>Server Component</h2>
                {JSON.stringify(user)}
            </div>
        )}
    </>
}