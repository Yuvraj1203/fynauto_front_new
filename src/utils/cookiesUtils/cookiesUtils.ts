import { cookies } from "next/headers";

export async function setCookie(
  name: string,
  value: string,
  options: any = {}
) {
  const store = await cookies();
  store.set({
    name,
    value,
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7,
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? true,
    sameSite: options.sameSite ?? "lax",
  });
}

export async function getCookie(name: string) {
  const store = await cookies();
  return store.get(name)?.value;
}

export async function deleteCookie(name: string) {
  const store = await cookies();
  store.delete(name);
}

export async function hasCookie(name: string) {
  const store = await cookies();
  return store.has(name);
}

// GET ALL
export async function getAllCookies() {
  const store = await cookies();
  return store.getAll();
}

// DELETE ALL
export async function deleteAllCookies() {
  const store = await cookies();
  store.getAll().forEach((c) => store.delete(c.name));
}
