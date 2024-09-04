import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Socials from "@/components/auth/socials";
import BackButton from "@/components/auth/back-button";

type AuthCardProps = {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  backButtonHref: string;
  backButtonLabel: string;
  backButtonText: string;
  showSocials?: boolean;
};
export default function AuthCard({
  children,
  cardTitle,
  cardDescription,
  backButtonHref,
  backButtonLabel,
  backButtonText,
  showSocials = true,
}: AuthCardProps) {
  return (
    <Card className="mx-auto max-w-sm mt-12 md:mt-20">
      <CardHeader>
        <CardTitle className="text-2xl">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardContent>
        <div>{children}</div>
        <Separator className="my-4" />
        {showSocials && <Socials />}
        <div className="mt-4 text-center text-sm">
          <BackButton
            text={backButtonText}
            href={backButtonHref}
            label={backButtonLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
}
