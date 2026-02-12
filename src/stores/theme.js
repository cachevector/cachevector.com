import { writable } from "svelte/store";

function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function createThemeStore() {
  const { subscribe, update } = writable(getInitialTheme());

  return {
    subscribe,
    toggle() {
      update(current => {
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem("theme", next);
        if (next === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        return next;
      });
    },
  };
}

export const theme = createThemeStore();
