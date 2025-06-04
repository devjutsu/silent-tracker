import { Toaster } from "react-hot-toast";

export default function Bakery() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: 'var(--color-base-200)',
          color: 'var(--color-base-content)',
        },
        success: {
          style: {
            background: 'var(--color-success)',
            color: 'var(--color-success-content)',
          },
          iconTheme: {
            primary: 'var(--color-success-content)',
            secondary: 'var(--color-success)',
          },
        },
        error: {
          style: {
            background: 'var(--color-error)',
            color: 'var(--color-error-content)',
          },
          iconTheme: {
            primary: 'var(--color-error-content)',
            secondary: 'var(--color-error)',
          },
        },
        loading: {
          style: {
            background: 'var(--color-info)',
            color: 'var(--color-info-content)',
          },
          iconTheme: {
            primary: 'var(--color-info-content)',
            secondary: 'var(--color-info)',
          },
        },
      }}
    />
  );
}
