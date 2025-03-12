import UserContainer from "@/src/containers/UsersContainer";
import { useEffect, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import styles from "./UserManagementPage.module.css";
import { Button } from "@radix-ui/themes";
import AddIcon from "@mui/icons-material/Add";
import UserCard from "../UserCard/UserCard";
import AddUsersModal from "../AddUsersModal/AddUsersModal";
import ShelterContainer from "@/src/containers/ShelterContainer";
import CreateUpdateShelterUserInviteDTO from "@/src/models/shelters/CreateUpdateShelterUserInvite";
import EditUsersModal from "../EditUsersModal/EditUsersModal";
import UserDTO from "@/src/models/users/UserDTO";

const UserManagementPage: React.FC = () => {
  const { users, initializeFromRemote: initializeUsersFromRemote } =
    UserContainer.useContainer();

  const {
    shelterInvites,
    createShelterUserInvite,
    getAllShelterUserInvites,
    updateShelterUser,
    deleteShelterUser,
    deleteShelterUserInvite,
  } = ShelterContainer.useContainer();
  const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | undefined>(
    undefined
  );

  useEffect(() => {
    getAllShelterUserInvites();
    initializeUsersFromRemote();
  }, []);

  const handleAddUserSubmit = (data: CreateUpdateShelterUserInviteDTO) => {
    createShelterUserInvite(data);
    setIsAddUsersModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    deleteShelterUser(userId);
  };

  const handleDeleteShelterUserInvite = (email: string) => {
    deleteShelterUserInvite(email);
  };

  const handleEditUserSubmit = (data: CreateUpdateShelterUserInviteDTO) => {
    updateShelterUser(selectedUser?.id ?? "", data);
  };

  return (
    <div className={styles.layout}>
      <NavigationBar
        selectedAppId="user-management"
        secondaryTitle="User Management"
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles["header-right"]}>
            <Button onClick={() => setIsAddUsersModalOpen(true)}>
              <AddIcon />
              Add Users to Shelter
            </Button>
          </div>
        </div>

        <h2>Active Users</h2>
        <div className={styles.users}>
          <div className={styles["section-content"]}>
            {users?.map((user) => (
              <UserCard
                key={user.id}
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                onEdit={() => {
                  setIsEditUserModalOpen(true);
                  setSelectedUser(user);
                }}
                onDelete={() => handleDeleteUser(user.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2> Pending Invites</h2>
          <ul>
            {shelterInvites?.length > 0 &&
              shelterInvites.map((invite) => (
                <li key={invite.id}>
                  <UserCard
                    key={invite.id}
                    email={invite.email}
                    onDelete={() => handleDeleteShelterUserInvite(invite.email)}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
      <AddUsersModal
        onSubmit={handleAddUserSubmit}
        isOpen={isAddUsersModalOpen}
        setIsOpen={setIsAddUsersModalOpen}
      />
      <EditUsersModal
        isOpen={isEditUserModalOpen}
        setIsOpen={setIsEditUserModalOpen}
        onSubmit={handleEditUserSubmit}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UserManagementPage;
