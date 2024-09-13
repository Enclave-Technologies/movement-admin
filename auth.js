import { cookies } from "next/headers";
import {
  createAdminClient,
  createSessionClient,
} from "./configs/appwriteConfig";
import { redirect } from "next/navigation";

const auth = {
  user: null,
  sessionCookie: null,

  getUser: async () => {
    auth.sessionCookie = cookies().get("movement-session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      auth.user = await account.get();
    } catch (error) {
      console.error(error);
      auth.user = null;
      auth.sessionCookie = null;
    }
    return auth.user;
  },

  createSession: async (formData) => {
    "use server";
    const data = Object.fromEntries(formData);
    const { email, password } = data;
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("movement-session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    redirect("/");
  },

  deleteSession: async () => {
    "use server";
    auth.sessionCookie = cookies().get("movement-session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      await account.deleteSession("current");
    } catch (error) {}
    cookies().delete("movement-session");
    auth.user = null;
    auth.sessionCookie = null;
    redirect("/login");
  },
};

export default auth;