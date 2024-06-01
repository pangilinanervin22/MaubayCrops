"use client";

import { IconEye, IconEyeClosed } from "@tabler/icons-react";

interface ShowPasswordProps {
  handlePasswordVisibility: () => void;
  isPasswordVisible: boolean;
}

const ShowPassword: React.FC<ShowPasswordProps> = ({
  handlePasswordVisibility,
  isPasswordVisible,
}) => {
  return (
    <button
      className="absolute top-1/2 transform -translate-y-1/2 right-2"
      type="button"
      onClick={handlePasswordVisibility}
    >
      {isPasswordVisible ? <IconEye /> : <IconEyeClosed />}
    </button>
  );
};

export { ShowPassword };
