import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Image, X, CheckCircle, AlertCircle } from 'lucide-react';

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

interface EventWithRSVPs extends Event {
  rsvp_counts: {
    going: number;
    not_going: number;
    interested: number;
    total: number;
  };
}

interface EventManagementProps {
  isAdmin: boolean;
}

const EventManagement: React.FC<EventManagementProps> = ({ isAdmin }) => {
  const [events, setEvents] = useState<EventWithRSVPs[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      if (isAdmin) {
        // Fetch RSVP counts for admin view
        const eventsWithRSVPs = await Promise.all(
          (eventsData || []).map(async (event) => {
            const { data: rsvpData, error: rsvpError } = await supabase
              .from('event_rsvps')
              .select('status')
              .eq('event_id', event.id);

            if (rsvpError) {
              console.error('Error fetching RSVPs:', rsvpError);
              return {
                ...event,
                rsvp_counts: { going: 0, not_going: 0, interested: 0, total: 0 }
              };
            }

            const going = rsvpData?.filter(r => r.status === 'going').length || 0;
            const not_going = rsvpData?.filter(r => r.status === 'not going').length || 0;
            const interested = rsvpData?.filter(r => r.status === 'interested').length || 0;

            return {
              ...event,
              rsvp_counts: {
                going,
                not_going,
                interested,
                total: going + not_going + interested
              }
            };
          })
        );

        setEvents(eventsWithRSVPs);
      } else {
        setEvents((eventsData || []).map(event => ({
          ...event,
          rsvp_counts: { going: 0, not_going: 0, interested: 0, total: 0 }
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isAdmin && (
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Event Management</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No events scheduled</p>
          {isAdmin && (
            <p className="text-gray-500 text-sm mt-2">Create your first event to get started!</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
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
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{event.description}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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

                  {isAdmin && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>RSVP Summary</span>
                      </h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-400">{event.rsvp_counts.going}</div>
                          <div className="text-gray-400 text-sm">Going</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">{event.rsvp_counts.interested}</div>
                          <div className="text-gray-400 text-sm">Interested</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">{event.rsvp_counts.not_going}</div>
                          <div className="text-gray-400 text-sm">Not Going</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{event.rsvp_counts.total}</div>
                          <div className="text-gray-400 text-sm">Total</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateForm || editingEvent) && (
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
          onSuccess={() => {
            fetchEvents();
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

interface EventFormModalProps {
  event?: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EventFormModal: React.FC<EventFormModalProps> = ({ event, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    poster_url: event?.poster_url || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `event-posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        poster_url: publicUrl
      });
    } catch (error: any) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (event) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            poster_url: formData.poster_url || null
          })
          .eq('id', event.id);

        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([{
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            poster_url: formData.poster_url || null
          }]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError('Failed to save event. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the event..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Event location"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2 flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Event Poster (Optional)</span>
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-colors"
                disabled={isUploadingImage}
              />
              {isUploadingImage && (
                <div className="flex items-center space-x-2 text-purple-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                  <span>Uploading image...</span>
                </div>
              )}
              {formData.poster_url && (
                <div className="relative">
                  <img
                    src={formData.poster_url}
                    alt="Event poster"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, poster_url: '' })}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventManagement;