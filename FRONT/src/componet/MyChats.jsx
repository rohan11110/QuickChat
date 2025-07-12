import { ChatState } from '@/Context/ChatProvider'
import React, { useEffect } from 'react'
import { Toaster, toaster } from "@/components/ui/toaster"
import {useState} from 'react';
import { Box, Stack } from "@chakra-ui/react"
import { Button, ButtonGroup } from "@chakra-ui/react"
import ChatLoading from './ChatLoading';
import { Text } from "@chakra-ui/react"
import { getSender } from '../config/ChatLogic';
import GroupChatModel from './miscellaneous/GroupChatModel';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
const MyChats = ({fetchAgain}) => {
  const[loggedUser , setLoggedUser] = useState();
  const{selectedChat , setSelectedChat , user , chats , setChats} = ChatState();

  const fetchChats = async()=>{
    
    try{

        const config = {
          headers : {
              Authorization : `Bearer ${user.token}`, 
          },
        };
       
        const {data} = await axios.get(`${backendUrl}/api/chat`, config);
        
        setChats(data);
    }catch(e){
      
      toaster.create({
          title: "Error",
          description: "failed to load chat",
          type :"error",
          positioning : "top left"
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    // Small delay to ensure user is set
     fetchChats();
  }, [fetchAgain]);
  

   
    
  return (
    <Box display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection='column'
      alignItems='center'
      p={3}
      bg='white'
      width={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
      >
     
      <Box pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display='flex'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        Chats
        <GroupChatModel>

          <Button display='flex' border='1px solid black' fontSize={{ base: '17px', md: '5px', lg: '12px' }} >New Group Chat</Button>
        </GroupChatModel>
      </Box>

      <Box
       display='flex'
       flexDirection='column'
       p={3}
       backgroundColor="#F8F8F8"
       width='100%'
       height='100%'
       borderRadius='lg'
       overflowY='hidden'

     >{chats ? (
      <Stack overflowY='scroll'>
        {chats.map((chat)=>(
          <Box onClick={()=> setSelectedChat(chat)}
               cursor='pointer'
               backgroundColor={selectedChat === chat ? '#38B2AC' : "#E8E8E8"}
               color={selectedChat === chat ? 'white' : 'black'}
               px={3}
               py={2}
               borderRadius='lg'
               key={chat._id}
          >
            <Text>{!chat.isGroupChat ? getSender(loggedUser , chat.users) : chat.chatName}</Text>
          </Box>
        ))}
      </Stack>

     ):(<ChatLoading />)}</Box>
    </Box>
  )
}

export default MyChats
