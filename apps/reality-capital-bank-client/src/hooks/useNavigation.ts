import { useAuthStore } from "@/store/auth.store";
import { navigation } from "@/config/navigation";
import { ROLES } from "@/lib/constants";

export function useNavigation() {
  const user = useAuthStore((state) => state.user);

  return (
    navigation[user?.role.name as keyof typeof navigation] ??
    navigation[ROLES.CUSTOMER]
  );
}
