import { api } from '../api/axios-config';
import type { IUser, IUserCreate } from '@/types/user';

const create = async (userData: IUserCreate): Promise<IUser | Error> => {
  console.log(api, userData, );
  
  try {
    const { data } = await api.post<IUser>('/tenants/register', userData);
    console.log(data);
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return new Error((error as { message: string }).message || 'Erro ao criar usuário.');
  }
};

interface IVerifyEmail {
  email: string;
  code: string;
}

const verifyEmail = async (data: IVerifyEmail): Promise<void | Error> => {
  try {
    await api.post('/tenants/verify-email', data);
  } catch (error) {
    console.error('Error verifying email:', error);
    return new Error((error as { message: string }).message || 'Erro ao verificar email.');
  }
};

interface IResendCodeRequest {
  email: string;
}

const resendVerificationCode = async (data: IResendCodeRequest): Promise<void | Error> => {
  try {
    await api.post('/tenants/resend-verification', { email: data.email });
  } catch (error) {
    console.error('Error resending verification code:', error);
    return new Error((error as { message: string }).message || 'Erro ao reenviar código.');
  }
};

const UsersService = {
  create,
  verifyEmail,
  resendVerificationCode,
};

export { UsersService };