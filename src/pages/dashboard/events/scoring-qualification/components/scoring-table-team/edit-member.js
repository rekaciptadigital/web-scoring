import * as React from "react";
import styled from "styled-components";
import { useTeamMembers } from "./hooks/team-members";
import { useSubmitTeamMember } from "./hooks/submit-member";

import { Modal, ModalBody } from "reactstrap";
import { SpinnerDotBlock, ButtonBlue, LoadingScreen, AlertSubmitError } from "components/ma";
import { toast } from "../processing-toast";
import { SelectSetting } from "./select-settings";

import IconEdit from "components/ma/icons/mono/edit";
import IconX from "components/ma/icons/mono/x";

import { misc } from "utils";

function EditMember({ categoryId, participantId, teamName, teamMember, onSuccess }) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <ButtonEditMember title="Ubah anggota tim" onClick={() => setOpen(true)}>
        <IconEdit size="8" />
      </ButtonEditMember>
      {isOpen && (
        <ModalEditor
          categoryId={categoryId}
          participantId={participantId}
          teamName={teamName}
          teamMember={teamMember}
          toggle={() => setOpen((open) => !open)}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </React.Fragment>
  );
}

function ModalEditor({ categoryId, participantId,teamName, teamMember, onClose, toggle, onSuccess }) {
  const { data: teamMembers, isLoading } = useTeamMembers({
    categoryId,
    participantId: participantId,
  });

  const [member, setMember] = React.useState(null);
  const [formErrors, setFormErrors] = React.useState({});

  const {
    submit,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitTeamMember({
    memberId: teamMember.id,
    targetMemberId: member?.value,
    participantId: participantId,
    categoryId: categoryId,
  });

  const handleValidation = ({ onValid, onInvalid }) => {
    const errors = {};
    if (!member) {
      const message = "Peserta wajib diisi";
      errors.member = errors.member ? errors.member.push(message) : [message];
    }
    setFormErrors(errors);
    if (!Object.keys(errors).length) {
      onValid?.();
    } else {
      onInvalid?.();
    }
  };

  const options = React.useMemo(() => _makeOptionsMember(teamMembers), [teamMembers]);

  return (
    <Modal isOpen toggle={toggle} centered>
      <ModalBody>
        <LayoutVertical>
          <ModalHeader>
            <Heading>Ubah Tim {teamName}</Heading>
            <ButtonClose onClick={onClose}>
              <IconX size="16" />
            </ButtonClose>
          </ModalHeader>

          {!teamMembers && isLoading ? (
            <SpinnerDotBlock />
          ) : (
            <div>
              <div>
                <Label htmlFor="member">
                  Ganti peserta <NameEmphasis>{teamMember.name}</NameEmphasis> dengan peserta:
                </Label>
                <SelectSetting
                  id="member"
                  placeholder="Pilih Peserta"
                  options={options}
                  value={member}
                  onChange={(value) => {
                    setFormErrors({});
                    setMember(value);
                  }}
                  errors={formErrors.member}
                />
                <InlineErrorMessage errors={formErrors.member} />
              </div>
            </div>
          )}

          <BottomAction>
            <ButtonBlue
              onClick={() =>
                handleValidation({
                  onValid() {
                    submit({
                      onSuccess: async () => {
                        toast.success("Berhasil mengubah anggota tim");
                        await misc.sleep(250);
                        onClose();
                        onSuccess();
                      },
                    });
                  },
                })
              }
            >
              Simpan
            </ButtonBlue>
          </BottomAction>
        </LayoutVertical>

        <LoadingScreen loading={isLoadingSubmit} />
        <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />
      </ModalBody>
    </Modal>
  );
}

function InlineErrorMessage({ errors }) {
  if (!errors?.length) {
    return null;
  }
  return <MessageError>{errors[0]}</MessageError>;
}

/* ========================= */
// styles

const ButtonEditMember = styled.button`
  margin: 0;
  padding: 0 4px;
  border: none;
  border-radius: 0.25rem;
  background-color: unset;

  color: var(--ma-blue);

  &:hover {
    background-color: var(--ma-gray-100);
    color: var(--ma-blue);
  }
`;

const LayoutVertical = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const ButtonClose = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  background-color: transparent;
  color: var(--ma-blue);

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

const Heading = styled.h5`
  margin: 0;
  color: var(--ma-blue);
  font-weight: 600;
`;

const Label = styled.label`
  font-weight: normal;
`;

const NameEmphasis = styled.em`
  font-style: normal;
  text-decoration: underline;
`;

const BottomAction = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const MessageError = styled.span`
  color: var(--ma-text-negative);
  font-size: 0.625rem;
`;

/* ========================= */
// utils

function _makeOptionsMember(teamMembers) {
  if (!teamMembers?.length) {
    return [];
  }
  return teamMembers.map((member) => ({
    value: member.memberId,
    label: member.name,
    data: member,
  }));
}

export { EditMember };
