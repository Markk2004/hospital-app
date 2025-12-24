import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, X, Info } from 'lucide-react';

interface NewsSliderProps {
  onEnterSite: () => void;
}

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  facts: string[];
}

export function NewsSlider({ onEnterSite }: NewsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showFactsModal, setShowFactsModal] = useState(false);

  // ข้อมูล Slides
  const slides: SlideData[] = [
    {
      id: 1,
      image: '/images/1.jpg', // รูปทีมแพทย์
      title: 'ยินดีต้อนรับสู่ระบบจัดการครุภัณฑ์โรงพยาบาล',
      subtitle: 'ทีมแพทย์และบุคลากรมืออาชีพ',
      description: 'ระบบบริหารจัดการครุภัณฑ์ทางการแพทย์ที่ทันสมัย รองรับการทำงานของทีมแพทย์และบุคลากรทางการแพทย์อย่างมีประสิทธิภาพ',
      facts: [
        '🏥 ระบบช่วยลดเวลาในการค้นหาและจัดการครุภัณฑ์ได้ถึง 60%',
        '📊 รองรับการติดตามและวิเคราะห์ข้อมูลแบบ Real-time',
        '🔧 ระบบแจ้งเตือนการบำรุงรักษาอัตโนมัติ ช่วยป้องกันเครื่องมือเสียหาย',
        '💡 ลดต้นทุนการจัดซื้อครุภัณฑ์ซ้ำซ้อนได้มากกว่า 40%',
        '🌐 รองรับการทำงานแบบ Multi-user พร้อมระบบสิทธิ์การเข้าถึงที่ปลอดภัย'
      ]
    },
    {
      id: 2,
      image: '/images/2.jpg', // รูปพิธีมอบรางวัล
      title: 'มาตรฐานระดับสากล ได้รับการยอมรับ',
      subtitle: 'Medical Excellence Award',
      description: 'ระบบที่ได้มาตรฐานสากล รองรับการทำงานของโรงพยาบาลชั้นนำ พร้อมการจัดการครุภัณฑ์แบบครบวงจร',
      facts: [
        '🏆 ได้รับการรับรองมาตรฐาน ISO 13485 สำหรับระบบจัดการอุปกรณ์การแพทย์',
        '✅ ผ่านการตรวจสอบจาก FDA และ CE Mark สำหรับระบบบริหารจัดการทางการแพทย์',
        '📈 มีโรงพยาบาลชั้นนำกว่า 50 แห่งทั่วประเทศเลือกใช้งาน',
        '🔒 ระบบรักษาความปลอดภัยข้อมูลระดับ Healthcare Grade',
        '⚡ อัพเดทฟีเจอร์ใหม่อย่างสม่ำเสมอตามมาตรฐานสากล'
      ]
    },
    {
      id: 3,
      image: '/images/3.jpg', // รูปบริการชุมชน
      title: 'ดูแลสุขภาพชุมชนด้วยระบบที่มีประสิทธิภาพ',
      subtitle: 'Community Health Care',
      description: 'ระบบจัดการครุภัณฑ์ที่ช่วยให้การให้บริการแก่ชุมชนเป็นไปอย่างราบรื่น พร้อมติดตามและบำรุงรักษาอุปกรณ์อย่างสม่ำเสมอ',
      facts: [
        '👥 ช่วยให้โรงพยาบาลสามารถดูแลผู้ป่วยได้มากขึ้นกว่า 30% ต่อวัน',
        '🚑 ระบบติดตาม Medical Equipment ช่วยให้พร้อมใช้งานได้ตลอด 24 ชั่วโมง',
        '📱 รองรับการใช้งานผ่าน Mobile Application สำหรับทีมแพทย์เคลื่อนที่',
        '💊 เชื่อมต่อกับระบบคลังยาและเวชภัณฑ์ เพื่อการจัดการแบบบูรณาการ',
        '🌟 ช่วยยกระดับคุณภาพการให้บริการสุขภาพในชุมชนห่างไกล'
      ]
    }
  ];

  const totalSlides = slides.length;

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // เปลี่ยนทุก 5 วินาที

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="relative w-full h-full">
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  filter: 'brightness(0.7)'
                }}
              />
              
              {/* Gradient Overlay - ปรับให้เข้มขึ้นเพื่อให้ข้อความอ่านง่าย */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/70 to-blue-900/50" />
              
              {/* Medical Pattern Overlay */}
              <div className="absolute inset-0 bg-medical-pattern opacity-5" />
            </div>

            {/* Content Overlay with Image Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                  
                  {/* Left Side - Text Content */}
                  <div className="animate-in slide-in-from-left duration-700 order-2 md:order-1">
                    {/* Subtitle */}
                    <div className="inline-block mb-4">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={onEnterSite}
                        className="group flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 rounded-xl font-bold text-base md:text-lg shadow-2xl hover:shadow-blue-500/50 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        <span>เข้าสู่เว็บไซต์</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => setShowFactsModal(true)}
                        className="group flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300"
                      >
                        <Info className="w-5 h-5" />
                        <span>เกร็ดความรู้</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Image Frame */}
                  <div className="animate-in slide-in-from-right duration-700 order-1 md:order-2">
                    <div className="relative group">
                      {/* Decorative Background */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      
                      {/* Image Container with Frame */}
                      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border-4 border-white/30 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                        <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300">
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image not found
                              e.currentTarget.src = `https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Slide+${slide.id}`;
                            }}
                          />
                          
                          {/* Image Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Corner Decorations */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-300 rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-300 rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-300 rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-300 rounded-br-xl"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-xl hover:scale-110 active:scale-95 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-xl hover:scale-110 active:scale-95 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white shadow-lg'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70 hover:scale-125'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 shadow-glow"
          style={{
            width: `${((currentSlide + 1) / totalSlides) * 100}%`
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/30">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Facts Modal */}
      {showFactsModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">เกร็ดความรู้</h3>
                  <p className="text-sm text-white/80">{slides[currentSlide].subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFactsModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">
                {slides[currentSlide].title}
              </h4>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {slides[currentSlide].description}
              </p>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <span>ข้อมูลน่าสนใจ</span>
                </h5>
                
                <div className="space-y-3">
                  {slides[currentSlide].facts.map((fact, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1 pt-1">
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowFactsModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  ปิด
                </button>
                <button
                  onClick={() => {
                    setShowFactsModal(false);
                    onEnterSite();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  เข้าสู่เว็บไซต์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
