import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./CreateUpdateAnimalModal.module.css";
import Modal from "../Shared/Modal/Modal";
import { Form } from "../Shared/Form/Form";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import { AdoptionStatus, IntakeCategory, Sex, Species } from "@prisma/client";
import Webcam from "react-webcam";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import formatDateToISO from "@/src/utils/formatDateToISO";
import { base64ToBlob } from "@/src/utils/base64ToBlob";
import { LocationDTO } from "@/src/models/locations/LocationDTO";
import LocationContainer from "@/src/containers/LocationContainer";
import dogBreeds from "@/src/constants/dogBreeds.json";
import catBreeds from "@/src/constants/catBreeds.json";

export type CreateUpdateAnimalModalProps = {
  onSubmit: (data: AnimalDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: AnimalDTO;
};

const CreateUpdateAnimalModal: React.FC<CreateUpdateAnimalModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<AnimalDTO>();

  const { locations, initializeFromRemote: initializeLocationsFromRemote } =
    LocationContainer.useContainer();

  useEffect(() => {
    initializeLocationsFromRemote();
  }, []);

  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [activeImageTab, setImageActiveTab] = useState(0); // 0 for Upload, 1 for Take Picture
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef<Webcam>(null);
  const selectedSpecies = watch("species");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const handleTabChange = (newValue: number) => {
    setImageActiveTab(newValue);
    setValue("primaryImageFile", null, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleCapturePicture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Set the preview image URL for display
        setPreviewImage(imageSrc);

        // Convert base64 to Blob (File)
        const blob = base64ToBlob(imageSrc);
        if (!blob) return;

        const file = new File([blob], "captured-image.jpg", {
          type: blob.type,
        });

        // Update the form field with the File object
        setValue("primaryImageFile", file, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [webcamRef]);

  const toggleCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Container>
            <div className={styles.header}>
              {initialData ? (
                <p>Edit {initialData.name}</p>
              ) : (
                <p>Create an animal</p>
              )}
              <Button
                className={styles["close-button"]}
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon />
              </Button>
            </div>
            <Form.Field label="Name" isRequired>
              <TextField
                {...register("name", { required: true })}
                defaultValue={initialData?.name}
              />
              {errors.name && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Primary photo">
              <Controller
                name="primaryImageFile"
                control={control}
                render={({ field }) => (
                  <>
                    {/* If no preview image OR preview image has been removed in the form, show picture fields */}
                    {!previewImage &&
                      (!initialData?.primaryImageSrc ||
                        dirtyFields.primaryImageFile) && (
                        <Box>
                          <Tabs
                            value={activeImageTab}
                            onChange={(event, newValue) =>
                              handleTabChange(newValue)
                            }
                            aria-label="Upload or Take Picture"
                          >
                            <Tab label="Upload Image" />
                            <Tab label="Take Picture" />
                          </Tabs>

                          <Box mt={2}>
                            {activeImageTab === 0 && (
                              <Controller
                                name="primaryImageFile"
                                control={control}
                                defaultValue={initialData?.primaryImageFile}
                                render={({ field }) => (
                                  <div {...getRootProps()}>
                                    <input
                                      {...getInputProps({
                                        onChange: (e) =>
                                          field.onChange(
                                            e.target.files?.[0] ?? null
                                          ),
                                      })}
                                    />
                                    <Button variant="contained">
                                      Upload Image
                                    </Button>
                                  </div>
                                )}
                              />
                            )}

                            {activeImageTab === 1 && (
                              <Controller
                                name="primaryImageFile"
                                control={control}
                                render={({ field }) => (
                                  <div className={styles["webcam-container"]}>
                                    <CameraswitchIcon onClick={toggleCamera} />
                                    <Webcam
                                      audio={false}
                                      ref={webcamRef}
                                      videoConstraints={{ facingMode }}
                                    />
                                    <Button
                                      variant="contained"
                                      onClick={handleCapturePicture}
                                    >
                                      Take Picture
                                    </Button>
                                  </div>
                                )}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    {(previewImage ||
                      (initialData?.primaryImageSrc &&
                        !dirtyFields.primaryImageFile)) && (
                      <div className={styles["preview-image-container"]}>
                        <img
                          src={previewImage || initialData?.primaryImageSrc}
                          className={styles["preview-image"]}
                        />
                        <Button
                          onClick={() => {
                            setPreviewImage(null);
                            setValue("primaryImageFile", null, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </>
                )}
              />
            </Form.Field>
            <Form.Field label="Species" isRequired>
              <Select
                {...register("species")}
                variant="outlined"
                defaultValue={initialData?.species}
              >
                {Object.values(Species).map((species) => (
                  <MenuItem key={species} value={species}>
                    {species}
                  </MenuItem>
                ))}
              </Select>
              {errors.species && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            {selectedSpecies === Species.DOG && (
              <Form.Field label="Breeds" isRequired>
                <Controller
                  name="breeds"
                  control={control}
                  defaultValue={initialData?.breeds || []}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      variant="outlined"
                      renderValue={(selected) =>
                        typeof selected === "string"
                          ? selected
                          : (selected as string[]).join(", ")
                      }
                      value={field.value || []}
                    >
                      {dogBreeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                          <Checkbox checked={field.value?.includes(breed)} />
                          <ListItemText primary={breed} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Form.Field>
            )}
            {selectedSpecies === Species.CAT && (
              <Form.Field label="Breeds" isRequired>
                <Controller
                  name="breeds"
                  control={control}
                  defaultValue={initialData?.breeds || []}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      variant="outlined"
                      renderValue={(selected) =>
                        typeof selected === "string"
                          ? selected
                          : (selected as string[]).join(", ")
                      }
                      value={field.value || []}
                    >
                      {catBreeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                          <Checkbox checked={field.value?.includes(breed)} />
                          <ListItemText primary={breed} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Form.Field>
            )}
            <Form.Field label="Date of birth" isRequired>
              <TextField
                {...register("dateOfBirth", { required: true, min: 0 })}
                type="date"
                defaultValue={
                  initialData?.dateOfBirth
                    ? formatDateToISO(initialData.dateOfBirth)
                    : ""
                }
              />
              {errors.dateOfBirth && (
                <Form.Message>
                  This field is required and must be a positive number
                </Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Location">
              <Controller
                name="currentLocation"
                control={control}
                defaultValue={initialData?.currentLocation || undefined}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    value={field.value || ""}
                    renderValue={(selected) =>
                      (selected as LocationDTO)?.name ||
                      initialData?.currentLocation?.name ||
                      ""
                    }
                    onChange={(event) => {
                      const selectedLocation = locations.find(
                        (loc) => loc.id === event.target.value
                      );
                      field.onChange(selectedLocation || null);
                    }}
                  >
                    {locations.map((location: LocationDTO) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Form.Field>

            <Form.Field label="Adoption status" isRequired>
              <Select
                {...register("adoptionStatus")}
                variant="outlined"
                defaultValue={initialData?.adoptionStatus}
              >
                {Object.values(AdoptionStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {errors.adoptionStatus && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Sex">
              <Select
                {...register("sex")}
                variant="outlined"
                defaultValue={initialData?.sex}
              >
                <MenuItem value={Sex.MALE}>Male</MenuItem>
                <MenuItem value={Sex.FEMALE}>Female</MenuItem>
              </Select>
            </Form.Field>
            <Form.Field label="Spay/neuter status">
              <Checkbox
                {...register("spayNeuterStatus")}
                defaultChecked={initialData?.spayNeuterStatus}
              />
            </Form.Field>
            <Form.Field label="Intake date" isRequired>
              <TextField
                {...register("intakeDate", { required: true })}
                type="date"
                defaultValue={
                  initialData?.intakeDate
                    ? formatDateToISO(initialData.intakeDate)
                    : ""
                }
              />
              {errors.intakeDate && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Intake category" isRequired>
              <Select
                {...register("intakeCategory")}
                variant="outlined"
                defaultValue={initialData?.intakeCategory}
              >
                {Object.values(IntakeCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.intakeCategory && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Biography" isRequired>
              <TextField
                {...register("biography")}
                variant="outlined"
                defaultValue={initialData?.biography}
              />
              {errors.biography && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Button type="submit">{`${
              initialData ? `Update` : `Create`
            }`}</Button>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUpdateAnimalModal;
