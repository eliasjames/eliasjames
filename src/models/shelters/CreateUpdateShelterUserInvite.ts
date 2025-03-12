export default interface CreateUpdateShelterUserInviteDTO {
  id?: string;
  email: string;
  status?: string;
  isAdmin?: boolean;
  isVolunteer?: boolean;
  isStaff?: boolean;
  permissions?: string[];
}
