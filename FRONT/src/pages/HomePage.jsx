import React from 'react'
import { Container , Box , Text } from '@chakra-ui/react'
import { Tabs } from "@chakra-ui/react"
import Login from "../componet/authentication/Login";
import Signup from "../componet/authentication/Signup";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const HomePage = () => {

  const navigate = useNavigate();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
   

    if(!user){
       navigate('/chats');
    }
  },[navigate]);

  return (
    <Container maxW='xl' centerContent>
      <Box d='flex' justifyContent="center" alignItems="center" p={3} bg={"white"} w="100%" m="40px 0 15px 0" borderRadius='lg' borderWidth="1px">
        <Text textAlign="center" fontSize="4xl" fontFamily="Work sans" color="black">QuickChat</Text>
      </Box>

      <Box bg="white" w="80%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List>
            <Tabs.Trigger value="tab-1">LogIn</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">SignUp</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="tab-1"><Login /></Tabs.Content>
          <Tabs.Content value="tab-2"><Signup /></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default HomePage
