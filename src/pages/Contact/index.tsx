import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Mail, PhoneCall } from "lucide-react";

export default function Main() {

    return (
        <div className="flex items-stretch lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10 bg-white">
            <div className="flex items-stretch w-full border px-20 rounded-3xl gap-20">
                <div className="flex flex-col w-1/3 gap-6 py-20">
                    <span className="text-2xl font-bold">Contact</span>
                    <p className="text-neutral-500">Fill the form below or write us .We will help you as soon as possible</p>
                    <div className="flex items-center gap-3 mt-6 w-full">
                        <Card className="flex-1 flex flex-col items-center justify-center p-6 gap-4 shadow-none rounded-xl bg-neutral-100 border-none">
                            <div className="flex size-10 items-center justify-center border rounded-full">
                            <PhoneCall />
                            </div>
                            <span className="font-bold text-lg">Phone</span>
                            <span className="text-neutral-500">+1347-430-9510</span>
                        </Card>
                        <Card className="flex-1 flex flex-col items-center justify-center p-6 gap-4 shadow-none rounded-xl bg-slate-100 border-none">
                            <div className="flex size-10 items-center justify-center border rounded-full">
                            <Mail />
                            </div>
                            <span className="font-bold text-lg">Email</span>
                            <span className="text-neutral-500">tondisè@gmail.com</span>
                        </Card>
                    </div>
                    <span className="text-xl font-bold my-6">Get In Touch</span>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="Name">Name<span className="text-red-500">*</span></Label>
                        <Input type="text" placeholder="John Doe"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                        <Input type="email" placeholder="exemple@email.com"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subject">Subject<span className="text-red-500">*</span></Label>
                        <Input type="text" placeholder="Enter subject"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="message">Message<span className="text-red-500">*</span></Label>
                        <Textarea placeholder="Type message here."></Textarea>
                    </div>
                    <Button className="rounded-xl">
                        Send now
                    </Button>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col flex-1 py-20">
                    <span className="text-2xl font-bold">Address</span>
                    <p className="text-neutral-500">DÔVV Mimboman-Shakespeare Yaoundé</p>

                    <div className="bg-neutral-50 rounded-3xl w-full h-full mt-6">

                    </div>
                </div>
            </div>
        </div>
    )

}