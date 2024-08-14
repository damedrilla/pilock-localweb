import React from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = window.location.hostname + ":5000"
export default function App() {
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [localMode, setLocalMode] = useState(false);
  const getSchedule = async () => {
    try {
      axios
        .get(`/schedule`)
        .then((response) => {
          console.log(response);
          setCurrentSchedule(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error.message);
    }
  };
  const isCloudUp = async () => {
    
    try {
      axios.get("/sanity_check").then((response) => {
        console.log(response);
        setLocalMode(response.data.localMode);
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      isCloudUp();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function get_da_input(formData) {
    await getSchedule();
    await isCloudUp();
    const user_course = formData.get("schedule");
    const input_faculty = formData.get("faculty");

    try {
      if (
        user_course === currentSchedule.subject &&
        input_faculty === currentSchedule.instructor
      ) {
        axios.post(`/unlock`);
        alert(`Door unlocked!`);
      } else {
        alert(`fuck outta here boi`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form action={get_da_input}>
        <div className="text-center">
          <p style={{ fontWeight: "bold", color: "#03bafc", fontSize: 100 }}>
            Pi-Lock:{" "}
          </p>
          <p
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 40,
              marginTop: -50,
            }}
          >
            Last Resort{" "}
          </p>
          <p>Oh no! You forgot your ID card and there's no internet!</p>
        </div>
        <MDBInput
          className="mb-4"
          type="text"
          id="form2Example1"
          label="Current schedule"
          name="schedule"
        />
        <MDBInput
          className="mb-4"
          type="text"
          id="form2Example2"
          label="Faculty assigned"
          name="faculty"
        />

        <MDBBtn type="submit" className="mb-4" disabled={localMode} block>
          Unlock the door!
        </MDBBtn>
        <div className="text-center">
          <p>Disabled button means there's an internet connection</p>
          <p style={{ marginTop: -15 }}>in the device. Use your ID card!</p>
        </div>
      </form>
    </div>
  );
}
