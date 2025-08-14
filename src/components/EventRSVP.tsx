import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Heart } from 'lucide-react';

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

interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'not going' | 'interested';
  created_at: string;
}

interface EventRSVPProps {
  userEmail: string;
}

const EventRSVP: React.FC<EventRSVPProps> = ({ userEmail }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userRSVPs, setUserRSVPs] = useState<Record<string, RSVP>>({});
  const [loading, setLoading] = useState(true);
  const [updatingRSVP, setUpdatingRSVP] = useState<string | null>(null);

  useEffect(() => {
    fetchEventsAndRSVPs();
  }, [userEmail]);

  const fetchEventsAndRSVPs = async () => {
    try {
      // Fetch upcoming events
      const today = new Date().toISOString().split('T')[0];
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      setEvents(eventsData || []);

      // Fetch user's RSVPs
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id);

        if (rsvpError) throw rsvpError;

        const rsvpMap: Record<string, RSVP> = {};
        (rsvpData || []).forEach(rsvp => {
          rsvpMap[rsvp.event_id] = rsvp;
        });
        setUserRSVPs(rsvpMap);
      }
    } catch (error) {
      console.error('Error fetching events and RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'not going' | 'interested') => {
    setUpdatingRSVP(eventId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const existingRSVP = userRSVPs[eventId];

      if (existingRSVP) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRSVP.id);

        if (error) throw error;

        setUserRSVPs({
          ...userRSVPs,
          [eventId]: { ...existingRSVP, status }
        });
      } else {
        // Create new RSVP
        const { data, error } = await supabase
          .from('event_rsvps')
          .insert([{
            event_id: eventId,
            user_id: user.id,
            status
          }])
          .select()
          .single();

        if (error) throw error;

        setUserRSVPs({
          ...userRSVPs,
          [eventId]: data
        });
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    } finally {
      setUpdatingRSVP(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventPast = (dateString: string, timeString: string) => {
    const eventDateTime = new Date(`${dateString}T${timeString}`);
    return eventDateTime < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Upcoming Events</h2>
        <p className="text-gray-300">RSVP to events you're interested in attending</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No upcoming events</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new events!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => {
            const userRSVP = userRSVPs[event.id];
            const isPast = isEventPast(event.date, event.time);
            const isUpdating = updatingRSVP === event.id;

            return (
              <div key={event.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Event Poster */}
                  <div className="lg:w-1/3">
                    {event.poster_url ? (
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-48 lg:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 lg:h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{event.description}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-5 h-5 text-green-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* RSVP Section */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Your RSVP</span>
                        </h4>
                        {userRSVP && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userRSVP.status === 'going' ? 'bg-green-900 text-green-300' :
                            userRSVP.status === 'interested' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {userRSVP.status === 'going' ? 'Going' :
                             userRSVP.status === 'interested' ? 'Interested' :
                             'Not Going'}
                          </span>
                        )}
                      </div>

                      {!isPast && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleRSVP(event.id, 'going')}
                            disabled={isUpdating}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              userRSVP?.status === 'going'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Going</span>
                          </button>

                          <button
                            onClick={() => handleRSVP(event.id, 'interested')}
                            disabled={isUpdating}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              userRSVP?.status === 'interested'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 hover:bg-yellow-600 text-gray-300 hover:text-white'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Interested</span>
                          </button>

                          <button
                            onClick={() => handleRSVP(event.id, 'not going')}
                            disabled={isUpdating}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              userRSVP?.status === 'not going'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Not Going</span>
                          </button>
                        </div>
                      )}

                      {isPast && (
                        <div className="text-gray-400 text-sm">
                          This event has already passed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventRSVP;