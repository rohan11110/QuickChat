import React from 'react'
import { VStack } from '@chakra-ui/react'

import { Field, Input } from "@chakra-ui/react"
import { useState } from 'react'
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@chakra-ui/react"
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { Toaster, toaster } from "@/components/ui/toaster"
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Login = () => {

 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const nevigate = useNavigate();

  

  const submitHandle = async () => {
    if (!email || !password) {
      toaster.create({
        title: "Plese Enter All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try{
      const config = {
        headers : {
          "Content-Type": "application/json",
        },
      };

      const {data} = await axios.post(`${backendUrl}/api/user/login`,{email,password},config);
      toaster.create({
        title: "Login Success",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      nevigate('/chats');
    }catch(err){
      toaster.create({
        title: "Error occured",
        description : err.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  return (


    <VStack spacing="5px" color='black'>
      <Toaster />
      <Field.Root id='email-login'>
        <Field.Label>Email</Field.Label>
        <Input value={email} placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
      </Field.Root>

      <Field.Root id='password-login'>
        <Field.Label>Password</Field.Label>
        <PasswordInput
          name="password"
          
          value={password}
          
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field.Root>

      <Field.Root  style={{ marginTop: 15 }}>
        <span>
        <Button variant="surface" onClick={submitHandle}>LogIn</Button>
        <Button variant="surface" style={{  border : "2px solid black",color:'white',marginLeft:20}}  onClick={()=>{setEmail("guest@gmail.com");setPassword("123456");}}>Guest User Credentials</Button>
        </span>
      </Field.Root>

      
      
      

      

     
    </VStack>



  )
}

export default Login
