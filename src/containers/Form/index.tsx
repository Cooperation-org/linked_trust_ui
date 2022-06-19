import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import axios from "../../axiosInstance";

import IHomeProps from "./types";
import styles from "./styles";

const Form = ({
  toggleSnackbar,
  setSnackbarMessage,
  setLoading,
}: IHomeProps) => {
  const [subject, setSubject] = useState("");
  const [claim, setClaim] = useState("");
  const [object, setObject] = useState("");
  const [qualifier, setQualifier] = useState("");
  const [aspect, setAspect] = useState("");
  const [howKnown, setHowKnow] = useState("");
  const [source, setSource] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [confidence, setConfidence] = useState(1);
  const [reviewRating, setReviewRating] = useState([0, 5]);

  const navigate = useNavigate();

  const handleSubmission = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (subject && claim) {
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

        setLoading(true);
        await axios.post(`/api/claim`, payload).then(() => {
          toggleSnackbar(true);
          setSnackbarMessage("Claim submitted successfully!");
        });

        setSubject("");
        setClaim("");
        setObject("");
        setQualifier("");
        setAspect("");
        setHowKnow("");
        setSource("");
        setEffectiveDate(new Date());
        setConfidence(1);
        setReviewRating([0, 5]);
        setLoading(false);
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      setLoading(false);
      toggleSnackbar(true);
      setSnackbarMessage("Subject and Claims are required fields.");
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
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
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
          <Box sx={styles.sliderField}>
            <Box display="flex" flexDirection="column">
              <Slider
                getAriaLabel={() => "Review rating"}
                value={reviewRating}
                onChange={(_: Event, rating: number[]): void =>
                  setReviewRating(rating)
                }
                min={0}
                max={5}
                valueLabelDisplay="auto"
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">{reviewRating[0]}</Typography>
                <Typography variant="body2">{reviewRating[1]}</Typography>
              </Box>
            </Box>
          </Box>
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