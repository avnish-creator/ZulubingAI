import { trpc } from "@/lib/trpc";

export function useAuth() {
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  return {
    user: meQuery.data ?? null,
    loading: meQuery.isLoading,
    error: meQuery.error,
    logout: () => logoutMutation.mutate(),
  };
}
