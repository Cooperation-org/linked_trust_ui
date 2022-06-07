import React, { useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import styles from "./styles";

const Form = ({ setAuth }) => {
  const [subject, setSubject] = useState("");
  const [claim, setClaim] = useState("");
  const [object, setObject] = useState("");
  const [qualifier, setQualifier] = useState("");
  const [aspect, setAspect] = useState("");
  const [howKnown, setHowKnow] = useState("");
  const [source, setSource] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [confidence, setConfidence] = useState(1);
  const [reviewRating, setReviewRating] = useState(1);

  const handleSubmission = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (subject && claim && object && howKnown && source && effectiveDate) {
      try {
        const effectiveDateAsString = effectiveDate.toISOString();
        const confidenceAsNumber = Number(confidence);
        const reviewRatingAsNumber = Number(reviewRating);

        const payload = {
          subject,
          claim,
          object,
          qualifier,
          aspect,
          howKnown,
          source,
          effectiveDate: effectiveDateAsString,
          confidence: confidenceAsNumber,
          reviewRating: reviewRatingAsNumber,
        };

        setSubject("");
        setClaim("");
        setObject("");
        setQualifier("");
        setAspect("");
        setHowKnow("");
        setSource("");
        setEffectiveDate(new Date());
        setConfidence(1);
        setReviewRating(1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const inputFieldLabelArr = [
    { label: "Subject", value: subject, setter: setSubject, type: "text" },
    { label: "Claim", value: claim, setter: setClaim, type: "text" },
    { label: "Object", value: object, setter: setObject, type: "text" },
    {
      label: "Qualifier",
      value: qualifier,
      setter: setQualifier,
      type: "text",
    },
    { label: "Aspect", value: aspect, setter: setAspect, type: "text" },
    { label: "How Known", value: howKnown, setter: setHowKnow, type: "text" },
    { label: "Source", value: source, setter: setSource, type: "text" },
    {
      label: "Confidence",
      value: confidence,
      setter: setConfidence,
      type: "number",
      min: 1,
      max: 5,
    },
    {
      label: "Review",
      value: reviewRating,
      setter: setReviewRating,
      type: "number",
      min: 1,
      max: 5,
    },
  ];

  const handleLogout = () => {
    setAuth(false);
  };

  return (
    <form className="Form">
      <Container sx={styles.formContainer}>
        <Typography variant="h4" sx={styles.formHeading}>
          Polling Form
        </Typography>
        <Box sx={styles.inputFieldWrap}>
          {inputFieldLabelArr.map(
            ({ label, value, setter, type, ...rest }: any, i) => (
              <TextField
                value={value}
                fullWidth
                label={label}
                sx={styles.inputField}
                variant="filled"
                key={i}
                onChange={(event: any) => setter(event.currentTarget.value)}
                type={type}
                inputProps={{ ...rest }}
              />
            )
          )}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Effective Date"
              value={effectiveDate}
              onChange={(newValue: any) => setEffectiveDate(newValue)}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  sx={styles.inputField}
                  variant="filled"
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={styles.submitButtonWrap}>
          <Button
            onClick={handleLogout}
            variant="contained"
            size="large"
            sx={styles.submitButton}
          >
            Logout
          </Button>
          <Button
            onClick={async (event: any) => await handleSubmission(event)}
            variant="contained"
            size="large"
            sx={styles.submitButton}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </form>
  );
};

export default Form;
