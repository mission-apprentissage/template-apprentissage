import { Box, Center, VStack } from '@chakra-ui/react'
import Link from 'next/link'

const Homepage = () => {
  return (
    <Center height="100vh">
      <VStack>
        <Box>Bienvenue sur la Mission Apprentissage</Box>
        <Link href="/login">Login</Link>
      </VStack>
    </Center>
  )
}

export default Homepage
