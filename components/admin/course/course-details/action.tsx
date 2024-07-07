"use client";

import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useCourse } from "@/hooks/use-course";
import { PUBLISH_COURSE, UNPUBLISH_COURSE } from "@/actions/course.action";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

export const Actions = ({
  disabled,
  courseId,
  isPublished
}: ActionsProps) => {
  const { onOpen } = useCourse()

  const { mutate: publishCourse, isPending } = useMutation({
    mutationFn: PUBLISH_COURSE,
    onSuccess: (data) => {
      toast.success(data?.success, {
        id: "publish-course"
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "publish-course"
      });
    }
  })

  const { mutate: unpublishCourse, isPending: isLoading } = useMutation({
    mutationFn: UNPUBLISH_COURSE,
    onSuccess: (data) => {
      toast.success(data?.success, {
        id: "unpublish-course"
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "unpublish-course"
      });
    }
  })

  const togglePublisth = () => {
    if (isPublished) {
      toast.loading("Chapter unpublishing...", {
        id: "unpublish-course"
      })
      unpublishCourse(courseId)
    } else {
      toast.loading("Chapter publishing...", {
        id: "publish-course"
      })
      publishCourse(courseId)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isPending || isLoading}
        variant="outline"
        size="sm"
        onClick={togglePublisth}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onOpen(courseId)}>
              <Trash2 className="text-rose-500 w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete course</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 