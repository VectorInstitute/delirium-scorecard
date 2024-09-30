import Image from 'next/image'
import { Box } from '@chakra-ui/react'

interface LogoProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export default function Logo({ src, alt, width, height, priority = false }: LogoProps) {
  return (
    <Box mb={4}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        unoptimized={src.endsWith('.gif')}
      />
    </Box>
  )
}
