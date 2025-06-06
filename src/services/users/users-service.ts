import { api } from "../api/axios-config";
import type { IUser, IUserCreate } from "@/types/user";

interface ApiError {
  response?: {
    data: {
      message: string;
      code: string;
      success: boolean;
    };
    status: number;
  };
}

const create = async (userData: IUserCreate): Promise<IUser | Error> => {
  try {
    const { data } = await api.post<IUser>("/tenants/register", userData);

    return data;
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.code === "EMAIL_ALREADY_EXISTS") {
      console.log("Email already exists:", apiError.response.data.message);
    }
    console.log(
      "🚀 ---------------------------------------------------------------------------------------------------🚀",
    );
    console.log(
      "🚀 : users-service.ts:24 : create : apiError.response.data.message/",
      apiError,
    );
    console.log(
      "🚀 ---------------------------------------------------------------------------------------------------🚀",
    );
    console.log("Error Response:", apiError.response?.data); // Better error logging

    if (apiError.response?.data) {
      return new Error(apiError.response.data.message);
    }

    return new Error("Erro ao criar usuário.");
  }
};

interface IVerifyEmail {
  email: string;
  code: string;
}

const verifyEmail = async (data: IVerifyEmail): Promise<void | Error> => {
  try {
    await api.post("/tenants/verify-email", data);
  } catch (error) {
    console.error("Error verifying email:", error);
    return new Error(
      (error as { message: string }).message || "Erro ao verificar email.",
    );
  }
};

interface IResendCodeRequest {
  email: string;
}

const resendVerificationCode = async (
  data: IResendCodeRequest,
): Promise<void | Error> => {
  try {
    await api.post("/tenants/resend-code", { email: data.email });
  } catch (error) {
    console.error("Error resending verification code:", error);
    return new Error(
      (error as { message: string }).message || "Erro ao reenviar código.",
    );
  }
};

const UsersService = {
  create,
  verifyEmail,
  resendVerificationCode,
};

export { UsersService };
