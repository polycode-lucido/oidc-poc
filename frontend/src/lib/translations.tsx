import I18n from 'i18n-js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as EnTranslation from '../locales/en/translations.json';
import * as FrTranslation from '../locales/fr/translations.json';

const DEFAULT_LOCALE_CODE = 'en';

const translations = {
  en: EnTranslation,
  fr: FrTranslation,
};

function saveToLocalStorage(locale: string) {
  localStorage.setItem('locale', locale);
}

function loadFromLocalStorage() {
  return localStorage.getItem('locale');
}

/*
  Translation context is used to pass translations to children.
*/
export const TranslationContext: React.Context<{
  locale: string;
  setLocale: (locale: string) => void;
  i18n: typeof I18n;
}> = React.createContext<{
  locale: string;
  setLocale: (locale: string) => void;
  i18n: typeof I18n;
}>({
  locale: DEFAULT_LOCALE_CODE,
  setLocale: (locale: string) => locale,
  i18n: I18n,
});

/*
  Translation provider is used to pass translations to children.
  manages current locale and provides translation object (i18n).
*/
export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, internalSetLocale] = useState(DEFAULT_LOCALE_CODE);

  const setLocale = useCallback((newLocale: string) => {
    if (!(newLocale in translations)) return;

    internalSetLocale(newLocale);
    saveToLocalStorage(newLocale);
  }, []);

  // set locale when changed

  const i18n = useMemo(() => {
    I18n.locale = locale;
    I18n.fallbacks = true;
    I18n.translations = translations;
    return I18n;
  }, [locale]);

  const context = useMemo(
    () => ({ locale, setLocale, i18n }),
    [i18n, locale, setLocale]
  );

  // load locale from user preferences or local storage

  useEffect(() => {
    const storedLocale = loadFromLocalStorage();

    // if a stored locale is present, use it
    if (storedLocale && storedLocale in translations) {
      internalSetLocale(storedLocale);
    }
    // otherwise, use the browser preferred locale
    else {
      const userLanguages = window.navigator.languages || [];

      const found = userLanguages.find((value) => value in translations);
      if (found) setLocale(found);
    }
  }, [setLocale]);

  return (
    <TranslationContext.Provider value={context}>
      {children}
    </TranslationContext.Provider>
  );
}

/*
  Retrieves the context of translation
*/
export function useTranslation() {
  const context = React.useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}

export function format(s: string, ...args: string[]): string {
  let result = s;
  for (let i = 0; i < args.length; i += 2) {
    result = result.replaceAll(args[i], args[i + 1]);
  }
  return result;
}
