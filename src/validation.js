const MIN_BIRTH_YEAR = -3000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Confirms that a value is a string with at least one non-whitespace character.
 * Values of any other type are rejected, which also blocks MongoDB operator
 * objects such as { "$ne": null } from reaching a query.
 */
export const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Confirms that a value is an integer year that is not in the future.
 * The value 0 is only rejected because it falls outside the accepted range,
 * never because it is falsy.
 */
export const isValidBirthYear = (value) => {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        return false;
    }

    const currentYear = new Date().getFullYear();

    return value >= MIN_BIRTH_YEAR && value <= currentYear;
};

/**
 * Confirms that a value is a YYYY-MM-DD string that represents a real calendar
 * date. A value such as '2026-02-31' matches the pattern but is not a real date,
 * so it is rejected.
 */
export const isValidDateString = (value) => {
    if (!isNonEmptyString(value) || !DATE_PATTERN.test(value.trim())) {
        return false;
    }

    const trimmedValue = value.trim();
    const parsedDate = new Date(`${trimmedValue}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return false;
    }

    return parsedDate.toISOString().startsWith(trimmedValue);
};
