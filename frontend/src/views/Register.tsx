import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "../constants";
import { Link } from "react-router-dom";
import { IFailedResponse } from "../interfaces";

interface IRegisterInput {
    rollNo: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

function Register() {

    useEffect(() => {
        if (localStorage.getItem("accessToken"))
            window.location.href = "/dashboard";
    });

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<IRegisterInput>();

    const onSubmit: SubmitHandler<IRegisterInput> = data => {
        const requestConfig: AxiosRequestConfig = {
            url: `${BACKEND_URL}/register/`,
            method: "post",
            data: data
        };
        axios(requestConfig)
            .then((response: AxiosResponse) => {
                console.log(response);
                alert("Registered successfully");
                window.location.href = "/";
            })
            .catch((error: AxiosError) => {
                const response = error.response as AxiosResponse<IFailedResponse>;
                alert(response.data.detail);
            });
    };

    return (
        <div className="register">
            <h1>Register</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Roll No." {...register("rollNo", { required: true })} />
                <input type="text" placeholder="Name" {...register("name", { required: true })} />
                <input type="text" placeholder="Email" {...register("email", { required: true })} />
                <input type="text" placeholder="Mobile" {...register("phoneNumber", { required: true, validate: (value) => value.length === 10 || "Mobile number should be of 10 digits" })} />
                <input type="password" placeholder="Password" {...register("password", { required: true })} />
                <input type="password" placeholder="Confirm Password" {...register("confirmPassword", { required: true, validate: (value) => value === getValues("password") || "The passwords do not match." })} />
                {errors.rollNo && <span>Roll No. is required</span>}
                {errors.name && <span>Name is required</span>}
                {errors.email && <span>Email is required</span>}
                {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
                {errors.password && <span>Password is required</span>}
                {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                <input type="submit" value="Register" />
                <Link to="/">
                    <button>
                        Login
                    </button>
                </Link>
            </form>
        </div>
    );
}
export default Register;