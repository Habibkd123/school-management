export interface ValidationField {
  id: string;        // Element ID or name attribute to focus/scroll to
  value: any;        // Field value to check
  label: string;     // Field label (e.g. "First Name")
  customValidate?: (val: any) => boolean | string; // Optional custom validation check
}

export function validateSequential(fields: ValidationField[]): { isValid: boolean; fieldId?: string; error?: string } {
  for (const field of fields) {
    let isInvalid = false;
    let customMsg = "";

    if (field.customValidate) {
      const res = field.customValidate(field.value);
      if (typeof res === "string") {
        isInvalid = true;
        customMsg = res;
      } else if (res === false) {
        isInvalid = true;
      }
    } else {
      if (
        field.value === undefined ||
        field.value === null ||
        (typeof field.value === "string" && field.value.trim() === "")
      ) {
        isInvalid = true;
      }
    }

    if (isInvalid) {
      const errorMsg = customMsg || `${field.label} is required.`;

      // Trigger deferred focus/scroll
      setTimeout(() => {
        const element = document.getElementById(field.id) || document.querySelector(`[name="${field.id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          (element as HTMLElement).focus();
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            const val = element.value;
            element.value = "";
            element.value = val; // places cursor at the end
          }
        }
      }, 50);

      return { isValid: false, fieldId: field.id, error: errorMsg };
    }
  }
  return { isValid: true };
}
