import { useState } from 'react';

export default function CaregiverRegistration() {
  // Define the TypeScript interface for form data
  interface FormData {
    fullName: string;
    idNumber: string;
    address: string;
    age: string;
    gender: string;
    profilePhoto: File | null;
    idCardFront: File | null;
    idCardBack: File | null;
    mobileNumber: string;
    email: string;
    qualification: File | null;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    idNumber: '',
    address: '',
    age: '',
    gender: '',
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null,
    mobileNumber: '',
    email: '',
    qualification: null,
    password: '',
    confirmPassword: ''
  });

  // ✅ FIXED: added parameter types
  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ FIXED: added types for both parameters
  const handleFileUpload = (
    field: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange(field, file);
      alert(`${file.name} uploaded successfully!`);
    }
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registration data:', formData);
    alert('Registration submitted! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Phone Frame */}
        <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Notch */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl"></div>
              
              {/* Header */}
              <div className="pt-12 pb-6 text-center px-6">
                <h1 className="text-2xl font-bold text-white">Caregiver Registration</h1>
                <p className="text-white text-sm mt-1 opacity-90">Join the GuardianNet community</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="h-[650px] overflow-y-auto bg-white px-6 py-6">
              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* ID Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={3} // ✅ FIXED: use number literal, not string
                />
              </div>

              {/* Age and Gender Row */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Upload Profile Photo */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Upload Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-blue-300 flex items-center justify-center overflow-hidden">
                    {formData.profilePhoto ? (
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('profilePhoto', e)}
                      className="hidden"
                    />
                    <div className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm">
                      Choose Photo
                    </div>
                  </label>
                </div>
              </div>

              {/* Upload NIC */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-3">
                  Upload National Identity Card
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idCardFront', e)}
                      className="hidden"
                    />
                    <div className="px-4 py-8 bg-gray-50 border-2 border-dashed border-blue-300 rounded-xl hover:bg-gray-100 transition-colors text-center">
                      <p className="text-sm font-medium text-gray-600">Upload Front</p>
                      {formData.idCardFront && (
                        <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                      )}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idCardBack', e)}
                      className="hidden"
                    />
                    <div className="px-4 py-8 bg-gray-50 border-2 border-dashed border-blue-300 rounded-xl hover:bg-gray-100 transition-colors text-center">
                      <p className="text-sm font-medium text-gray-600">Upload Back</p>
                      {formData.idCardBack && (
                        <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* Qualification */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Add Your Qualification/Certificate
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('qualification', e)}
                    className="hidden"
                  />
                  <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    {formData.qualification ? (
                      <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-3xl text-gray-400">+</span>
                    )}
                  </div>
                </label>
                {formData.qualification && (
                  <p className="text-xs text-gray-600 mt-2">Grama Niladhari certificate uploaded</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 mb-4"
              >
                Register Account
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-gray-600">
                By registering, you agree to our{' '}
                <span className="font-semibold">Terms of Service</span> and{' '}
                <span className="font-semibold">Verification Process</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
