export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  cellphone: string;
}

export interface IUserCreate extends Omit<IUser, 'id'> {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  cellphone: string;              
}