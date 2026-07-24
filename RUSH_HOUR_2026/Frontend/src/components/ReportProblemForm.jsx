import React, { useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../services/supabase';
import { AuthContext } from '../context/AuthContext';
import L from 'leaflet';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function ReportProblemForm() {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Environment'
  });
  
  const [position, setPosition] = useState(null); // {lat, lng}
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to report a problem.');
      return;
    }
    if (!position) {
      setMessage('Please select a location on the map.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let imageUrl = null;

      // 1. Upload image to Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('problem-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('problem-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // 2. Insert into Supabase PostgreSQL (problems table)
      const locationString = `${position.lat},${position.lng}`;
      
      const { data: problemData, error: problemError } = await supabase
        .from('problems')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: locationString,
            image_url: imageUrl,
            status: 'Pending'
          }
        ])
        .select()
        .single();

      if (problemError) throw problemError;

      // 3. Trigger Gemini AI analysis via Node.js Backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If the backend checks for JWT auth, we might need to send the session token
          // For now, we assume the backend route checks the token if needed
        },
        body: JSON.stringify({ problem_id: problemData.id })
      });

      if (!response.ok) {
        console.warn('AI Analysis failed, but report was saved.');
      }

      setMessage('Problem reported successfully! AI is analyzing it.');
      setFormData({ title: '', description: '', category: 'Environment' });
      setFile(null);
      setPosition(null);
      
    } catch (error) {
      console.error('Error reporting problem:', error);
      setMessage(error.message || 'An error occurred while reporting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report a Problem</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Garbage overflow near station"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Environment</option>
            <option>Transport</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Infrastructure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location (Click map to drop pin)</label>
          <div className="h-64 rounded-md overflow-hidden border">
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
