import {
  AdoptionStatus,
  IntakeCategory,
  PrismaClient,
  Sex,
  Shelter,
  Species,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed shelters
  const shelter1: Shelter = await prisma.shelter.create({
    data: {
      id: "185ded7c-a851-463b-a3de-dd9ac55982af",
      name: "Joe's Cat Shack",
      addressLine1: "123 Catnip Lane",
      addressLine2: null,
      city: "Feline City",
      state: "CA",
      zipCode: "90210",
      country: "USA",
      phone: "555-123-4567",
      email: "contact@joescatshack.com",
      animals: {
        create: [
          {
            name: "Buddy",
            breeds: ["Golden Retriever"],
            species: Species.DOG,
            adoptionStatus: AdoptionStatus.AVAILABLE,
            sex: Sex.MALE,
            spayNeuterStatus: true,
            intakeDate: new Date("2024-10-12"),
            intakeCategory: IntakeCategory.STRAY,
            dateOfBirth: new Date("2019-01-01"),
            biography: "Buddy is a friendly dog who loves to play fetch.",
          },
          {
            name: "Whiskers",
            breeds: ["Tabby"],
            species: Species.CAT,
            adoptionStatus: AdoptionStatus.AVAILABLE,
            sex: Sex.FEMALE,
            spayNeuterStatus: true,
            intakeDate: new Date("2024-11-12"),
            intakeCategory: IntakeCategory.TRANSFER,
            dateOfBirth: new Date("2024-09-22"),
            biography: "Whiskers is a playful cat who loves to chase toys.",
          },
        ],
      },
      tasks: {
        create: [
          {
            title: "Feed Breakfast",
            description: "Feed all the animals by 8:00 AM",
            frequency: "DAILY",
            assignment: ["ALL_ANIMALS"],
            type: ["GENERAL_CARE"],
          },
        ],
      },
    },
  });

  console.log("Seed data has been added!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
