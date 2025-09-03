import { vars } from "nativewind";


export const Colors = {

    light : {
        primary: {
            100: "#F3F4F6",
            200: "#022108",
            300: "#D1D5DB",
            400: "#9CA3AF",
        },
        secondary: {
            100: "#FEE2E2",
            200: "#FCA5A5",
            300: "#F87171",
            400: "#EF4444",
        },
        neutral: {
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
        },
        background: "#FFFFFF",
        text: "#000000",
        border: "#E5E7EB",
        error: "#EF4444",
        success: "#10B981",
        warning: "#FBBF24", 
    },
    dark : {
        primary: {
            100: "#1F2937",
            200: "#374151",
            300: "#4B5563",
            400: "#6B7280",
        },
        secondary: {
            100: "#FEE2E2",
            200: "#FCA5A5",
            300: "#F87171",
            400: "#EF4444",
        },
        neutral: {
            100: "#1F2937",
            200: "#374151",
            300: "#4B5563",
            400: "#6B7280",
        },
    }
}

export const themes = {
  light: vars({
    '--color-primary-0': '0 175 0',
    '--color-primary-50': '198 246 213',
    '--color-primary-100': '154 230 180',
    '--color-primary-200': '104 211 145',
    '--color-primary-300': '72 187 120',
    '--color-primary-400': '56 161 105',
    '--color-primary-500': '47 133 90',
    '--color-secondary': '0 0 0',
    '--color-text': '0 0 0',

  }),
   dark: vars({
    '--color-primary-0': '0 0 0',
    '--color-primary-50': '0 0 0',
    '--color-primary-100': '0 0 0',
    '--color-primary-200': '26 26 26',
    '--color-primary-300': '51 51 51',
    '--color-primary-400': '51 51 51',
    '--color-primary-500': '51 51 51',
    '--color-secondary': '255 255 255',
    '--color-text': '255 255 255',
   })
};