import React, { useEffect, useState } from "react";
import axios from "./axios";
import { apiKey } from "./config";
import { Dropdown, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [loading, setIsloading] = useState(true);
  const [googleAccounts, setGoogleAccounts] = useState([]);
  const [dotDigital, setDotDigital] = useState([]);
  const [selectedGoogleId, setSelectedGoogleId] = useState();
  const [selectedDotDigitalId, setSelectedDotDigitalId] = useState();
  const [optionsList, setOptionsList] = useState([]);
  // const [edit, setEdit] = useState(false);
  const date = new Date();
  const [dealerName, setDealerName] = useState("");
  const [editDealer, setEditDealer] = useState("");
  const [restoreDealerId, setRestoreDealerId] = useState("");
  useEffect(() => {
    Promise.all([
      axios.get(`/Accounts/Google?apiKey=${apiKey}`),
      axios.get(`Accounts/DotDigital?apiKey=${apiKey}`),
      axios.get(`Options?apiKey=${apiKey}`),
    ])
      .then(([response1, response2, response3]) => {
        setGoogleAccounts(response1.data.data);
        setDotDigital(response2.data.data);
        setOptionsList(response3.data.data);
        setIsloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createDealerHandler = () => {
    setIsloading(true);
    let data = {
      createdBy: "Edison",
      createdAt: date,
      updatedBy: "Edison",
      updatedAt: date,
      googleId: selectedGoogleId,
      dotDigitalId: selectedDotDigitalId,
      optionName: dealerName,
      optionValue: "",
      platformName: dealerName,
      googleAccount: {},
      dotDigitalAccount: {},
    };
    data["googleAccount"] = googleAccounts?.find(
      (data) => data.googleId === selectedGoogleId
    );
    data["dotDigitalAccount"] = dotDigital?.find(
      (data) => data.dotDigitalId === selectedDotDigitalId
    );
    axios.post(`Options?apiKey=${apiKey}`, data).then((response) => {
      axios.get(`Options?apiKey=${apiKey}`).then((response) => {
        setOptionsList(response.data.data);
        setIsloading(false);
      });
    });
  };
  const deleteHandler = (id) => {
    setIsloading(true);
    axios
      .delete(`Options/${id}?apiKey=${apiKey}`)
      .then(() => {
        axios.get(`Options?apiKey=${apiKey}`).then((response) => {
          setOptionsList(response.data.data);
          setIsloading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
      });
  };
  const editHandler = (data) => {
    setIsloading(true);
    let apiData = { ...data };
    apiData["optionName"] = editDealer;
    apiData["updatedBy"] = "Edison";
    apiData["updatedAt"] = date;
    apiData["dotDigitalAccount"]["updatedBy"] = "Edison";
    apiData["dotDigitalAccount"]["updatedAt"] = date;
    apiData["googleAccount"]["updatedBy"] = "Edison";
    apiData["googleAccount"]["updatedAt"] = date;
    axios
      .patch(`Options/${data.rooftopGoogleOptionId}?apiKey=${apiKey}`, apiData)
      .then(() => {
        axios.get(`Options?apiKey=${apiKey}`).then((response) => {
          setOptionsList(response.data.data);
          setIsloading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
      });
  };

  const restoreHandler = () => {
    setIsloading(true);
    axios
      .patch(`Options/Restore/${restoreDealerId}?apiKey=${apiKey}`)
      .then(() => {
        axios.get(`Options?apiKey=${apiKey}`).then((response) => {
          setOptionsList(response.data.data);
          setIsloading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
      });
  };

  return loading ? (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
      }}
    >
      <Spinner animation="grow" />
    </div>
  ) : (
    <>
      <div
        class="container"
        style={{ border: "1px solid black", marginTop: "50px" }}
      >
        <div class="row">
          <div class="col-12" style={{ textAlign: "center" }}>
            <h3>Create Option</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-4">Google Accounts</div>
          <div class="col-4" style={{ margin: "2px" }}>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Google Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {googleAccounts.map((data, key) => (
                  <Dropdown.Item
                    key={key}
                    onClick={() => setSelectedGoogleId(data.googleId)}
                  >
                    {data.googleId}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div class="col-2">{selectedGoogleId}</div>
        </div>
        <div class="row">
          <div class="col-4">Dot Digital Accounts</div>
          <div class="col-4" style={{ margin: "2px" }}>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Dot Digital
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {dotDigital.map((data, key) => (
                  <Dropdown.Item
                    key={key}
                    onClick={() => setSelectedDotDigitalId(data.dotDigitalId)}
                  >
                    {data.accountName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div class="col-2">{selectedDotDigitalId}</div>
        </div>
        <div class="row">
          <div class="col-4">Create New Dealer</div>
          <div class="col-4" style={{ margin: "2px" }}>
            <div>
              <input
                type="text"
                name="dealer_name"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-4"></div>
          <div class="col-4" style={{ margin: "2px" }}>
            <Button
              variant={
                dealerName !== "" && selectedDotDigitalId && selectedGoogleId
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                dealerName !== "" &&
                selectedDotDigitalId &&
                selectedGoogleId &&
                createDealerHandler()
              }
            >
              Create a new Dealer
            </Button>
          </div>
        </div>
      </div>
      <div
        className="container"
        style={{ border: "1px solid black", marginTop: "50px" }}
      >
        <div class="col-12" style={{ textAlign: "center" }}>
          <h3>Restore Option</h3>
        </div>
        <div class="row">
          <div class="col-4">Restore Dealer</div>
          <div class="col-4">
            <div>
              <input
                type="text"
                name="restore_dealer"
                value={restoreDealerId}
                onChange={(e) => setRestoreDealerId(e.target.value)}
              />
            </div>
          </div>
          <div class="col-4">
            <Button
              variant={restoreDealerId !== "" ? "primary" : "secondary"}
              onClick={() => restoreDealerId !== "" && restoreHandler()}
            >
              Restore
            </Button>
          </div>
        </div>
      </div>
      <div
        className="container"
        style={{ border: "1px solid black", marginTop: "100px" }}
      >
        <div class="col-12" style={{ textAlign: "center" }}>
          <h3>Option List</h3>
        </div>
        <div className="row">
          <div class="col-1">
            <b>Id</b>
          </div>
          <div class="col-2">
            <b>google Id</b>
          </div>
          <div class="col-2">
            <b>dot Digital Id</b>
          </div>
          <div class="col-3">
            <b>option Name</b>
          </div>
          <div class="col-4">
            <b>Actions</b>
          </div>
        </div>

        {optionsList
          .slice(0)
          .reverse()
          .map((data, key) => (
            <div className="row" style={{ margin: "5px" }}>
              <div class="col-1">{data.rooftopGoogleOptionId}</div>
              <div class="col-2">{data.googleId}</div>
              <div class="col-2">{data.dotDigitalId}</div>
              <div class="col-3">{data.optionName}</div>
              <div class="col-4">
                <div className="row">
                  <div class="col-6">
                    <Button
                      variant="primary"
                      onClick={() => deleteHandler(data.rooftopGoogleOptionId)}
                    >
                      Delete
                    </Button>
                  </div>
                  <div class="col-6">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Edit
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <div>
                          <input
                            type="text"
                            name="dealer_name"
                            value={editDealer}
                            onChange={(e) => setEditDealer(e.target.value)}
                            style={{ margin: "10px 10px" }}
                          />
                          <Button
                            variant={
                              editDealer !== "" ? "primary" : "secondary"
                            }
                            onClick={() =>
                              editDealer !== "" && editHandler(data)
                            }
                            style={{ marginLeft: "10px" }}
                          >
                            Update
                          </Button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                {/* <Button
                variant="success"
                onClick={() => setEdit((prevData) => !prevData)}
              >
                Edit
              </Button> */}
              </div>

              {/* {edit && (
              <div>
                <input
                  type="text"
                  name="dealer_name"
                  value={editDealer}
                  onChange={(e) => setEditDealer(e.target.value)}
                />
                <Button
                  variant={editDealer !== "" ? "primary" : "secondary"}
                  onClick={() => editDealer !== "" && editHandler(data)}
                >
                  Update
                </Button>
              </div>
            )} */}
            </div>
          ))}
      </div>
    </>
  );
};

export default App;
