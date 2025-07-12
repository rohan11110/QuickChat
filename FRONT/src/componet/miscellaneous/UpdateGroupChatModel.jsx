
import React, { useState } from "react";
import {
    PopoverRoot,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverTitle,
    PopoverArrow,
    PopoverCloseTrigger,
} from "@/components/ui/popover"; // Adjust based on your Chakra UI import paths

import { Button, Text, Image, IconButton, Box, Spinner } from '@chakra-ui/react'; // Ensure correct imports
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { Field, Input } from "@chakra-ui/react"
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Toaster, toaster } from "@/components/ui/toaster"
import UserListItem from "../userAvatar/UserListItem";
const UpdateGroupChatModel = ({fetchAgain , setFetchAgain , fetchMessage}) => {
   const [open, setOpen] = useState(false);
   const[groupChatName ,setGroupChatName] = useState();
   const[search , setSearch] = useState("");
   const [searchResult , setSearchResult] = useState([]);
   const[loading , setLoading] = useState(false);
   const[renameLoading , setRenameLoading] = useState(false);
   const {selectedChat , setSelectedChat , user} = ChatState();
  

    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toaster.create({
                title: "Error",
                 description: "Only admins can add users",
                type: "error",
                positioning: "top left"
            });

            return;
        }

        try {

            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${backendUrl}/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId : user1._id,
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessage();
            setLoading(false);

        } catch (e) {
            setLoading(false);
            toaster.create({
                title: "Error",
                description: e.response.data.message,
                type: "error",
                positioning: "top left"
            });
            setGroupChatName("");

        }
     };
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {

            toaster.create({
                title: "User Already in group",

                type: "error",
                positioning: "top left"
            });

            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toaster.create({
                title: "Only admins can add users",

                type: "error",
                positioning: "top left"
            });

            return;
        }
   
        try {

            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${backendUrl}/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId : user1._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (e) {
            setLoading(false);
            toaster.create({
                title: "Error",
                description: e.response.data.message,
                type: "error",
                positioning: "top left"
            });
            setGroupChatName("");

        }

   };
   const handleRename = async()=>{
       if(!groupChatName) return;

       try{

           setRenameLoading(true);
           const config = {
               headers: {
                   Authorization: `Bearer ${user.token}`,
               },
           };

           const { data } = await axios.put(`${backendUrl}/api/chat/rename`, {
               chatId: selectedChat._id,
               chatName: groupChatName,
           }, config);

           setSelectedChat(data);
           setFetchAgain(!fetchAgain);
           setRenameLoading(false);

       } catch (e) {
           setRenameLoading(false);
           toaster.create({
               title: "Failed to retrieve",
               description: "Try Again...",
               type: "error",
               positioning: "top left"
           });
           setGroupChatName("");

       }
   };
   const handleSearch = async(query)=>{
    setSearch(query);

        if (!query) return;

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${backendUrl}/api/user?search=${search}`, config);
           
            setLoading(false);
            setSearchResult(data);
        } catch (e) {

            setLoading(false);
            toaster.create({
                title: "Failed to retrieve",
                description: "Failed to search Chats",
                type: "error",
                positioning: "top left"
            });
        }
   };

  
      return (
          <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)} isCenterd>
              {/* Render trigger button or custom children */}
              <PopoverTrigger asChild>
                  
                      <IconButton border='1px solid black' backgroundColor='#F5F5F5' aria-label="Call support" display={{ base: 'flex' }} ><FaEye /></IconButton>
                  
              </PopoverTrigger>
                <Toaster />
              {/* Popover content */}
              <PopoverContent>
                  <PopoverArrow />
                  
                  <PopoverBody display="flex" flexDirection="column"  gap='1rem' alignItems="center">
                      <PopoverTitle>{selectedChat.chatName}</PopoverTitle>
                      <Box width='100%' display='flex' flexWrap='wrap' pb={3}>
                      {selectedChat.users.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                      </Box>

                      <Field.Root display='flex' flexDirection='row'>

                          <Input placeholder="Rename Chat" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                          <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                      </Field.Root>
                      <Field.Root display='flex' flexDirection='column'>

                          <Input placeholder="Add user" mb={3}  onChange={(e) => handleSearch(e.target.value)} />
                          {loading ? <p>Data Loading ...</p>  : searchResult?.map((user)=>(
                            <UserListItem
                              key={user._id}
                              user={user}
                              handleFunction={()=> handleAddUser(user)}  />
                          ))}
                      </Field.Root>
                        <Button onClick={()=> handleRemove(user)} backgroundColor='red'>Leave Group</Button>
                      <PopoverCloseTrigger />
                  </PopoverBody>
              </PopoverContent>
          </PopoverRoot>
      );
}

export default UpdateGroupChatModel
