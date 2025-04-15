const knex = require("../knex-config");

const validateUserData = (userData) => {
  const errors = [];

  const {
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    password,
    auth_provider,
  } = userData;

  if (!first_name) {
    errors.push("First name is required.");
  }

  if (!last_name) {
    errors.push("Last name is required.");
  }

  if (!email) {
    errors.push("Email is required.");
  } else {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
      errors.push("Invalid email format.");
    }
  }

  if (phone_number) {
    const validPhoneNumber =
      /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!validPhoneNumber.test(phone_number)) {
      errors.push("Invalid phone number.");
    }
  }

  if (date_of_birth) {
    const test = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!test.test(date_of_birth)) {
      errors.push("Invalid date of birth.");
    }
  }

  if (auth_provider === "local" && !password) {
    errors.push("Password is required for local authentication.");
  }

  return errors;
};

// Validate duplicate registration
const validateDuplicateRegistration = async (
  team_id,
  tournament_division_id
) => {
  const existingRegistration = await knex("Registration")
    .where({ team_id, tournament_division_id })
    .first();

  if (existingRegistration) {
    console.log("Duplicate registration detected:", {
      team_id,
      tournament_division_id,
    });
    throw {
      status: 400,
      message: "Team is already registered for this tournament division",
    };
  }
};

module.exports = {
  validateUserData,
  validateDuplicateRegistration,
};
