import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET || "fallback_secret_change_me_in_production";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(user: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ 
    id: user.id, 
    email: user.email, 
    role: user.role,
    name: user.name 
  });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true, secure: true });
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession(cookieValue?: string) {
  if (cookieValue) {
    try {
      return await decrypt(cookieValue);
    } catch (err) {
      return null;
    }
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = new Response();
  res.headers.set(
    "Set-Cookie",
    `session=${await encrypt(parsed)}; HttpOnly; Path=/; Expires=${parsed.expires.toUTCString()}; Secure`
  );
  return res;
}
