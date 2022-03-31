function computeLastUnlockedStep(sortedFormStatusList) {
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
