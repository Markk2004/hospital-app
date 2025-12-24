import React, { useState } from 'react';
import { Upload, Calendar, X } from 'lucide-react';

interface AssetFormData {
  code: string;
  name: string;
  type: string;
  serialNumber: string;
  department: string;
  location: string;
  startDate: string;
  status: string;
  purchasePrice: string;
  purchaseDate: string;
  lifespan: string;
  budgetSource: string;
}

const initialFormData: AssetFormData = {
  code: '',
  name: '',
  type: '',
  serialNumber: '',
  department: '',
  location: '',
  startDate: '',
  status: '',
  purchasePrice: '',
  purchaseDate: '',
  lifespan: '',
  budgetSource: ''
};

export const AssetRegisterView: React.FC = () => {
  const [formData, setFormData] = useState<AssetFormData>(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (field: keyof AssetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setUploadedFiles([]);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    alert('บันทึกข้อมูลเรียบร้อย');
  };

  const handleSaveAndNew = () => {
    console.log('Saving:', formData);
    alert('บันทึกข้อมูลและเพิ่มรายการใหม่');
    setFormData(initialFormData);
    setUploadedFiles([]);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Section 1: ข้อมูลทั่วไป */}
        <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            ข้อมูลทั่วไป
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รหัสครุภัณฑ์ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                รหัสครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="AS-0001"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* ชื่อครุภัณฑ์ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ชื่อครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="ระบุชื่อครุภัณฑ์"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* ประเภทครุภัณฑ์ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ประเภทครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              >
                <option value="">เลือกประเภท</option>
                <option value="medical">เครื่องมือแพทย์</option>
                <option value="furniture">เฟอร์นิเจอร์การแพทย์</option>
                <option value="diagnostic">เครื่องมือวินิจฉัย</option>
                <option value="monitoring">เครื่องมือตรวจสอบ</option>
                <option value="lifesaving">เครื่องมือช่วยชีวิต</option>
              </select>
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                placeholder="SN-XXXXX"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: ข้อมูลการใช้งาน */}
        <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded-full"></div>
            ข้อมูลการใช้งาน
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* แผนก */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                แผนก <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              >
                <option value="">เลือกแผนก</option>
                <option value="emergency">ฉุกเฉิน</option>
                <option value="icu">ICU</option>
                <option value="surgery">ห้องผ่าตัด</option>
                <option value="inpatient">ผู้ป่วยใน</option>
                <option value="outpatient">ผู้ป่วยนอก</option>
                <option value="radiology">รังสีวิทยา</option>
                <option value="laboratory">ห้องปฏิบัติการ</option>
              </select>
            </div>

            {/* สถานที่ตั้ง */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                สถานที่ตั้ง
              </label>
              <input
                type="text"
                placeholder="ระบุสถานที่ตั้ง"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* วันที่เริ่มใช้งาน */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                วันที่เริ่มใช้งาน
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* สถานะ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                สถานะ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              >
                <option value="">เลือกสถานะ</option>
                <option value="ready">พร้อมใช้งาน</option>
                <option value="inuse">กำลังใช้งาน</option>
                <option value="damaged">ชำรุด</option>
                <option value="repair">ซ่อมแซม</option>
                <option value="disposed">จำหน่ายออก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: ข้อมูลทางบัญชี */}
        <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            ข้อมูลทางบัญชี
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ราคาซื้อ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ราคาซื้อ (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* วันที่จัดซื้อ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                วันที่จัดซื้อ
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* อายุการใช้งาน */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                อายุการใช้งาน (ปี)
              </label>
              <input
                type="number"
                placeholder="5"
                value={formData.lifespan}
                onChange={(e) => handleInputChange('lifespan', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              />
            </div>

            {/* แหล่งงบประมาณ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                แหล่งงบประมาณ
              </label>
              <select
                value={formData.budgetSource}
                onChange={(e) => handleInputChange('budgetSource', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
              >
                <option value="">เลือกแหล่งงบประมาณ</option>
                <option value="budget">งบประมาณ</option>
                <option value="donation">เงินบริจาค</option>
                <option value="grant">เงินอุดหนุน</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: แนบรูป/เอกสาร */}
        <div className="glass-morphism glass-morphism-hover p-6 rounded-2xl animate-fade-in-up animation-delay-300">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
            แนบรูป/เอกสาร
          </h2>
          
          <div>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                <p className="text-sm text-slate-600 font-semibold mb-1">
                  คลิกเพื่ออัปโหลดไฟล์
                </p>
                <p className="text-xs text-slate-500">
                  รองรับ PNG, JPG, PDF (สูงสุด 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
            </label>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700">ไฟล์ที่แนบ:</p>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                    >
                      <X className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 animate-fade-in-up animation-delay-400">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
          >
            บันทึก
          </button>
          <button
            onClick={handleSaveAndNew}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-600/30"
          >
            บันทึกและเพิ่มใหม่
          </button>
        </div>

        {/* Spacing at bottom */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};
