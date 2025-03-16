import { ChakraProvider } from "@chakra-ui/react";

export default function _app({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
