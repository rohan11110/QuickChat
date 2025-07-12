import { VStack } from '@chakra-ui/react'
import React from 'react'
import { Field, Input } from "@chakra-ui/react"
import { useState } from 'react'
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const backendUrl = import.meta.env.VITE_BACKEND_URL;




const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
 
 
  const navigate = useNavigate();

  

  const submitHandle = async () => {
    
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Plese Enter All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
   
    if(password !== confirmPassword){
      toaster.create({
        title: "Password do not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try{
      const config ={
        header : {
          "Content-Type" : "application/json",
        },
      }
       
      const {data} = await axios.post(`${backendUrl}/api/user`,{name,email,password},config);
      toaster.create({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate("/chats");
    }catch(e){
      toaster.create({
        title: "Error occured",
        description : e.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     
    }
  }


  return (
    <VStack spacing="5px" color='black'>
      <Field.Root id='first-name' >
        <Field.Label>Name</Field.Label>
        <Input value={name} placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
      </Field.Root>
      <Field.Root id='email' >
        <Field.Label>Email</Field.Label>
        <Input value={email} placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
      </Field.Root>
      
      <Field.Root id='password' >
        <Field.Label>Password</Field.Label>
        <PasswordInput
          name="password"
          
          value={password}
          
         
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field.Root>
        

      <Field.Root id='confirm-password'>
        <Field.Label>Confirm Password</Field.Label>
        <PasswordInput
         
          placeholder="Confirm Your Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />
       
       
      </Field.Root>

    
      <Toaster />
      <Field.Root  style={{marginTop : 15}}>
        <Button variant="surface" onClick={submitHandle}>SignUp</Button>
      </Field.Root>
    </VStack>


  )
}

export default Signup
