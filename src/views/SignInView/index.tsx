import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { signIn } from "next-auth/react";

export const SignInView: React.FC = () => {
  return (
    <Container
      size="md"
      className="py-8 h-screen flex items-center justify-center"
    >
      <div className="p-12 space-y-8 bg-dark-light rounded-lg w-full">
        <img
          src="https://storage.googleapis.com/underdog-protocol/logos/full_dark.svg"
          alt="logo"
        />

        <Button
          type="primary"
          size="lg"
          block
          onClick={() => signIn("reddit", { callbackUrl: "/" })}
        >
          Sign in with Reddit
        </Button>
      </div>
    </Container>
  );
};
