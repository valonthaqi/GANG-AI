// "use client";

// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { DateSelectArg } from "@fullcalendar/core";

// type CalendarEvent = {
//   id: string;
//   title: string;
//   start: string | Date;
//   end: string | Date;
//   color?: string;
// };

// export default function CalendarPage() {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       const user = session?.user;
//       if (!user) return;

//       const { data, error } = await supabase
//         .from("events")
//         .select("*")
//         .eq("user_id", user.id);

//       if (error) {
//         console.error("Failed to load events", error);
//       } else {
//         const mapped = data.map((e) => ({
//           id: e.id,
//           title: e.title,
//           start: e.start_time,
//           end: e.end_time,
//           color: e.color || "#60a5fa", // Tailwind blue-400
//         }));
//         setEvents(mapped);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const handleDateSelect = async (info: DateSelectArg) => {
//     const title = prompt("Enter a title for this event:");
//     if (!title) return;

//     const {
//       data: { session },
//     } = await supabase.auth.getSession();
//     const user = session?.user;
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("events")
//       .insert({
//         user_id: user.id,
//         title,
//         start_time: info.startStr,
//         end_time: info.endStr,
//         color: "#60a5fa", // Tailwind blue
//       })
//       .select()
//       .maybeSingle();

//     if (error) {
//       console.error("Failed to add event", error);
//     } else {
//       setEvents((prev) => [
//         ...prev,
//         {
//           id: data.id,
//           title: data.title,
//           start: data.start_time,
//           end: data.end_time,
//           color: data.color,
//         },
//       ]);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 text-black font-sans">
//       <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
//         <span className="text-red-500 text-3xl">📅</span> Your Calendar
//       </h1>
//       <div className="rounded-lg shadow border bg-white p-4">
//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="timeGridWeek"
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay",
//           }}
//           height="auto"
//           selectable={true}
//           editable={false}
//           events={events}
//           select={handleDateSelect}
//           eventDisplay="block"
//           dayHeaderClassNames="text-gray-600 font-medium text-sm"
//           eventClassNames="rounded-md px-2 py-1 text-white text-xs font-medium shadow-sm"
//         />
//       </div>
//     </div>
//   );
// }
