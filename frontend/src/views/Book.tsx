import { useEffect, useState, MouseEvent } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import { IFailedResponse } from "../interfaces";

interface IRoom {
    id: number;
    roomNo: string;
    rollNo: string;
}

function Book() {

    const [roomList, setRoomList] = useState<IRoom[]>([]);
    const [roomLoaded, setRoomLoaded] = useState(false);
    const [selectedRoomNo, setSelectedRoomNo] = useState<string>("");

    const refreshAuth = () => {
        const requestConfig: AxiosRequestConfig = {
            url: `${BACKEND_URL}/token/refresh/`,
            method: "post",
            data: {
                refresh: localStorage.getItem("refreshToken")
            }
        };
        axios(requestConfig)
            .then((response: AxiosResponse) => {
                localStorage.setItem("accessToken", response.data.access);
                setRoomLoaded(false);
            })
            .catch((error: AxiosError) => {
                alert("Session expired. Please login again.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("name");
                localStorage.removeItem("rollNo");
                window.location.href = "/";
            });
    }

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            alert("Login is required");
            window.location.href = "/";
        }

        if (!roomLoaded) {
            const requestConfig: AxiosRequestConfig = {
                url: `${BACKEND_URL}/rooms`,
                method: "get",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            };
            axios(requestConfig)
                .then((response: AxiosResponse) => {
                    console.log(response);
                    setRoomList(response.data);
                    setRoomLoaded(true);
                })
                .catch((error: AxiosError) => {
                    const response = error.response as AxiosResponse<IFailedResponse>;
                    if (response.status !== 401) {
                        alert(response.data.detail);
                    }
                    else {
                        refreshAuth();
                    }
                });
        }
    });

    const handleSelect = (e: MouseEvent<HTMLTableCellElement>) => {
        const roomNo = e.currentTarget.textContent;
        if (selectedRoomNo !== "") {
            document.getElementById(selectedRoomNo)?.classList.remove("selected");
        }
        if (roomNo) {
            setSelectedRoomNo(roomNo);
            document.getElementById(roomNo)?.classList.add("selected");
        }
    };

    const handleBook = () => {
        if (selectedRoomNo === "") {
            alert("Select a room");
            return;
        }
        const requestConfig: AxiosRequestConfig = {
            url: `${BACKEND_URL}/book/`,
            method: "post",
            data: {
                roomNo: selectedRoomNo,
                rollNo: localStorage.getItem("rollNo")
            },
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        };
        axios(requestConfig)
            .then((response: AxiosResponse) => {
                console.log(response);
                alert("Booked successfully");
                window.location.href = "/dashboard";
            })
            .catch((error: AxiosError) => {
                const response = error.response as AxiosResponse<IFailedResponse>;
                if (response.status !== 401) {
                    alert(response.data.detail);
                }
                else {
                    setRoomLoaded(false);
                }
            });
    };



    return (
        <div className="book">
            <h1>Book Room</h1>
            <table>
                <tbody>
                    {roomList.map((room, idx) => {
                        return idx % 5 === 0 ? roomList.slice(idx, idx + 5) : null;
                    }
                    ).filter(room => room !== null).map((room, idx) => {
                        if (room === null) return {};
                        return (
                            <tr key={idx}>
                                {room.map((r, idx) => {
                                    if (r.rollNo !== "0") {
                                        return (
                                            <td key={idx} id={r.roomNo} className="booked" title={`Booked by ${r.rollNo}`}>
                                                {r.roomNo}
                                            </td>
                                        )
                                    }
                                    return (
                                        <td key={idx} id={r.roomNo} className="available" title={"Available"} onClick={handleSelect}>
                                            {r.roomNo}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Link to="/dashboard">
                <button>
                    Dashboard
                </button>
            </Link>
            {
                selectedRoomNo !== "" &&
                <button onClick={handleBook}>Book Room</button>
            }
        </div>
    );

}
export default Book;