type SensitiveFields = {
  [key: string]: boolean;
};

const sensitiveFields: SensitiveFields = {
  password: true,
  email: true,
  code: true,
  token: true,
  cellphone: true,
  telefone: true,
  cpf: true,
  cnpj: true,
};

export const sanitizeData = (data: unknown): unknown => {
  if (!data) return data;

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> | unknown[] = Array.isArray(data)
      ? []
      : {};

    Object.keys(data).forEach((key) => {
      if (sensitiveFields[key.toLowerCase()]) {
        (sanitized as Record<string, unknown>)[key] = "***REMOVED***";
      } else if (typeof (data as Record<string, unknown>)[key] === "object") {
        (sanitized as Record<string, unknown>)[key] = sanitizeData(
          (data as Record<string, unknown>)[key],
        );
      } else {
        (sanitized as Record<string, unknown>)[key] = (
          data as Record<string, unknown>
        )[key];
      }
    });

    return sanitized;
  }

  return data;
};
