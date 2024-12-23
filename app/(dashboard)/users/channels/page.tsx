"use client";
import { getChannelByUserId } from "@/actions/channelAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import FallbackLoading from "@/components/Loading";
import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { channels_status, events, follows, users } from "@prisma/client";
import { Plus, UserRoundPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "@/components/FileUpload";
import { eventPayment } from "@/actions/eventAction";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channel", link: "/users/channels" },
];

type ChannelUser = {
  id: string;
  image: string;
  name: string | null;
  description: string | null;
  status: channels_status;
  users: users | null;
  events: events[] | null;
  follows: follows[] | null;
};

export default function Page() {
  const [channels, setChannels] = useState<ChannelUser | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentImage, setPaymentImage] = useState<string | undefined>("");
  const getData = async () => {
    const req = await getChannelByUserId();
    setChannels(req);
    setLoading(false);
  };

  const router = useRouter();

  const handleCheckChannelVerification = () => {
    if (channels?.status === "VERIFIED") {
      router.push("/users/channels/events/create");
    } else {
      toast.error("Tunggu diverifikasi oleh admin!");
    }
  };

  const handleUpdatePayment = async (
    user_event_id: string,
    image_url: string
  ) => {
    const req = await eventPayment(user_event_id, image_url);

    if (req) {
      toast.success("Pembayaran berhasil!");
      window.location.reload();
      return;
    }

    toast.error("Terjadi kesalahan!");
  };

  const handleSubmitPayment = async (user_event_id: string) => {
    if (paymentImage == "" || !paymentImage) {
      toast.error("Upload bukti pembayaran!");
    } else {
      await handleUpdatePayment(user_event_id, paymentImage);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          {loading ? (
            <FallbackLoading />
          ) : (
            <>
              {channels ? (
                <>
                  <div className="relative h-[300px]">
                    <Image
                      src={channels?.image || ""}
                      fill
                      alt="background"
                      sizes="100%"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-40 h-40">
                          <AvatarImage src={channels.image || ""} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-2xl">
                            {channels?.name}
                          </h3>
                          <div className="flex gap-2">
                            <p className="text-muted-foreground text-sm">
                              {channels?.users?.wallet_address}
                            </p>
                            <p className="text-muted-foreground text-sm">|</p>
                            <p className="text-muted-foreground text-sm">
                              {channels?.follows?.length ?? 0} Followers
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {channels?.events?.length ?? 0} Event
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={"secondary"}
                          className="hover:text-primary"
                          onClick={handleCheckChannelVerification}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Tambah Event
                        </Button>
                        <Link
                          href={"/users/channels/update/" + channels?.id}
                          className={cn(buttonVariants({ variant: "default" }))}
                        >
                          <UserRoundPen className="mr-2 h-4 w-4" /> Edit Channel
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <Tabs defaultValue="events" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="events">Daftar Event</TabsTrigger>
                      <TabsTrigger value="description">Deskripsi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {channels?.events?.map((event) => (
                          <Card
                            key={event.id}
                            className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                          >
                            <div className="relative w-full h-[300px]">
                              <Image
                                src={event.image || ""}
                                alt="image"
                                fill
                                sizes="100%"
                                loading="lazy"
                                className="object-cover w-full h-full rounded-t-lg"
                              />
                            </div>
                            <CardHeader>
                              <CardTitle>
                                <div className="flex w-full justify-between items-center">
                                  {event.name}
                                </div>
                              </CardTitle>
                              <CardDescription className="max-w-lg">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: event.description
                                      ? event.description.length > 100
                                        ? `${event.description.slice(
                                            0,
                                            100
                                          )}...`
                                        : event.description
                                      : "",
                                  }}
                                />
                              </CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <div className="ms-auto flex gap-2">
                                <Link
                                  href={
                                    "/users/channels/events/dashboard/" +
                                    event.id
                                  }
                                >
                                  <Button
                                    variant={"secondary"}
                                    className="hover:text-primary transition-all duration-300"
                                  >
                                    Dashboard Analytic
                                  </Button>
                                </Link>
                                <Link href={"/events/" + event.id}>
                                  <Button variant={"default"}>
                                    Detail Event
                                  </Button>
                                </Link>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="description" className="space-y-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: channels?.description || "",
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="border-2 border-dotted rounded-lg mt-10 h-[200px] flex justify-center items-center">
                  <Link
                    href={"/users/channels/create"}
                    className={cn(buttonVariants({ variant: "default" }))}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Buat Channel
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </Suspense>
  );
}
