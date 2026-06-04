import { Button, ButtonGroup, BlockStack, Text } from "@shopify/polaris";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <BlockStack gap="400">
      <Text as="h1" variant="headingXl">Welcome to the Home page</Text>
    <ButtonGroup>
      <Button url="/">Home</Button>
      <Button url="/dashboard" variant="primary">Dashboard</Button>
    </ButtonGroup>
    </BlockStack>
  );
}