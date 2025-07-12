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

import { Button, Text, Image, IconButton } from '@chakra-ui/react'; // Ensure correct imports
import { FaEye } from "react-icons/fa";

const ProfileModel = ({ user, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)} isCenterd>
            {/* Render trigger button or custom children */}
            <PopoverTrigger asChild>
                {children ? (
                    children
                ) : (
                    <IconButton border='1px solid black' backgroundColor='#F5F5F5' aria-label="Call support" display={{ base: 'flex' }} ><FaEye /></IconButton>
                )}
            </PopoverTrigger>

            {/* Popover content */}
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody display="flex" flexDirection="column" alignItems="center">
                    <PopoverTitle>{user.name}</PopoverTitle>
                    <Image
                        src={user.pic}
                        alt="Profile"
                        width="60px"
                        borderRadius="50%"
                        mt="1rem"
                    />
                    <Text mt="1rem">{user.email}</Text>
                    <PopoverCloseTrigger />
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};

export default ProfileModel;
