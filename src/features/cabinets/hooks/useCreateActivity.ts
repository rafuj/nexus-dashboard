import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createActivity } from "../api/activity.api"

export const useCreateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createActivity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      })
    },
  })
}