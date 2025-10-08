import type { UseFormSetError } from "react-hook-form";

// Very small helper to map API error shape to RHF setError calls
// NOTE: we accept a loose any here because API error shapes vary and callers typically
// pass the exact UseFormSetError for their form data type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiToFormError(
  setError: UseFormSetError<any>,
  error: unknown
) {
  if (!error || typeof error !== "object") {
    setError("root", { message: "Erro inesperado" });
    return;
  }

  // Axios style
  if ("response" in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resp = (error as any).response;
    const data = resp?.data;
    if (data) {
      if (typeof data === "string") {
        setError("root", { message: data });
        return;
      }
      if (data.errors) {
        // Prefer setting a single representative message on the form root
        const firstKey = Object.keys(data.errors)[0];
        const msg = Array.isArray(data.errors[firstKey])
          ? data.errors[firstKey][0]
          : data.errors[firstKey];
        setError("root", { message: String(msg) });
        return;
      }
      if (data.message) {
        setError("root", { message: data.message });
        return;
      }
    }
  }

  // Fallback
  setError("root", { message: "Erro ao processar a requisição" });
}

export default mapApiToFormError;
