import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type TUser = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type TAuthContextData = {
  user: TUser | null;
  signInUrl: string;
  signOut: () => void;
};

type TAuthProvider = {
  children: ReactNode;
};

type TAuthenResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

export const AuthContext = createContext({} as TAuthContextData);

export function AuthProvider(props: TAuthProvider) {
  const [user, setUser] = useState<TUser | null>(null);

  const signInUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=d97e7ce498bbb6e7e6e2`;

  async function signIn(githubCode: string) {
    const response = await api.post<TAuthenResponse>("authenticate", {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem("@dowhile:token", token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<TUser>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
