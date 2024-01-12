export interface User {
  id: number;
  isActive: boolean;
  name: {
    first: string;
    last: string;
  };
  fullName: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  registrationDate: string;
}
