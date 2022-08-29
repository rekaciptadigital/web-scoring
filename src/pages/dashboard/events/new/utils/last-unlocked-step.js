function computeLastUnlockedStep(emptyStatusByStepNumber) {
  const sortedFormStatusList = Object.keys(emptyStatusByStepNumber).map(
    (number) => emptyStatusByStepNumber[number]
  );
  let stepSequenceNumber = 0;
  for (const isEmpty of sortedFormStatusList) {
    stepSequenceNumber = stepSequenceNumber + 1;
    if (isEmpty) {
      break;
    }
  }
  return stepSequenceNumber;
}

export { computeLastUnlockedStep };
