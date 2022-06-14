import * as React from "react";
import { useSubmitSetWinner } from "../hooks/submit-set-winner";

import { ButtonBlue, LoadingScreen, AlertSubmitError } from "components/ma";
import { ButtonConfirmPrompt } from "./button-confirm-prompt";
import { toast } from "./processing-toast";

function ButtonSetWinner({ title, disabled, categoryId, scoring, onSuccess }) {
  const { submitSetWinner, isLoading, isError, errors } = useSubmitSetWinner({
    eliminationId: scoring.elimination_id,
    categoryId: categoryId,
    round: scoring.round,
    match: scoring.match,
  });

  return (
    <React.Fragment>
      <ButtonConfirmPrompt
        customButton={ButtonBlue}
        flexible
        title={title}
        disabled={disabled}
        messagePrompt="Anda akan menentukan pemenang"
        messageDescription="Skor tidak dapat diubah lagi setelah ditentukan pemenang. Pastikan skor telah diisi benar."
        buttonConfirmLabel="Tentukan pemenang"
        buttonCancelLabel="Periksa kembali"
        onConfirm={() => {
          const options = {
            onSuccess: () => {
              toast.success("Pemenang berhasil ditentukan");
              onSuccess?.();
            },
          };
          submitSetWinner(options);
        }}
      >
        Tentukan
      </ButtonConfirmPrompt>

      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />
    </React.Fragment>
  );
}

export { ButtonSetWinner };
