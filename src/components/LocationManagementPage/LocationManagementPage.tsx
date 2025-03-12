import LocationContainer from "@/src/containers/LocationContainer";
import { useEffect, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import styles from "./LocationManagementPage.module.css";
import { Button } from "@radix-ui/themes";
import AddIcon from "@mui/icons-material/Add";
import LocationCard from "../LocationCard/LocationCard";
import { LocationDTO } from "@/src/models/locations/LocationDTO";
import AddLocationModal from "../AddLocationModal/AddLocationModal";
import EditLocationModal from "../EditLocationModal/EditLocationModal";

const LocationManagementPage: React.FC = () => {
  const {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    initializeFromRemote: initializeLocationsFromRemote,
  } = LocationContainer.useContainer();

  const [isAddLocationsModalOpen, setIsAddLocationsModalOpen] = useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    LocationDTO | undefined
  >(undefined);

  useEffect(() => {
    initializeLocationsFromRemote();
  }, []);

  const handleAddLocationSubmit = (data: LocationDTO) => {
    createLocation(data);
    setIsAddLocationsModalOpen(false);
  };

  const handleDeleteLocation = (locationId: string) => {
    deleteLocation(locationId);
  };

  const handleEditLocationSubmit = (data: LocationDTO) => {
    updateLocation(data);
    setIsEditLocationModalOpen(false);
  };

  return (
    <div className={styles.layout}>
      <NavigationBar
        selectedAppId="location-management"
        secondaryTitle="Location Management"
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles["header-right"]}>
            <Button onClick={() => setIsAddLocationsModalOpen(true)}>
              <AddIcon />
              Add Location to Shelter
            </Button>
          </div>
        </div>

        <h2>Active Locations</h2>
        <div className={styles.locations}>
          <div className={styles["section-content"]}>
            {locations?.map((location: LocationDTO) => (
              <LocationCard
                key={location.id}
                location={location}
                onEdit={() => {
                  setIsEditLocationModalOpen(true);
                  setSelectedLocation(location);
                }}
                onDelete={() => handleDeleteLocation(location.id ?? "")}
              />
            ))}
          </div>
        </div>
      </div>
      <AddLocationModal
        onSubmit={handleAddLocationSubmit}
        isOpen={isAddLocationsModalOpen}
        setIsOpen={setIsAddLocationsModalOpen}
      />
      <EditLocationModal
        isOpen={isEditLocationModalOpen}
        setIsOpen={setIsEditLocationModalOpen}
        onSubmit={handleEditLocationSubmit}
        initialData={selectedLocation}
      />
    </div>
  );
};

export default LocationManagementPage;
