import * as React from "react";
import styled from "styled-components";
import { useQueueHeavyImageList } from "../hooks/queue-heavy-image-list";

import { HeavyImage } from "./heavy-image";
import { AvatarClubDefault } from "components/ma/avatar-club-default";

import IconMedalGold from "components/ma/icons/fill/medal-gold";
import IconMedalSilver from "components/ma/icons/fill/medal-silver";
import IconMedalBronze from "components/ma/icons/fill/medal-bronze";

function RankingTable({ data }) {
  const { registerQueue, checkIsPending, onLoad, onError } = useQueueHeavyImageList();
  return (
    <ClubTable className="table table-responsive">
      <thead>
        <tr>
          <th>Peringkat</th>
          <th className="name">Klub</th>
          <th className="name">Kota</th>

          <th>
            <MedalCounter>
              <span>
                <IconMedalGold size="20" />
              </span>
              <span>Emas</span>
            </MedalCounter>
          </th>

          <th>
            <MedalCounter>
              <span>
                <IconMedalSilver size="20" />
              </span>
              <span>Perak</span>
            </MedalCounter>
          </th>

          <th>
            <MedalCounter>
              <span>
                <IconMedalBronze size="20" />
              </span>
              <span>Perunggu</span>
            </MedalCounter>
          </th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>

            <td className="name">
              <Club>
                <div title={row.clubLogo}>
                  {row.clubLogo ? (
                    <HeavyImage
                      title={row.clubName}
                      alt={"Logo " + row.clubName}
                      src={row.clubLogo}
                      onRegisterQueue={() => registerQueue(index)}
                      onLoad={onLoad}
                      onError={onError}
                      isPending={checkIsPending(index)}
                      fallback={<AvatarClubDefault />}
                    />
                  ) : (
                    <AvatarClubDefault />
                  )}
                </div>
                <div>{row.clubName}</div>
              </Club>
            </td>

            <td className="name">{row.clubCity}</td>
            <td>{row.gold}</td>
            <td>{row.silver}</td>
            <td>{row.bronze}</td>
          </tr>
        ))}
      </tbody>
    </ClubTable>
  );
}

const ClubTable = styled.table`
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;

      &.name {
        text-align: left;
      }
    }
  }

  tbody td {
    vertical-align: middle;

    &.name {
      text-align: left;
    }
  }

  th,
  td {
    cursor: auto;
  }
`;

const MedalCounter = styled.span`
  display: inline-block;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const Club = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  > *:nth-child(1) {
    --club-avatar-diameter: 43px;

    flex-shrink: 0;
    overflow: hidden;
    width: var(--club-avatar-diameter);
    height: var(--club-avatar-diameter);
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > *:nth-child(2) {
    flex-grow: 1;
    vertical-align: middle;
  }
`;

export { RankingTable };
