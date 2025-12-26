import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const get = useCallback(
    (key: string, fallback: string | null = null): string | null => {
      return params.get(key) ?? fallback;
    },
    [params]
  );

  const set = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(params.toString());
      if (value === null || value === "") newParams.delete(key);
      else newParams.set(key, value);
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [params, pathname, router]
  );

  return { get, set };
}
