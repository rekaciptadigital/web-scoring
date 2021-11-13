import _ from "lodash";

/**
 * Me-return callback state setter yang akan dioperkan
 * sebagai argumen untuk `setEventData()`
 */
function computeEventData(key, value) {
  return (eventData) => {
    let eventDataUpdated = { ...eventData };

    // Intervensi value onChange per field
    if (key === "registrationFees") {
      const registrationFees = eventDataUpdated.registrationFees;
      const teamCategories = eventDataUpdated.teamCategories;

      const registrationFeesUpdated = value.map((feeFromValue) => {
        const registrationFee = registrationFees.find((fee) => fee.id === feeFromValue.id);
        const categoryPricesUpdated = teamCategories.map((category) => ({
          ...category,
          teamCategory: category.id,
          price: feeFromValue.price,
        }));

        return {
          // data awal...
          ...registrationFee,
          // ditimpa dengan data baru...
          ...feeFromValue,
          registrationType: feeFromValue.registrationType || feeFromValue.id,
          categoryPrices: registrationFee?.categoryPrices || categoryPricesUpdated,
        };
      });

      eventDataUpdated.registrationFees = registrationFeesUpdated;
    } else if (key === "teamCategories") {
      // Memunculkan field inputan harga sesuai kategori regu yang dipilih
      // dan menampilkan harga default sesuai biaya registrasi yang diinput di atas
      const registrationFees = eventDataUpdated.registrationFees.map((fee) => {
        const categoryPrices = value.map((category) => {
          const currentPrice = fee.categoryPrices?.find((price) => price.id === category.id)?.price;
          return {
            ...category,
            teamCategory: category.id,
            price: currentPrice || fee.price,
          };
        });

        return { ...fee, categoryPrices: categoryPrices };
      });

      eventDataUpdated.teamCategories = value;
      eventDataUpdated.registrationFees = registrationFees;
    } else {
      eventDataUpdated = _.set(eventDataUpdated, key, value);
    }
    return eventDataUpdated;
  };
}

export { computeEventData };
