import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { createSwapy } from "swapy";

export const Route = createFileRoute('/_authenticated/swappy')({
  component: () => <SwappyTest />
});

const SLOTS_PER_DAY = 24; // Assuming 1-hour slots for a day
const DAYS = 7; // A week view

function SwappyTest() {
  const [appointments, setAppointments] = useState([
    { id: 'a', slot: 2, duration: 3, title: 'Meeting A' },
    { id: 'b', slot: 26, duration: 2, title: 'Call B' },
    { id: 'c', slot: 50, duration: 4, title: 'Workshop C' },
  ]);

  useEffect(() => {
    const container = document.querySelector('.container');
    if (container) {
      const swapy = createSwapy(container);
      swapy.onSwap(({ data }) => {
        console.log(data);
        // Update appointment position based on the swap
        setAppointments(prevAppointments => {
          return prevAppointments.map(app =>
            app.id === data.object.id ? { ...app, slot: parseInt(data.slot) } : app
          );
        });
      });
    }
  }, []);

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < DAYS * SLOTS_PER_DAY; i++) {
      const appointment = appointments.find(app => app.slot === i);
      slots.push(
        <div key={i} className="slot border border-gray-200 h-8 relative" data-swapy-slot={i}>
          {appointment && (
            <div
              className="appointment bg-blue-200 p-1 absolute top-0 left-0 right-0"
              style={{ height: `${appointment.duration * 32}px` }}
              data-swapy-item={appointment.id}
            >
              {appointment.title}
            </div>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="container grid grid-cols-7 gap-0">
      {renderSlots()}
    </div>
  );
}
