import { useCallback } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import en from "./en.json";
import tr from "./tr.json";

const translations: Record<string, Record<string, string>> = { en, tr };

export function useI18n() {
  const language = useSettingsStore((s) => s.language);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  return { t, language };
}
