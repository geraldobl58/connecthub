import Cookies from "js-cookie";

const TOKEN_KEY = "auth-token";
const TOKEN_EXPIRES = 1; // 1 dia

export const cookieUtils = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRES,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken() {
    Cookies.remove(TOKEN_KEY);
  },

  hasToken(): boolean {
    return !!this.getToken();
  },
};
