import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class OboardingStore {
  userData = {
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
  };

  barbershopData = {
    name: "",
    owner: "",
    phone: "",
    email: "",
    // data de fundação
    foundationDate: {
      month: "",
      year: "",
    },
    address: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      state: "",
    },
    businessHours: {
      opening: "",
      closing: "",
    },
    howFound: "", // Added field
    expectations: "", // Added field
  };

  constructor() {
    // Torna a store observável
    makePersistable(this, {
      name: "OboardingStore",
      expireIn: 86400, // 24 horas em segundos
      properties: ["userData", "barbershopData"],
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    });

    makeObservable(this, {
      userData: observable,
      setUserData: action.bound,
      barbershopData: observable,
      setBarbershopData: action.bound,
    });
  }

  setUserData(userData: {
    firstName: string;
    lastName: string;
    email: string;
    cellphone: string;
  }) {
    this.userData = { ...this.userData, ...userData };
  }

  setBarbershopData(barbershopData: {
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
      complement: string;
      neighborhood: string;
      state: string;
    };
    businessHours?: {
      opening: string;
      closing: string;
    };
    howFound?: string; // Added field
    expectations?: string; // Added field
  }) {
    this.barbershopData = { ...this.barbershopData, ...barbershopData };
  }
}

const OnboardingStore = new OboardingStore();
export default OnboardingStore;
