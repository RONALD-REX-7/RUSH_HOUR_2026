import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiCheckCircle, FiUploadCloud, FiMapPin, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';

import { supabase } from '../services/supabase';
import { AuthContext } from '../context/AuthContext';

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

const ReportProblem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Environment' });
  const [position, setPosition] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const categories = ['Infrastructure', 'Environment', 'Public Safety', 'Transportation', 'Healthcare', 'Education'];

  useEffect(() => {
    if (navigator.geolocation && step === 2 && !position) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation disabled')
      );
    }
  }, [step, position]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all details.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to report a problem.');
      return;
    }
    if (!position) {
      toast.error('Please select a location on the map.');
      return;
    }

    setLoading(true);
    
    try {
      let imageUrl = null;

      // 1. Upload compressed image to Supabase Storage
      if (file) {
        setLoadingMessage('Compressing & uploading image...');
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('problem-images')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('problem-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // 2. Insert into Supabase PostgreSQL (problems table)
      setLoadingMessage('Saving report to database...');
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
      setLoadingMessage('Gemini AI is analyzing the impact...');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem_id: problemData.id })
      });
      
      const aiResponse = await response.json();

      if (!response.ok) {
        toast.error('AI Analysis failed, but report was saved.');
      } else if (aiResponse.success && aiResponse.reason) {
         toast(aiResponse.message + ': ' + aiResponse.reason, { icon: '⚠️' });
      } else {
        toast.success('Problem reported successfully! AI is analyzing it.');
      }
      
      navigate('/citizen/dashboard');
      
    } catch (error) {
      console.error('Error reporting problem:', error);
      toast.error(error.message || 'An error occurred while reporting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col items-center relative w-1/3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors z-10 
              ${step >= num ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-dark-700 text-dark-400 border border-dark-600'}`}>
              {step > num ? <FiCheckCircle /> : num}
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-primary-400' : 'text-dark-400'}`}>
              {num === 1 ? 'Details' : num === 2 ? 'Location' : 'Submit'}
            </span>
            {num !== 3 && (
              <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${step > num ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-8 min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
             <FiCpu className="w-16 h-16 text-accent-violet mb-4 animate-pulse-glow" />
             <h2 className="text-2xl font-bold text-white mb-2">Processing Report</h2>
             <p className="text-primary-400 font-medium">{loadingMessage}</p>
             <div className="mt-8 flex space-x-2">
               <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
               <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
               <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
             </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in flex-1">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Describe the Issue</h2>
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Problem Title <span className="text-red-400">*</span></label>
                  <input 
                    type="text" required 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                    placeholder="e.g. Broken water mains in Downtown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Detailed Description <span className="text-red-400">*</span></label>
                  <textarea 
                    required rows="4"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Describe the impact, frequency, and severity..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        type="button" key={cat}
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${formData.category === cat ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-dark-900 border-dark-600 text-dark-200 hover:border-dark-500'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in flex-1">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Location & Evidence</h2>
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2 flex justify-between">
                    <span>Pinpoint Location <span className="text-red-400">*</span></span>
                    {!position && <span className="text-amber-400 text-xs flex items-center"><FiAlertTriangle className="mr-1"/> Click map to set location</span>}
                  </label>
                  <div className="h-64 rounded-xl overflow-hidden border-2 border-dark-600 relative z-0 shadow-inner">
                    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Upload Photo (Optional)</label>
                  <div className="w-full relative border-2 border-dashed border-dark-600 rounded-xl p-8 text-center hover:bg-dark-700/50 hover:border-primary-500 transition-colors cursor-pointer group">
                    <input 
                      type="file" accept="image/*" onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FiUploadCloud className="mx-auto h-12 w-12 text-dark-400 group-hover:text-primary-400 mb-4 transition-colors" />
                    <span className="text-white font-medium block">
                      {file ? file.name : "Click or drag to upload an image"}
                    </span>
                    <span className="text-dark-400 text-sm mt-2 block">PNG, JPG up to 5MB</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center text-center animate-fade-in flex-1 py-10">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <FiCheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Submit</h2>
                <p className="text-dark-300 max-w-md mb-8">
                  Your report will be sent to our Gemini AI engine to generate actionable startup insights based on your description.
                </p>
                <div className="w-full bg-dark-900 rounded-xl p-6 border border-dark-600 text-left">
                  <p className="text-sm text-dark-400 mb-1">Title</p>
                  <p className="text-white font-medium mb-4">{formData.title}</p>
                  <p className="text-sm text-dark-400 mb-1">Location Set</p>
                  <p className="text-emerald-400 font-medium flex items-center"><FiMapPin className="mr-2"/> Coordinates Saved</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-dark-700">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-lg text-dark-200 hover:text-white transition-colors">
                  Back
                </button>
              ) : <div></div>}
              
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary">
                  Continue
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="btn-primary px-8">
                  Submit to AI
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportProblem;
