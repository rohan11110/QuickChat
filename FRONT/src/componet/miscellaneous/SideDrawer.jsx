import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { Tooltip } from "@/components/ui/tooltip"
import { Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger, MenuItemCommand, } from "@/components/ui/menu"
import { Avatar, AvatarGroup } from "@chakra-ui/react"
import { ChatState } from '@/Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Spinner } from "@chakra-ui/react"
import { getSender } from '@/config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const [bellEnter, setBellEnter] = useState('black');
    const [textColor, setTextColor] = useState("black");
    const [isOpen , setIsOpen] = useState(false);
   
    
   const {user,setSelectedChat , chats, setChats,notification , setNotification} = ChatState();
   const navigate = useNavigate();
   
   const logoutHandler = ()=>{
     localStorage.removeItem("userInfo");
     navigate('/');
   }

   const handleSearch = async()=>{
      setLoading(true);
      if(!search){
        toaster.create({
            title: "Search is Empty",
            description: "Plese Enter the Search Field",
            type :"error",
            positioning : "top left"
        });
      }
      
      try{
          const config = {
            headers : {
                Authorization : `Bearer ${user.token}`, 
            },
          };
          
          const {data} = await axios.get(`${backendUrl}/api/user?search=${search}`, config);
          
          setLoading(false);
          setSearchResult(data);
      }catch(e){
        setLoading(false);
        toaster.create({
            title: "Failed to retrieve",
            description: "Try Again...",
            type :"error",
            positioning : "top left"
        });
      }
   }

   
   const accessChat = async(userId)=>{
       try{
         setLoadingChat(true);
               
         
         
         const config = {
            headers: {
                "Content-type": "application/json",
                'Access-Control-Allow-Origin': '*', 
                Authorization: `Bearer ${user.token}`,
            },
          };
          
          const {data} = await axios.post(`${backendUrl}/api/chat`, { userId }, config);
         
          if(!chats.find((c)=>c._id === data._id)) setChats([data, ...chats]);
         

          setSelectedChat(data);
          setLoadingChat(false);
          

        } catch (e) {
            
            setLoadingChat(false);

            console.error("Error fetching chat:", e.response?.data || e.message); // Log error details

            toaster.create({
                title: "Error fetching chat",
                description: e.response?.data?.message || e.message, // Show more details
                type: "error",
                positioning: "top left",
            });
        }
    }

    return (
        <>
            <Box display='flex' justifyContent='space-between' alignItems='center' w='100%' bg='white' p='5px 10px 5px 10px' borderWidth='5px'>
                <Tooltip content="Search Users to Chat" showArrow positioning={{ placement: "bottom-end" }}>
                  
                    <DrawerRoot placement='start'>
                        <DrawerBackdrop />
                        <DrawerTrigger asChild>
                            <Button variant="ghost" color={textColor} onMouseEnter={() => setTextColor("white")}
                                onMouseLeave={() => setTextColor("black")}>
                                <i className="fa-solid fa-magnifying-glass"   ></i>
                                <Text display={{ base: "none", md: 'flex' }} px='4' color={textColor}>Search User</Text>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader mt='4'>
                               <Input placeholder="Search Here.." value={search} onChange={(e)=> setSearch(e.target.value)} />
                               <Button mt='2' size='xs' onClick=
                               {handleSearch}
                                >Go</Button>
                            </DrawerHeader>
                            <DrawerBody>
                                {loading ? (<ChatLoading />) : (
                                    searchResult?.map((user)=>(
                                        
                                        <UserListItem  key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                                    ))
                                )}
                                {loadingChat && <Spinner/>}
                            </DrawerBody>
                            
                            <DrawerCloseTrigger />
                        </DrawerContent>
                    </DrawerRoot>
                </Tooltip>
                <Toaster />
                <Text fontSize='2xl' fontFamily='Work sans'>
                    QuickChat
                </Text>
                <div>
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Button variant="outline"  color={textColor} size="sm" onMouseEnter={() => setTextColor("white")}
                                onMouseLeave={() => setTextColor("black")} >
                                    
                                {notification.length >= 1 && <NotificationBadge count={notification.length} effect={Effect.SCALE} />}
                                <i class="fa-solid fa-bell" ></i>
                            </Button>
                        </MenuTrigger>
                        <MenuContent mr={2}>
                            <MenuItem pl={2}>
                                {!notification.length && "No Messages"}
                                {notification.map((notif) => (
                                    <MenuItem key={notif._id} onClick={()=>{
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n)=> n !== notif))
                                    }}>
                                        {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                                ))}
                            </MenuItem>
                        </MenuContent>
                       
                    </MenuRoot>

                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Button variant="outline" color={textColor} size="sm" onMouseEnter={() => setTextColor("white")}
                                onMouseLeave={() => setTextColor("black")}>
                                <i class="fa-solid fa-angle-down"></i>
                                <Avatar.Root variant='solid' size='xs'>
                                    <Avatar.Image src={user.pic} />
                                    <Avatar.Fallback name={user.name} />
       
                                </Avatar.Root>
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            <ProfileModel user={user}>
                                <MenuItem >
                                    My Profile
                                </MenuItem>
                            </ProfileModel>
                            <MenuItem value="new-file-a" onClick={logoutHandler}>
                                Logout
                            </MenuItem>

                        </MenuContent>
                    </MenuRoot>
                </div>
            </Box>
           
        </>
    )
}

export default SideDrawer
