"use client"
import {IoNotifications, IoNotificationsOutline} from "react-icons/io5";
import useSWR from "swr";
import Link from "next/link";
import {useState} from "react";
const fetchResponse = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
export default function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading } = useSWR<{
        data: Array<object>;
        notifications: object[];
        user: object;
        events: object[];
    }>(`/api/notifications/getNotifications`, fetchResponse);
    let events;
    let notifications : any[] = [];
    if (data?.user){
        events = data?.events
        notifications = data?.notifications
    }
    const handleNotificationClick = async (notificationId: string) => {
        try {
            // @ts-ignore
            await fetch(`/api/notifications/markAsRead?notificationId=${notificationId}&userId=${data?.notifications[0].userId}`, {
                method: "PUT",
            });
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour de la notification :", error);
        }
    };
    return(
        <div className={"bg-red-600"}>
            <button className={"text-2xl top-[2.5rem] right-[3.5rem] absolute"}
                    onClick={() => {
                        setIsOpen(!isOpen)

                    }}>
                {notifications?.length > 0 && <IoNotifications/>}
                {notifications?.length === 0 || notifications === undefined && <IoNotificationsOutline/>}
            </button>

            {isOpen && (
                <div className={"absolute grid list-none right-16 top-[4.3rem] bg-slate-800 z-10 w-[50vw]"}>
                    {notifications?.map((notification: any) => (
                        <Link key={notification.id} href={`/events/${notification.eventId}`}>
                            <li
                                key={notification.id}
                                className={"text-sm border-gray-950 border-b py-2 px-4 font-light hover:bg-slate-600"}
                                onClick={() => handleNotificationClick(notification.id)}
                            >
                                {notification.details}
                            </li>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}