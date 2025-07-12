import { Box } from '@chakra-ui/react'
import React from 'react'
import { CgClose } from "react-icons/cg";

const UserBadgeItem = ({user , handleFunction}) => {
  return (
    <Box px={2} py={1} display='flex' flexDirection='row' gap='5px' borderRadius='lg' m={1} mb={2} variant='solid' fontSize={12} backgroundColor='purple' color='white' cursor='pointer' onClick={handleFunction}>
      {user.name}<CgClose />
    </Box>
  )
}

export default UserBadgeItem

