import { api } from "../api/axios-config";
import type { IBarbershop } from "@/types/barbershop";
import OnboardingStore from "@/stores/OnboardingStore";

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

interface IBarbershopPayload {
  name: string;
  phone: string;
  email: string;
  userEmail: string; // Add this field
  foundationDate: {
    month: number;
    year: number;
  };
  address: {
    zipCode: string;
    street: string;
    city: string;
    state: string;
  };
  businessHours: {
    openTime: string;
    closeTime: string;
  };
  expectation: string;
  foundUsOn: string;
}

const create = async (
  barbershopData: IBarbershop,
): Promise<IBarbershopPayload | Error> => {
  try {
    // Transform the data to match API contract
    const payload: IBarbershopPayload = {
      name: barbershopData.name,
      phone: barbershopData.phone,
      email: barbershopData.email,
      userEmail: OnboardingStore.userData.email, // Add user email from store
      foundationDate: {
        month: Number(barbershopData.foundationDate.month),
        year: Number(barbershopData.foundationDate.year),
      },
      address: {
        zipCode: barbershopData.address.zipCode,
        street: barbershopData.address.street,
        city: barbershopData.address.neighborhood, // map neighborhood to city
        state: barbershopData.address.state,
      },
      businessHours: {
        openTime: barbershopData.businessHours.opening,
        closeTime: barbershopData.businessHours.closing,
      },
      expectation: barbershopData.expectations || "",
      foundUsOn: barbershopData.howFound || "",
    };

    const { data } = await api.post<IBarbershopPayload>(
      "/tenants/barbershops/register",
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.response?.data) {
      const error = new Error(
        apiError.response.data.message +
          (apiError.response.data.code
            ? ` (code: ${apiError.response.data.code})`
            : ""),
      );
      return error;
    }
    return new Error("Erro ao criar barbearia");
  }
};

export const BarbershopService = {
  create,
};
