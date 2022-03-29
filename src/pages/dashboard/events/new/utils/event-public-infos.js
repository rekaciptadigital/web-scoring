import { eventConfigs } from "constants/index";
import { filesUtil } from "utils";
import { parseServerDatetime, formatServerDatetime } from "./datetime";

const { EVENT_TYPES, MATCH_TYPES } = eventConfigs;

function makeStatePublicInfos(eventDetail) {
  if (!eventDetail) {
    return null;
  }

  const { publicInformation, moreInformation } = eventDetail;

  return {
    eventName: publicInformation.eventName,
    poster: { originalUrl: publicInformation?.eventBanner, raw: null, preview: null },
    handbook: { originalUrl: publicInformation?.handbook, raw: null, preview: null },
    description: publicInformation.eventDescription,
    location: publicInformation.eventLocation,
    locationType: publicInformation.eventLocationType,
    city: {
      label: publicInformation.eventCity.nameCity,
      value: publicInformation.eventCity.cityId,
    },
    registrationDateStart: parseServerDatetime(publicInformation.eventStartRegister),
    registrationDateEnd: parseServerDatetime(publicInformation.eventEndRegister),
    eventDateStart: parseServerDatetime(publicInformation.eventStart),
    eventDateEnd: parseServerDatetime(publicInformation.eventEnd),
    extraInfos: moreInformation.map((info) => ({
      ...info,
      key: stringUtil.createRandom(),
    })),
  };
}

async function makePayloadPublicInfos(formData, eventId) {
  if (!formData) {
    return null;
  }

  const posterImageBase64 = await filesUtil.fileToBase64(formData.poster?.raw);
  const handbookFileBase64 = await filesUtil.fileToBase64(formData.handbook?.raw);

  const payload = {
    eventName: formData.eventName,
    eventBanner: posterImageBase64,
    handbook: handbookFileBase64,
    eventDescription: formData.description,
    eventLocation: formData.location,
    eventLocationType: formData.locationType,
    eventCity: formData.city?.value,
    eventStartRegister: formatServerDatetime(formData.registrationDateStart),
    eventEndRegister: formatServerDatetime(formData.registrationDateEnd),
    eventStart: formatServerDatetime(formData.eventDateStart),
    eventEnd: formatServerDatetime(formData.eventDateEnd),
  };

  if (!eventId) {
    // Mode create
    return {
      eventType: EVENT_TYPES.FULLDAY,
      eventCompetition: MATCH_TYPES.TOURNAMENT,
      ...payload,
    };
  }
  return payload;
}

export { makeStatePublicInfos, makePayloadPublicInfos };
