// Input validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateAppName = (appName: string): ValidationError | null => {
  if (!appName || appName.trim().length === 0) {
    return { field: 'appName', message: 'App name is required' };
  }
  if (appName.length > 30) {
    return { field: 'appName', message: 'App name must be 30 characters or less' };
  }
  return null;
};

export const validateDescription = (description: string): ValidationError | null => {
  if (description.length > 500) {
    return { field: 'description', message: 'Description must be 500 characters or less' };
  }
  return null;
};

export const validateScreenshots = (count: number): ValidationError | null => {
  if (count === 0) {
    return { field: 'screenshots', message: 'At least one screenshot is required' };
  }
  if (count > 10) {
    return { field: 'screenshots', message: 'Maximum 10 screenshots allowed' };
  }
  return null;
};

export const validateProjectInputs = (
  appName: string,
  description: string,
  screenshotCount: number
): ValidationResult => {
  const errors: ValidationError[] = [];

  const appNameError = validateAppName(appName);
  if (appNameError) errors.push(appNameError);

  const descError = validateDescription(description);
  if (descError) errors.push(descError);

  const screenshotsError = validateScreenshots(screenshotCount);
  if (screenshotsError) errors.push(screenshotsError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};
