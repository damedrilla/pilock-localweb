import React from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserView, MobileView } from "react-device-detect";
import { createHash } from "crypto";
export default function App() {
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [localMode, setLocalMode] = useState(false);

  // const getSchedule = async () => {
  //   try {
  //     axios
  //       .get("http://" + window.location.hostname + ":5000" + "/schedule")
  //       .then((response) => {
  //         setCurrentSchedule(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };
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

  // useEffect(() => {
  //   isCloudUp();
  //   let interval = setInterval(() => {
  //     isCloudUp();
  //   }, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

  async function get_da_input(formData) {
    let testMode = false;
    let domain = testMode ? "localhost" : window.location.hostname;
    const _password_ = formData.get("pass");
    let rndInt = randomIntFromInterval(20, 100)
    let salt = makeid(rndInt)
    let da_hash = createHash("sha256").update(_password_).digest("hex");
    try {
      axios
        .post(
          "http://" + domain + ":5670" + `/catAsk/`, {
            lebron : salt + da_hash,
            curry : rndInt
          }
        )
        .then((response) => {
          console.log(response.status)
          if (response.status === 200) {
            alert(`Door unlocked!`);
          } else if (response.status === 202){
            alert(`Wrong password!`);
          }
        });
    } catch (err) {
      alert("Wrong password!");
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
            <MDBInput
              className="mb-4"
              type="password"
              id="form2Example1"
              label="Password"
              name="pass"
            />

            <MDBBtn type="submit" className="mb-4" block>
              Unlock the door!
            </MDBBtn>
            <div className="text-center">
              <p>If you don't know the password, please</p>
              <p style={{ marginTop: -15 }}>
                look for the Laboratory In-Charge or a technician for it.
              </p>
            </div>
            <div className="text-center">
              <p>Disabled button means there's an internet connection</p>
              <p style={{ marginTop: -15 }}>
                in the device. Use your ID card or the web system!
              </p>
            </div>
          </form>
        </div>
      </BrowserView>
    </>
  );
}
