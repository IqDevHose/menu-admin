import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Card } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

type Props = {}

const SendOffer = (props: Props) => {
    const navigate = useNavigate();
  const location = useLocation();
  const offer = location.state; 
  return (
    <div>
        <Card
            key={offer.id}
            className="cursor-pointer hover:shadow-lg transition-shadow w-96"
          >
            <AspectRatio ratio={16 / 9}>
              <>{console.log(offer.image)}</>
              <img
                src={offer.image}
                alt={offer.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </AspectRatio>
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{offer.title}</CardTitle>
              <CardDescription className="truncate">
                {offer.description}
              </CardDescription>
            </CardHeader>
            <Separator />
            {/* <CardFooter className="flex justify-end p-3 items-center">
              <div className="flex items-center gap-4">
              
              </div>
            </CardFooter> */}
          </Card>
    </div>
  )
}
export default SendOffer