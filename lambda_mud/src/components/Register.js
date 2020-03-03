import React, {useState} from 'react'
import {Form, Field, withFormik} from 'formik'
import * as Yup from 'yup'
import BeatLoader from "react-spinners/BeatLoader";
import axios from 'axios'
import {useHistory, Link} from 'react-router-dom'

const RegisterShape = ( props ) => {

    const { isSubmitting, touched, errors } = props


    const requestErr = errors.requestErr

    const history = useHistory()

    return (
        <div className = 'auth'>
            <h1>Sign Up</h1>
            <Form >
                <div className = "field">
                    <label htmlFor = "username">
                        USERNAME
                    </label>
                    <Field name = "username" type = 'text'/>
                    { touched.username && errors.username ? 
                        <p className = 'error' >{touched.username && errors.username}</p>
                    : null }
                </div>
                <div className = "field">
                    <label htmlFor = "password">
                        PASSWORD
                    </label>
                    <Field name = "password" type= 'password' />
                    { touched.password && errors.password ? 
                        <p className = 'error' >{touched.password && errors.password}</p>
                    : null }
                </div>
                <div className = "confirm password field">
                    <label htmlFor = "confirmPassword">
                        CONFIRM PASSWORD
                    </label>
                    <Field name = "confirmPassword" type = 'password'/>
                    { touched.confirmPassword && errors.confirmPassword ? 
                        <p className = 'error' >{touched.confirmPassword && errors.confirmPassword}</p>
                    : null }
                </div>
                <button type = 'submit'>{ isSubmitting ? 
                        <BeatLoader 
                        size = {8}
                        color = {"#1a1a1a"}
                        /> 
                        : "GET STARTED"}
                </button>
                <p className = 'auth-link'>Already have an account? <Link to ='/login'>Login here</Link></p>
                {Boolean(requestErr) ?
                    Object.values(requestErr.response.data).map(item => {
                        return <p className = "error">{item}</p>
                    })
                    : null }
            </Form>
        </div>
    )
}

const Register = withFormik({
    mapPropsToValues({username, password, confirmPassword}){
        return {
            username: username || '',
            password: password || '',
            confirmPassword: confirmPassword || ''
        }
    },
    validationSchema: Yup.object().shape({
        username: Yup
            .string()
            .required('Required'),
        password: Yup
            .string()
            .required("Required")
            .min(8, "Password must have 8 characters"),
        confirmPassword: Yup
            .string()
            .when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Passwords entered do not match"
            )
            .required("Required")
        })
    }),
    handleSubmit(values, props){

        const { history } = props.props

        const packet = {
            username: values.username,
            password1: values.password,
            password2: values.confirmPassword
        }

        props.setSubmitting(true)
        
        axios.post(`https://ferrari-mud.herokuapp.com/api/registration/`, packet)
        .then(res => {
            localStorage.setItem("key", res.data.key)
            props.setSubmitting(false)
            history.push("/play")
        })
        .catch(err => { 
            props.setSubmitting(false)
            props.setErrors({requestErr: err})
        })
        
        
    }
    
})(RegisterShape)

export default Register