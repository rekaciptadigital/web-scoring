import * as React from "react";
import styled from "styled-components";

import { LoadingIndicator } from "./loading-indicator";

import IconPictureUpload from "components/ma/icons/mono/picture-upload";

import { filesUtil } from "utils";

function AsyncPhotoUploader({ title, placeholder = "Unggah foto", imageSrc, onSubmit, isLoading }) {
  const handleChooseImage = async (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const imageBase64 = await filesUtil.fileToBase64(imageRawData);
    onSubmit?.(imageBase64);
  };

  const containerProps = {
    htmlFor: "uploader",
    title: title,
  };

  const inputProps = {
    type: "file",
    accept: "image/jpg,image/jpeg,image/png",
    id: "uploader",
    onChange: handleChooseImage,
  };

  if (!imageSrc) {
    return (
      <UploaderContainer {...containerProps}>
        <PictureContainer>
          <span>
            <IconPictureUpload size="49" />
          </span>
          <span>{placeholder}</span>
        </PictureContainer>

        <LoadingIndicator isLoading={isLoading} />

        <FileInput {...inputProps} />
      </UploaderContainer>
    );
  }

  return (
    <UploaderContainer {...containerProps}>
      <PictureContainer>
        <img className="avatar-profile-picture" src={imageSrc} />
      </PictureContainer>

      <LoadingIndicator isLoading={isLoading} />

      <UploadButton>
        <IconPictureUpload />
      </UploadButton>

      <FileInput {...inputProps} />
    </UploaderContainer>
  );
}

/* ================================= */
// utils

const UploadButton = styled.span`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  z-index: 20;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--ma-gray-50);
  box-shadow: inset 0 0 0 2px var(--ma-gray-200);

  color: var(--ma-gray-400);
  text-align: center;
  vertical-align: middle;
`;

const UploaderContainer = styled.label`
  padding: 0;
  margin: 0;
  display: block;
  position: relative;
  height: 0;
  padding-bottom: 100%;
  cursor: pointer;

  ${UploadButton} {
    transition: transform 0.15s ease-in, box-shadow 0.1s ease-in;
  }

  &:hover ${UploadButton} {
    transform: translateY(-1px);
    box-shadow: inset 0 0 0 2px var(--ma-gray-200), 0 0.25rem 0.5rem rgb(18 38 63 / 15%);
  }
`;

const PictureContainer = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px var(--ma-gray-200);
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-400);

  > .avatar-profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileInput = styled.input`
  position: absolute;
  top: -99999px;
  left: -99999px;
  visibility: hidden;
`;

export { AsyncPhotoUploader };