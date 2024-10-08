import React from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserView, MobileView } from "react-device-detect";
export default function App() {
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [localMode, setLocalMode] = useState(false);

  const getSchedule = async () => {
    try {
      axios
        .get("http://" + window.location.hostname + ":5000" + "/schedule")
        .then((response) => {
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
      axios
        .get("http://" + window.location.hostname + ":5000" + "/sanity_check")
        .then((response) => {
          setLocalMode(response.data.localMode);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    isCloudUp();
    let interval = setInterval(() => {
      isCloudUp();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function get_da_input(formData) {
    getSchedule();
    const user_course = formData.get("schedule");
    const input_faculty = formData.get("faculty");

    try {
      if (
        user_course === currentSchedule.subject &&
        input_faculty === currentSchedule.instructor
      ) {
        axios.post("http://" + window.location.hostname + ":5000" + "/unlock");
        alert(`Door unlocked!`);
      } else {
        alert(`Try again!`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <BrowserView>
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
              <p
                style={{ fontWeight: "bold", color: "#03bafc", fontSize: 100 }}
              >
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
            <div className="text-center">
              <p>This webpage is only viewable in mobile</p>
            </div>
          </form>
        </div>
      </BrowserView>
      <MobileView>
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
              <p
                style={{ fontWeight: "bold", color: "#03bafc", fontSize: 100 }}
              >
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

            <MDBBtn type="submit" className="mb-4" disabled={!localMode} block>
              Unlock the door!
            </MDBBtn>
            <div className="text-center">
              <p>Disabled button means there's an internet connection</p>
              <p style={{ marginTop: -15 }}>in the device. Use your ID card!</p>
            </div>
          </form>
        </div>
      </MobileView>
    </>
  );
}
