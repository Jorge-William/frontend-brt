export interface IBarbershop {
  name: string;
  owner: string;
  phone: string;
  email: string;
  foundationDate: {
    month: string;
    year: string;
  };
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    state: string;
  };
  businessHours: {
    opening: string;
    closing: string;
  };
  howFound?: string;
  expectations?: string;
}
