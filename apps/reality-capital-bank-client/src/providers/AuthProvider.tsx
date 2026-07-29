import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { socket } from "@/lib/socket";
// import { ROLES } from "@/lib/constants";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const { accessToken, setAccessToken, setUser, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!accessToken) {
          return;
        }

        const me = await authApi.me();

        setUser(me.data.data);

        socket.auth = {
          token: accessToken,
        };

        if (!socket.connected) {
          socket.connect();
        }
      } catch {
        try {
          const refresh = await authApi.refresh();

          const newToken = refresh.data.data.accessToken;

          setAccessToken(newToken);

          const me = await authApi.me();

          setUser(me.data.data);

          socket.auth = {
            token: newToken,
          };

          if (!socket.connected) {
            socket.connect();
          }
        } catch {
          logout();
          navigate("/login");
        }
      }
    };

    initialize();

    return () => {
      socket.disconnect();
    };
  }, [accessToken, logout, navigate, setAccessToken, setUser]);

  return <>{children}</>;
}
