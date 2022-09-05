import { eventConfigs } from "constants/index";
import { filesUtil, stringUtil } from "utils";
import { parseServerDatetime, formatServerDatetime } from "./datetime";

const { EVENT_TYPES, MATCH_TYPES } = eventConfigs;

function makeStatePublicInfos(eventDetail) {
  if (!eventDetail) {
    return null;
  }

  const { isPrivate, publicInformation, moreInformation } = eventDetail;

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
    isPrivate: isPrivate
  };
}

async function makePayloadPublicInfos(formData, { eventId, eventType, matchType }) {
  if (!formData) {
    return null;
  }

  const posterImageBase64 = await filesUtil.fileToBase64(formData.poster?.raw);
  const handbookFileBase64 = await filesUtil.fileToBase64(formData.handbook?.raw);

  const commonPayload = {
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
    isPrivate: formData.isPrivate
  };

  if (!eventId) {
    // Mode create
    return {
      ...commonPayload,
      eventType: eventType || EVENT_TYPES.FULLDAY,
      eventCompetition: matchType || MATCH_TYPES.TOURNAMENT,
      more_information: formData.extraInfos.map((info) => ({
        title: info.title,
        description: info.description,
      })),
    };
  }

  return commonPayload;
}

export { makeStatePublicInfos, makePayloadPublicInfos };
