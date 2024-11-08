import { CalendarUI } from "@/components/CalendarUI";

export default function Home() {
  return (
    <div className="w-full min-h-screen py-4 px-4 sm:px-2 ">
      <div className="flex justify-center items-center">
        <div className="w-full">
          <CalendarUI />
        </div>
      </div>
    </div>
  );
}
