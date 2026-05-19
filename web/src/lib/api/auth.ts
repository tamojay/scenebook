import type { User, LoginInput, SignupInput } from "@/features/auth/types";

const STORAGE_KEY = "scenebook:current_user";

// Fake delay so the UI feels real (loading states, etc.)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  async login(input: LoginInput): Promise<User> {
    await delay(600);
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async signup(input: SignupInput): Promise<User> {
    await delay(600);
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
