import { faker } from "@faker-js/faker";

export const randomInfo = () => {
  const name = faker.name.jobTitle();
  const description = faker.lorem.text();
  const website = faker.internet.url();
  const phone = faker.phone.phoneNumber();

  return {
    name,
    description,
    website,
    phone,
  };
};
