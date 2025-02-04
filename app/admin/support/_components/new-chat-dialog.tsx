"use client"

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useDebounce } from "@/hooks/use-debounce";

interface NewChatDialogProps {
    onOpenChange: (open: boolean) => void;
    onChatCreated: () => void;
}

export default function NewChatDialog({
    onOpenChange,
    onChatCreated,
}: NewChatDialogProps) {
    const { client, setActiveChannel } = useChatContext();
    const { user } = useUser()

    if (!user || !user.id) redirect("/dashboard")

    const [searchInput, setSearchInput] = useState<string>("");
    const searchInputDebounced = useDebounce(searchInput);

    const [selectedUsers, setSelectedUsers] = useState<
        UserResponse<DefaultStreamChatGenerics>[]
    >([]);

    const { data, isFetching, isError, isSuccess } = useQuery({
        queryKey: ["stream-users", searchInputDebounced],
        queryFn: async () =>
            client.queryUsers(
                {
                    id: { $ne: user.id },
                    role: { $ne: "admin" },
                    ...(searchInputDebounced
                        ? {
                            $or: [
                                { name: { $autocomplete: searchInputDebounced } },
                                { username: { $autocomplete: searchInputDebounced } },
                            ],
                        }
                        : {}),
                },
                { name: 1, username: 1 },
                { limit: 15 },
            ),
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const channel = client.channel("messaging", {
                members: [user.id, ...selectedUsers.map((u) => u.id)],
                name:
                    selectedUsers.length > 1
                        ? user.fullName +
                        ", " +
                        selectedUsers.map((u) => u.name).join(", ")
                        : undefined,
            });
            await channel.create();
            return channel;
        },
        onSuccess: (channel) => {
            setActiveChannel(channel);
            onChatCreated();
        },
        onError(error) {
            console.error("Error starting chat. Please try again.");
        },
    });

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="group relative">
                        <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
                        <input
                            placeholder="Search users..."
                            className="h-12 w-full pe-4 ps-14 focus:outline-none"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {!!selectedUsers.length && (
                        <div className="mt-4 flex flex-wrap gap-2 p-2">
                            {selectedUsers.map((user) => (
                                <SelectedUserTag
                                    key={user.id}
                                    user={user}
                                    onRemove={() => {
                                        setSelectedUsers((prev) =>
                                            prev.filter((u) => u.id !== user.id),
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <hr />
                    <div className="h-96 overflow-y-auto">
                        {isSuccess &&
                            data.users.map((user) => (
                                <UserResult
                                    key={user.id}
                                    user={user}
                                    selected={selectedUsers.some((u) => u.id === user.id)}
                                    onClick={() => {
                                        setSelectedUsers((prev) =>
                                            prev.some((u) => u.id === user.id)
                                                ? prev.filter((u) => u.id !== user.id)
                                                : [...prev, user],
                                        );
                                    }}
                                />
                            ))}
                        {isSuccess && !data.users.length && (
                            <p className="my-3 text-center text-muted-foreground">
                                No users found. Try a different name.
                            </p>
                        )}
                        {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
                        {isError && (
                            <p className="my-3 text-center text-destructive">
                                An error occurred while loading users.
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter className="px-6 pb-6">
                    <Button
                        disabled={!selectedUsers.length}
                        onClick={() => mutation.mutate()}
                    >
                        Start chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


interface UserResultProps {
    user: UserResponse<DefaultStreamChatGenerics>;
    selected: boolean;
    onClick: () => void;
}

function UserResult({ user, selected, onClick }: UserResultProps) {
    return (
        <button
            className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={user.image} className="h-8 w-8" />
                </Avatar>
                <div className="flex flex-col text-start">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-muted-foreground">@{user.username}</p>
                </div>
            </div>
            {selected && <Check className="size-5 text-green-500" />}
        </button>
    );
}


interface SelectedUserTagProps {
    user: UserResponse<DefaultStreamChatGenerics>;
    onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
    return (
        <button
            onClick={onRemove}
            className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
        >
            <Avatar>
                <AvatarImage src={user.image} className="h-8 w-8" />
            </Avatar>
            <p className="font-bold">{user.name}</p>
            <X className="mx-2 size-5 text-muted-foreground" />
        </button>
    );
}