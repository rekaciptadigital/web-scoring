function computeLastUnlockedStep(sortedFormStatusList) {
  let stepNumber = 0;
  for (const isEmpty of sortedFormStatusList) {
    stepNumber = stepNumber + 1;
    if (isEmpty) {
      break;
    }
  }
  return stepNumber;
}

export { computeLastUnlockedStep };
