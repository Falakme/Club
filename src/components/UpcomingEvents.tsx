import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  poster_url: string | null;
  created_at: string;
}

interface UpcomingEventsProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ 
  limit = 3, 
  showViewAll = false, 
  onViewAll 
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [limit]);

  const fetchUpcomingEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, month };
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
        {showViewAll && events.length > 0 && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {events.map((event) => {
          const { day, month } = formatDate(event.date);
          
          return (
            <div key={event.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-purple-500 transition-all duration-300 group">
              <div className="flex space-x-4">
                {/* Date Badge */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex flex-col items-center justify-center text-white">
                  <div className="text-xs font-medium uppercase">{month}</div>
                  <div className="text-lg font-bold">{day}</div>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Event Poster Thumbnail */}
                {event.poster_url && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;