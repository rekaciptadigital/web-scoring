// Impor React dan library yang diperlukan
import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

// Impor komponen EventThumbnailCard
import EventThumbnailCard from "./EventThumbnailCard";

/**
 * Fungsi makeHomeThumbnailList: Menghasilkan daftar thumbnail event untuk tampilan beranda.
 * @param {Array} initialData - Data awal event.
 * @param {String} type - Tipe tampilan, misalnya 'home' atau 'all-event'.
 * @returns {Array} Array yang berisi event atau array kosong jika tidak ada data.
 */
function makeHomeThumbnailList(initialData, type) {
  let container = [null];
  if (!initialData?.length) {
    return container;
  }
  const maxBoxIndex = 3;
  const lastThreeData = initialData.slice(0, maxBoxIndex);
  switch (type) {
    case "home":
      lastThreeData.forEach((event) => {
        container.push(event);
      });
      return container;
    case "all-event":
      return initialData;
    default:
      break;
  }
}

// Styled component untuk indikator loading event
const EventLoadingIndicator = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 240px;
  padding: 1.5rem 1.5rem 0.85rem 1.5rem;
  border-radius: 8px;
  background-color: #ffffff;
`;

/**
 * Komponen LatestEventList: Menampilkan daftar event terbaru.
 * @param {String} type - Tipe daftar event, misalnya 'home' atau 'all-event'.
 */
function LatestEventList({type}) {
  // State untuk menyimpan daftar event
  const [events, setEvents] = React.useState(null);

  // Fungsi untuk mengambil data event
  const getEvent = async () => {
    setEvents(null);
    const { success, data } = await EventsService.get();
    if (success) {
      const eventsData = data.map((event) => event.event);
      setEvents(eventsData);
    }
  };

  // Effect hook untuk memuat data event saat komponen dimuat
  React.useEffect(() => {
    getEvent();
  }, []);

  // Menampilkan indikator loading jika event belum dimuat
  if (!events) {
    return (
      <EventGrid>
        <EventLoadingIndicator>Sedang memuat data event...</EventLoadingIndicator>
      </EventGrid>
    );
  }

  // Menampilkan daftar event
  return (
    <EventGrid>
      {events &&
        makeHomeThumbnailList(events, type).map((event, index) => {
          return <EventThumbnailCard key={index} event={event} getEvent={getEvent}/>;
        })}
    </EventGrid>
  );
}

// Styled component untuk layout grid event
const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export default LatestEventList;
