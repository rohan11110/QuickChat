
import React from 'react'
import { Button, Card, HStack, Stack, Strong, Text } from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar"

const UserListItem = ({user , handleFunction}) => {
  
    
  return (
      <Card.Root mb='2' width="250px" >

          <Card.Body onClick={handleFunction}> 
              <HStack mb="1" gap="1">
                  <Avatar
                      src={user.pic}
                      name={user.name}
                      size='xs'

                  />
                  <Stack gap="0">
                      <Text fontWeight="semibold"  textStyle="xs">
                          {user.name}
                      </Text>
                      <Text color="fg.muted" textStyle="xm">
                          @{user.email}
                      </Text>
                  </Stack>
              </HStack>
          </Card.Body>
      </Card.Root>
  )
}

export default UserListItem
