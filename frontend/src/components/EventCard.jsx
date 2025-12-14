import React from 'react';
// IMPORT ICON DARI ASSET
import calendarIcon from '../assets/icons/ic-calendar.svg';
import clockIcon from '../assets/icons/ic-clock.svg';
import locationIcon from '../assets/icons/ic-location.svg';

const EventCard = ({ event, onClick }) => {
  const now = new Date();
  
  let isFinished = false;
  if (event.end_time) {
    const endTime = new Date(event.end_time);
    if (!isNaN(endTime.getTime())) {
       isFinished = now > endTime;
    }
  }

  const isCancelled = event.status === 'cancelled';
  
  const isInactive = isFinished || isCancelled;
  return (
    <div className="bg-white rounded-card border border-neutral-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      
      {/* Gambar Thumbnail */}
      <div className="h-48 w-full bg-gray-200 relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-[#ECEEF2] text-[#030213] text-[12px] px-3 py-1 rounded-full">
            {event.organizer}
          </span>
          <span className="bg-primary-main text-white text-[12px] px-3 py-1 rounded-full">
            {event.quotaFilled}/{event.quotaTotal} peserta
          </span>
        </div>

        <h3 className="text-body text-neutral-main mb-2 leading-tight">
          {event.title}
        </h3>

        <p className="text-body text-neutral-secondary mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>

        {/* METADATA DENGAN ICON ASSET */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-neutral-secondary">
            {/* Icon Calendar */}
            <img src={calendarIcon} alt="Date" className="w-4 h-4" />
            <span className="text-[14px]">{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-neutral-secondary">
            {/* Icon Clock */}
            <img src={clockIcon} alt="Time" className="w-4 h-4" />
            <span className="text-[14px]">{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-neutral-secondary">
            {/* Icon Location */}
            <img src={locationIcon} alt="Location" className="w-4 h-4" />
            <span className="text-[14px]">{event.location}</span>
          </div>
        </div>

        <button onClick={onClick} className="w-full h-btn rounded-btn bg-primary-main text-white text-[14px] hover:bg-primary-hover transition-colors">
          {isInactive ? 'Lihat Detail' : 'Lihat Detail & Daftar'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;