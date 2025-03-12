import { ShelterRole, ShelterUser, ShelterUserInvite } from "@prisma/client";

export interface CreateOrUpdateShelterDTO {
  id: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  shelterUsers: ShelterUser[];
  shelterRoles: ShelterRole[];
  shelterUserInvites: ShelterUserInvite[];
}
