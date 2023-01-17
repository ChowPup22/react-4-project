const onlyTextValidation = (value) => {
  if (value) {
    if (/^[a-zA-Z\s]*$/i.test(value)) {
      return undefined;
    } else {
      return 'Alphabetical characters only';
    }
  } else {
    return undefined;
  }
};

const descriptionValidation = (value) => {
  if (value) {
    if (/^(.|\s)*[a-zA-Z]+(.|\s)*$/i.test(value)) {
      return undefined;
    } else {
      return 'No special characters allowed';
    }
  } else {
    return undefined;
  }
};

const dateValidation = (value) => {
  if (value) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/i.test(value)) {
      return undefined;
    } else {
      return 'Not a valid Date format';
    }
  } else {
    return undefined;
  }
};


const emailValidation = (value) => {
  if (value) {
    if (/\S+@\S+\.\S+/i.test(value)) {
      return undefined;
    } else {
      return 'Not a valid Email format';
    }
  } else {
    return undefined;
  }
};

const passwordValidation = (value) => {
  if (value) {
    if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/i.test(value)) {
      return undefined;
    } else {
      return 'Must be at least 8 characters, 1 number & 1 symbol';
    }
  } else {
    return undefined;
  }
}


export const validations = {
  email: (value) => emailValidation(value),
  pass: (value) => passwordValidation(value),
  firstName: (value) => onlyTextValidation(value),
  lastName: (value) => onlyTextValidation(value),
  title: (value) => onlyTextValidation(value),
  description: (value) => descriptionValidation(value),
  dateDueBy: (value) => dateValidation(value),
  userTaskId: (value) => descriptionValidation(value),
  userId1: (value) => descriptionValidation(value),
  userId2: (value) => descriptionValidation(value),
}