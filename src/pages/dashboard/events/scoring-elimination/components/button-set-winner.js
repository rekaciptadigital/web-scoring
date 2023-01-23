import * as React from "react";
import { useSubmitSetWinner } from "../hooks/submit-set-winner";
import { useSubmitCancelWinner } from "../hooks/submit-cancel-winner";

import { ButtonBlue, ButtonOutlineRed, LoadingScreen, AlertSubmitError } from "components/ma";
import { ButtonConfirmPrompt } from "./button-confirm-prompt";
import { toast } from "./processing-toast";

function ButtonSetWinner({ categoryId, scoring, onSuccess }) {
  const { submitSetWinner, isLoading, isError, errors } = useSubmitSetWinner({
    eliminationId: scoring.elimination_id,
    categoryId: categoryId,
    round: scoring.round,
    match: scoring.match,
  });

  const handleConfirmWinner = () => {
    const options = {
        onSuccess: () => {
          toast.success("Pemenang berhasil ditentukan");
          onSuccess?.();
        },
      };
      submitSetWinner(options);
  }

  return (
    <React.Fragment>
      <ButtonBlue onClick={handleConfirmWinner}>Tentukan</ButtonBlue>
      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />
    </React.Fragment>
  );
}

function ButtonCancelWinner({ title, disabled, categoryId, scoring, onSuccess }) {
  const { submitCancelWinner, isLoading, isError, errors } = useSubmitCancelWinner({
    eliminationId: scoring.elimination_id,
    categoryId: categoryId,
    round: scoring.round,
    match: scoring.match,
  });

  return (
    <React.Fragment>
      <ButtonConfirmPrompt
        customButton={ButtonOutlineRed}
        flexible
        reverseButtons
        title={title}
        disabled={disabled}
        messagePrompt="Yakin akan membatalkan pemenang?"
        messageDescription="Skoring akan dibuka kembali dan dapat diubah."
        buttonConfirmLabel="Yakin"
        buttonCancelLabel="Tidak"
        onConfirm={() => {
          const options = {
            onSuccess: () => {
              toast.success("Pemenang berhasil dibatalkan");
              onSuccess?.();
            },
          };
          submitCancelWinner(options);
        }}
      >
        Batalkan
      </ButtonConfirmPrompt>

      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />
    </React.Fragment>
  );
}

export { ButtonSetWinner, ButtonCancelWinner };
