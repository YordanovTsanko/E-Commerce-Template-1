import React, { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const PasswordField = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Скрий паролата" : "Покажи паролата"}
              >
                {visible ? <RiEyeOffFill /> : <RiEyeFill />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
