

// export default function Footer() {
//     return (
//         <footer className="w-full bg-gradient-to-b from-[#F1EAFF] to-[#FFFFFF] text-gray-800">
//             <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
//                 <div className="flex items-center space-x-3 mb-6">
//                     <img alt="" className="h-11"
//                         src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShapeDark.svg" />
//                 </div>
//                 <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
//                     Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas
//                     into reality.
//                 </p>
//             </div>
//             <div className="border-t border-slate-200">
//                 <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
//                     prebuiltui ©2025. All rights reserved.
//                 </div>
//             </div>
//         </footer>
//     );
// };







export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#F1EAFF] to-[#FFFFFF] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info - Centered */}
          <div className="md:col-span-3 flex flex-col items-center text-center">
            <div className="flex items-center space-x-3 mb-4">
              
              <span className="text-2xl font-bold text-indigo-700">ReportHub</span>
            </div>
            <p className="text-sm max-w-2xl font-normal leading-relaxed text-gray-600">
              Your comprehensive platform for efficient report management and analytics. 
              Streamline your workflow with our powerful reporting tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Reports', 'Analytics', 'Settings'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Help Center', 'API Docs', 'Tutorials', 'Status'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@reporthub.com" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  support@reporthub.com
                </a>
              </li>
              <li className="text-sm text-gray-600">
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-gray-600">
                123 Report Street, Data City
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
               
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} ReportHub. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                GDPR
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}