
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para aplicar contenção de layout a elementos do DOM
export function applyLayoutContainment(element: HTMLElement | null) {
  if (!element) return;
  
  element.style.contain = 'content';
  element.style.willChange = 'transform';
}

