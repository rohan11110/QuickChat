import { ChatState } from '../Context/ChatProvider'
import { Box, Text, Toast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BsArrowLeftSquare } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react"
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import { Field, Input } from "@chakra-ui/react"
import { Spinner } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import './style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from './animations/typing.json';
const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const { user, selectedChat, setSelectedChat, notification , setNotification } = ChatState();
    const [socketConnected , setSocketConnected] = useState(false);
    const[typing,setTyping] = useState(false);
    const[isTyping , setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

   
    const sendMesssage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {

                const config = {
                    headers: {
                        "Content-type": "application/json",
                        'Access-Control-Allow-Origin': '*',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${backendUrl}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                
                socket.emit('new message', data);
               
                setMessages([...messages, data]);
            } catch (e) {
                toaster.create({
                    title: "Error occured",
                    description: 'Failed to Send Meassage', // Show more details
                    type: "error",
                    positioning: "top left",
                });
            }

        }
    }

    const fetchMessage = async (req , res)=>{
        if(!selectedChat) return;

        try{
            const config = {
              headers : {
                  Authorization : `Bearer ${user.token}`, 
              },
            };
            setLoading(true);
            const {data} = await axios.get(`${backendUrl}/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        }catch(e){
          setLoading(false);
          toaster.create({
              title: "Error Occured",
              description: "Failed to Load Messages...",
              type :"error",
              positioning : "top left"
          });
        }
    }

   

    useEffect(()=>{
        fetchMessage();

        selectedChatCompare = selectedChat;
    },[selectedChat])
   
    
    
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on("connected",()=> setSocketConnected(true));
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
    },[])

    

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
               if(!notification.includes(newMessageRecieved)){
                  setNotification([newMessageRecieved, ...notification]);
                  setFetchAgain(!fetchAgain);
               }
            }else{
                setMessages([...messages,newMessageRecieved]);
            }
        });
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            } 
        },timerLength);
    }





    
    return (
        <>
            {
                selectedChat ? (<>
                    <Text fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        width='100%'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems='center'
                    >
                        <IconButton display={{ base: 'flex', md: 'none' }} onClick={() => setSelectedChat("")}>
                            <BsArrowLeftSquare />
                        </IconButton>

                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  fetchMessage={fetchMessage} />}
                            </>
                        )}
                    </Text>
                    <Toaster />
                    <Box display='flex' flexDirection='column' justifyContent='flex-end' p={3} backgroundColor='#E8E8E8' width='100%' height='100%' borderRadius='lg' overflowY='hidden'>
                        {loading ? <Spinner size='xl' width={20} height={20} alignSelf='center' margin='auto' /> : (
                            <div className='messages'>
                               <ScrollableChat messages={messages} />
                            </div>
                        )}
                         {isTyping ?<div><Lottie options={defaultOptions} width={70} style={{marginBottom: 15, marginLeft:0}}/></div>:(<></>)}
                        <Field.Root onKeyDown={sendMesssage}  mt='3'>
                             
                            <Input placeholder="Enter Message Here ..." bg='E0E0E0' onChange={typingHandler} value={newMessage} />

                        </Field.Root>
                    </Box>
                </>
                )
                    : (<Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                        <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                            Click on a user to start chatting
                        </Text>
                    </Box>)
            }
        </>
    )
}

export default SingleChat
