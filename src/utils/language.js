import { useEffect, useState } from 'react'

export const DEFAULT_LANGUAGE = 'English'

export function getStoredLanguage() {
  return localStorage.getItem('userLanguage') || DEFAULT_LANGUAGE
}

export function useUserLanguage() {
  const [userLanguage, setUserLanguage] = useState(getStoredLanguage())

  useEffect(() => {
    function handlePrefsChange() {
      setUserLanguage(getStoredLanguage())
    }

    window.addEventListener('preferencesChanged', handlePrefsChange)
    window.addEventListener('storage', handlePrefsChange)

    return () => {
      window.removeEventListener('preferencesChanged', handlePrefsChange)
      window.removeEventListener('storage', handlePrefsChange)
    }
  }, [])

  return userLanguage
}

export function getText(map, language) {
  return map[language] || map[DEFAULT_LANGUAGE]
}
