import React from 'react'
import axios from 'axios'
import { useState , useEffect } from 'react'
import { ChatState } from '@/Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '@/componet/miscellaneous/SideDrawer';
import MyChats from '@/componet/MyChats'
import ChatBox from '@/componet/ChatBox'

const ChatPage = () => {
 
  const {user} = ChatState();
  const[fetchAgain , setFetchAgain] = useState(false);
  
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display='flex' justifyContent='space-between' width='100%' height='91.5vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>

  )
}

export default ChatPage
