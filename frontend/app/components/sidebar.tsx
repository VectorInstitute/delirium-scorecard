'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  Link,
  useColorModeValue,
  Image,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  Tooltip,
  Avatar,
  Divider,
} from '@chakra-ui/react'
import { FiHome, FiClock, FiLogOut, FiMenu, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiUserLine } from 'react-icons/ri'
import NextLink from 'next/link'
import { useAuth } from '../context/auth'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <Box>
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} isCollapsed={false} toggleSidebar={toggleSidebar} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
    </Box>
  )
}

interface SidebarContentProps {
  onClose: () => void
  isCollapsed: boolean
  toggleSidebar: () => void
  display?: object
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, isCollapsed, toggleSidebar, ...rest }) => {
  const bgColor = useColorModeValue('#e6f0fa', '#1f5280')
  const textColor = useColorModeValue('#1f5280', '#ffffff')
  const borderColor = useColorModeValue('#b3d1e6', '#2a6ca5')
  const toggleBtnBgColor = useColorModeValue('#1f5280', '#3a7ab3')
  const dividerColor = useColorModeValue('#c2d4e3', '#2a6ca5')
  const [fullLogoOpacity, setFullLogoOpacity] = useState(1)
  const [iconLogoOpacity, setIconLogoOpacity] = useState(0)

  useEffect(() => {
    if (isCollapsed) {
      setFullLogoOpacity(0)
      setTimeout(() => setIconLogoOpacity(1), 150)
    } else {
      setIconLogoOpacity(0)
      setTimeout(() => setFullLogoOpacity(1), 150)
    }
  }, [isCollapsed])

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={isCollapsed ? '60px' : { base: 'full', md: '240px' }}
      pos="fixed"
      h="full"
      transition="width 0.3s ease"
      {...rest}
    >
      <Flex direction="column" h="full">
        <Flex
          h="32"
          alignItems="center"
          justifyContent="center"
          mb={8}
        >
          <Box
            position="relative"
            width={isCollapsed ? "40px" : { base: "240px", md: "160px" }}
            height="60px"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              opacity={fullLogoOpacity}
              transition="opacity 0.3s ease"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src="/images/odyssey_logo.png"
                alt="adrenaline"
                objectFit="contain"
                width="160%"
                height="160%"
                loading="eager"
              />
            </Box>
            <Box
              position="absolute"
              top="0"
              left="0"
              opacity={iconLogoOpacity}
              transition="opacity 0.3s ease"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src="/images/odyssey_logo.png"
                alt="adrenaline"
                objectFit="contain"
                width="40px"
                height="40px"
                loading="eager"
              />
            </Box>
          </Box>
        </Flex>
        <VStack spacing={4} align="stretch" flex={1}>
          <NavItems textColor={textColor} isCollapsed={isCollapsed} />
        </VStack>
        <Divider borderColor={dividerColor} my={2} />
        <Box my={2}>
          <UserSection textColor={textColor} isCollapsed={isCollapsed} />
        </Box>
        <Divider borderColor={dividerColor} my={2} />
        <Flex
          direction="column"
          alignItems="center"
          mt={4}
          mb={4}
        >
          {!isCollapsed && (
            <>
              <Image
                src="/images/vector_logo.png"
                alt="Vector Institute"
                maxW={{ base: "100px", md: "100px" }}
                h="auto"
                mb={2}
              />
              <Text fontSize="sm" color={textColor} textAlign="center" mt={2} mb={4} fontFamily="'Roboto Slab', serif">
                © {new Date().getFullYear()} odyssey. All rights reserved.
              </Text>
            </>
          )}
          <Tooltip label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right" hasArrow>
            <IconButton
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              onClick={toggleSidebar}
              variant="solid"
              bg={toggleBtnBgColor}
              color={useColorModeValue('#ffffff', '#ffffff')}
              size="sm"
              _hover={{
                bg: useColorModeValue('#3a7ab3', '#2a6ca5'),
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

interface NavItemsProps {
  textColor: string
  isCollapsed: boolean
}

const NavItems: React.FC<NavItemsProps> = ({ textColor, isCollapsed }) => {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <>
      <NavItem icon={FiHome} href="/home" textColor={textColor} isCollapsed={isCollapsed}>
        Home
      </NavItem>
      <NavItem icon={FiClock} href="/history" textColor={textColor} isCollapsed={isCollapsed}>
        History
      </NavItem>
      <NavItem
        icon={FiLogOut}
        href="#"
        textColor={textColor}
        isCollapsed={isCollapsed}
        onClick={handleLogout}
      >
        Logout
      </NavItem>
    </>
  )
}

const UserSection: React.FC<{ isCollapsed: boolean; textColor: string }> = ({ isCollapsed, textColor }) => {
  const { user } = useAuth();
  const router = useRouter();

  const bgColor = useColorModeValue('#e6f0fa', '#1f5280');
  const iconColor = useColorModeValue('#1f5280', '#ffffff');
  const hoverBgColor = useColorModeValue('#b3d1e6', '#2a6ca5');

  const handleClick = () => {
    router.push('/profile');
  };

  return (
    <Tooltip label={isCollapsed ? "View Profile" : ""} placement="right" isDisabled={!isCollapsed}>
      <Flex
        align="center"
        p={isCollapsed ? 2 : 3}
        mx={isCollapsed ? '2' : '4'}
        borderRadius="md"
        bg={bgColor}
        mb={2}
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{ bg: hoverBgColor, transform: 'translateY(-1px)' }}
        onClick={handleClick}
        role="group"
        height="auto"
      >
        <Box position="relative">
          {isCollapsed ? (
            <Icon
              as={RiUserLine}
              boxSize={6}
              color={iconColor}
            />
          ) : (
            <Avatar
              size="sm"
              name={user?.username || 'User'}
              src={user?.avatarUrl}
              bg={iconColor}
              color={bgColor}
            />
          )}
        </Box>
        {!isCollapsed && (
          <Box ml={3}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={textColor}
              isTruncated
              fontFamily="'Roboto Slab', serif"
            >
              {user?.username || 'User'}
            </Text>
            <Text
              fontSize="xs"
              color={textColor}
              opacity={0.8}
              fontFamily="'Roboto Slab', serif"
            >
              {user?.role || 'Role'}
            </Text>
          </Box>
        )}
      </Flex>
    </Tooltip>
  );
};

interface NavItemProps {
  icon: React.ElementType
  children: React.ReactNode
  href: string
  textColor: string
  isCollapsed: boolean
  onClick?: () => void
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, href, textColor, isCollapsed, onClick }) => {
  const bgHover = useColorModeValue('#b3d1e6', '#2a6ca5')
  const activeColor = useColorModeValue('#1f5280', '#ffffff')

  return (
    <Tooltip label={isCollapsed ? children : ''} placement="right" hasArrow>
      <Link
        as={NextLink}
        href={href}
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        onClick={onClick}
      >
        <Flex
          align="center"
          p="4"
          mx={isCollapsed ? '2' : '4'}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: bgHover,
            color: activeColor,
          }}
          transition="all 0.3s"
        >
          <Icon
            mr={isCollapsed ? '0' : '4'}
            fontSize="22"
            as={icon}
            color={textColor}
            _groupHover={{
              color: activeColor,
            }}
          />
          {!isCollapsed && (
            <Text fontSize="md" fontWeight="medium" color={textColor} _groupHover={{ color: activeColor }} fontFamily="'Roboto Slab', serif">
              {children}
            </Text>
          )}
        </Flex>
      </Link>
    </Tooltip>
  )
}

interface MobileNavProps {
  onOpen: () => void
  display?: object
}

const MobileNav: React.FC<MobileNavProps> = ({ onOpen, ...rest }) => {
  const bgColor = useColorModeValue('#e6f0fa', '#1f5280')
  const borderColor = useColorModeValue('#b3d1e6', '#2a6ca5')

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image
        src="/images/odyssey_logo.png"
        alt="adrenaline"
        maxW="150px"
        h="auto"
        ml="4"
      />
    </Flex>
  )
}

export default Sidebar
