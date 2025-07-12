import React, { useState } from 'react'
import { Button, Input, Stack, Textarea } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import {
    PopoverArrow,
    PopoverBody,
    PopoverCloseTrigger,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
    PopoverTitle,
} from "@/components/ui/popover"
import { ChatState } from '@/Context/ChatProvider'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Toaster, toaster } from "@/components/ui/toaster"
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import { Box } from "@chakra-ui/react"

const GroupChatModel = ({ children }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
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
    }


    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toaster.create({
                title: "Plese fill all the fields",
                description: "Warning",
                type: "error",
                positioning: "top left"
            });
        }

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`${backendUrl}/api/chat/group`,{
                name : groupChatName,
                users : JSON.stringify(selectedUsers.map((u)=>u._id)), 
            }, config);

            setChats([data,...chats]);
            toaster.create({
                title: "New group chat created",
                description: "Successfully",
                type: "success",
                positioning: "top left"
            });

        }catch(e){
        
            toaster.create({
                title: "Failed to Create chat",
                description: e.response.data,
                type: "error",
                positioning: "top left"
            });
        }
    }

    const handleDelete = (delUser)=>{
       setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== delUser._id));
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toaster.create({
                title: "User already added",
                description: "Warning",
                type: "error",
                positioning: "top left"
            });
        }

        setSelectedUsers([...selectedUsers ,userToAdd]);
    };

    return (
        <PopoverRoot>
            <PopoverTrigger asChild>
                <span>{children}</span>

            </PopoverTrigger>
            <Toaster />
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <PopoverTitle fontSize='25px' marginBottom='1rem' fontFamily='Work sans' display='flex' justifyContent='center'>Create Group Chat</PopoverTitle>
                    <Stack gap="3">
                        <Field >
                            <Input placeholder="Chat Name" onChange={(e) => setGroupChatName(e.target.value)} />
                        </Field>
                        <Field >
                            <Input placeholder="Add Users" onChange={(e) => handleSearch(e.target.value)} />
                        </Field>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                        {loading ? <div>loading</div>:(
                            searchResult?.slice(0,4).map(user =>
                                <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)} />
                            )
                        )}
                        <Field>
                            <Button onClick={handleSubmit}>
                                Create Chat
                            </Button>
                        </Field>
                    </Stack>
                </PopoverBody>
                <PopoverCloseTrigger />

            </PopoverContent>
        </PopoverRoot>
    );

}

export default GroupChatModel
