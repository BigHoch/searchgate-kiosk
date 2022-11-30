import React, { useState, useRef, useContext} from "react";
import { Alert, Box, Button, Typography, Modal, Stack } from "@mui/material/";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import flash from "../image/flash.png";
import patch from "../image/patch.png";
import shark from "../image/shark.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import swal from 'sweetalert';
import Swal from 'sweetalert2'

const tabStyle = {
  height: 500,
  maxHeight: 300,
  overflow: "scroll",
  //backgroundColor: "blue"
};

// console.log("FROM FORMS", Forms);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PrintModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [flag, setFlag] = useState(false);
  
  const componentRef = useRef();
  const vehicle = props.element.vehicle;
  const setFailedRegister = props.element.setFailedRegister;
  const reload = props.element.reload;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => reload(),
  });

  // console.log("FROM PRINT MODAL", props);

  const postUser = () => {
    console.log("posting vehicle");

    console.log(vehicle.drivers_license);
    console.log(vehicle.first_name);
    fetch("http://localhost:8080/api", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(vehicle),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => res.json())

      .catch((err) => {
        console.log("Error: ", err);
      });
    console.log("vehicle has been posted");
    handleClose();
  };

  const ComponentToPrint = React.forwardRef((props, ref) => {
    //   const date = new Date();
    // const today =
    //   date.toISOString().slice(0, 10) + " " + date.toTimeString().slice(0, 5);
    return (
      <Box ref={ref} sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            style={{ width: "20%", margin: 2 }}
            src={flash}
            alt="Security Forces Logo"
          />
          45 SFS Vehicle Pass
          <img
            style={{ width: "15%", margin: 1 }}
            src={patch}
            alt="Security Forces Logo"
          />
        </Box>
        <Box
          className="printElement1"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography> First Name: {vehicle.first_name}</Typography>
            <Typography sx={{ pl: 5 }}>
              {" "}
              Last Name: {vehicle.last_name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography>
              {" "}
              Drivers License: {vehicle.state} {vehicle.drivers_license}
            </Typography>
          </Box>
          <Box
            className="printElement1"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography> Vehicle Plate: {vehicle.plate}</Typography>
            <Typography> Make: {vehicle.make}</Typography>
            <Typography> Model: {vehicle.model}</Typography>
          </Box>
          <Typography>{vehicle.date}</Typography>
        </Box>
      </Box>
    );
  });

  const printAndClose = async () => {
    postUser();
    handleClose();
    handlePrint();
  };

  const fillOutFields = () => {
    if (
      vehicle.first_name === "" ||
      vehicle.last_name === "" ||
      vehicle.plate === "" ||
      vehicle.drivers_license === "" ||
      vehicle.state === "" ||
      vehicle.make === "" ||
      vehicle.model === ""
    ) {
      setFailedRegister(true);
      // This is SweetAlert2 Code Easter Egg
      // Swal.fire({
      //   title: 'Custom width, padding, color, background.',
      //   width: 600,
      //   padding: '3em',
      //   color: '#6EF57B',
      //   background: '#fff url("https://img.freepik.com/free-vector/green-cannabis-leaves-hand-drawn-cartoon-illustration_56104-1867.jpg?w=360")',
      //   backdrop: `
      //   rgba(0,0,123,0.4)
      //     url("https://i.gifer.com/X11G.gif")
      //     left top
      //     no-repeat
      //   `
      // })
      // swal({
      //   title: "All Fields are required to be filled!",
      //   text: "If you are experiencing please locate a Security Forces Member ",
      //   icon: "error",
      //   button: "Continue",
      //   timer: 5000,
      // });
      Swal.fire({
        title: "All Fields Are Required To Be Completed!",
        text: "If you are experiencing locate a Security Forces Member ",
        icon: "error",
        button: "Continue",
        showConfirmButton: false,
        timer: 7000,
      })
      return;
    }
    handleOpen();
  };

  return (
    <div>
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Button
        sx={{ boxShadow: 2, width: 150, m: 1}}
        variant="contained"
        onClick={() => {
          fillOutFields();
        }}
        >
        Verify & Print
      </Button>

        </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Verify All Information Is Correct
            </Typography>
          </Box>

          <ComponentToPrint ref={componentRef} />
          {/* <Button onClick={handlePrint}>Print this out!</Button> */}
          <Button
            sx={{ boxShadow: 2, width: 150, m: 1 }}
            variant="contained"
            onClick={() => {
              // postUser();
              // handlePrint();
              // reload();
              printAndClose();
            }}
          >
            {" "}
            Print Pass{" "}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
