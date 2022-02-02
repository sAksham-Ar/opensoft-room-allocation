import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "../constants";
import { IFailedResponse } from "../interfaces";

interface ILoginInput {
    rollNo: string;
    password: string;
}

function Login() {

    useEffect(() => {
        if (localStorage.getItem("accessToken"))
            window.location.href = "/dashboard";
    });

    const { register, handleSubmit, formState: { errors } } = useForm<ILoginInput>();
    const onSubmit: SubmitHandler<ILoginInput> = data => {
        const requestConfig: AxiosRequestConfig = {
            url: `${BACKEND_URL}/login/`,
            method: "post",
            data: data
        };
        axios(requestConfig)
            .then((response: AxiosResponse) => {
                console.log(response);
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("rollNo", response.data.rollNo);
                window.location.href = "/dashboard";
            })
            .catch((error: AxiosError) => {
                const response = error.response as AxiosResponse<IFailedResponse>;
                alert(response.data.detail);
            });
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Roll No." {...register("rollNo", { required: true })} />
                <input type="password" placeholder="Password" {...register("password", { required: true })} />
                {errors.rollNo && <span>Roll No. is required</span>}
                {errors.password && <span>Password is required</span>}
                <input type="submit" value="Login" onClick={handleSubmit(onSubmit)} />
                <Link to="/register">
                    <button>
                        Register
                    </button>
                </Link>
            </form>
        </div>
    );
}
export default Login;